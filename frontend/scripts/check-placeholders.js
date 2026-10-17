import { readdir, readFile } from "node:fs/promises";
import { parse } from "@babel/parser";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const dataDirectory = fileURLToPath(new URL("../src/data/", import.meta.url));
const strict = process.argv.includes("--strict");
const placeholderPattern = /\[[^\]\r\n]+\]/;
const findings = [];

async function findDataFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findDataFiles(entryPath);
      if (entry.isFile() && /\.(?:js|mjs|json)$/.test(entry.name)) return [entryPath];
      return [];
    }),
  );
  return nested.flat();
}

function inspectValue(value, file, keyPath, visited) {
  if (typeof value === "string") {
    if (placeholderPattern.test(value)) findings.push({ file, keyPath, value });
    return;
  }

  if (!value || typeof value !== "object" || visited.has(value)) return;
  visited.add(value);

  for (const [key, nestedValue] of Object.entries(value)) {
    inspectValue(nestedValue, file, keyPath ? `${keyPath}.${key}` : key, visited);
  }
}

function inspectJavaScript(node, file, keyPath = "") {
  if (!node || typeof node !== "object") return;

  if (node.type === "StringLiteral") {
    if (placeholderPattern.test(node.value)) {
      findings.push({ file, keyPath: keyPath || "(string literal)", value: node.value });
    }
    return;
  }

  if (node.type === "TemplateLiteral") {
    const value = node.quasis.map(({ value: part }) => part.cooked ?? part.raw).join("");
    if (placeholderPattern.test(value)) {
      findings.push({ file, keyPath: keyPath || "(template literal)", value });
    }
    return;
  }

  if (node.type === "ObjectExpression") {
    for (const property of node.properties) {
      if (property.type !== "ObjectProperty") continue;
      const key =
        property.key.type === "Identifier"
          ? property.key.name
          : property.key.type === "StringLiteral"
            ? property.key.value
            : "";
      inspectJavaScript(property.value, file, keyPath ? `${keyPath}.${key}` : key);
    }
    return;
  }

  if (node.type === "ArrayExpression") {
    node.elements.forEach((element, index) =>
      inspectJavaScript(element, file, `${keyPath}[${index}]`),
    );
    return;
  }

  if (node.type === "Program") {
    for (const statement of node.body) inspectJavaScript(statement, file);
    return;
  }

  if (node.type === "ExportNamedDeclaration") {
    inspectJavaScript(node.declaration, file);
    return;
  }

  if (node.type === "VariableDeclaration") {
    for (const declaration of node.declarations) {
      const name = declaration.id.type === "Identifier" ? declaration.id.name : "";
      inspectJavaScript(declaration.init, file, name);
    }
  }
}

for (const file of await findDataFiles(dataDirectory)) {
  const source = await readFile(file, "utf8");
  const relativeFile = path.relative(process.cwd(), file);
  if (file.endsWith(".json")) {
    inspectValue(JSON.parse(source), relativeFile, "", new WeakSet());
  } else {
    const ast = parse(source, { sourceType: "module", plugins: ["jsx"] });
    inspectJavaScript(ast, relativeFile);
  }
}

if (findings.length === 0) {
  console.log("No square-bracket placeholders found in data files.");
} else {
  for (const { file, keyPath, value } of findings) {
    console.log(`${file} — ${keyPath || "(root)"}: ${value}`);
  }
}

if (strict && findings.length > 0) process.exitCode = 1;
