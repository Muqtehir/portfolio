import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

const introDevOverride = {
  name: "intro-dev-off-flash-guard",
  transformIndexHtml: {
    order: "pre",
    handler(html, context) {
      if (
        !context.server ||
        new URL(context.originalUrl, "http://localhost").searchParams.get("intro") !== "off"
      ) {
        return html;
      }
      return html.replace("var enabled = !seen && !deep;", "var enabled = false;");
    },
  },
};

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [tailwindcss(), react(), introDevOverride],
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/node_modules/three/")) return "three-vendor";
            if (id.includes("/node_modules/@react-three/fiber/")) return "fiber-vendor";
            if (id.includes("/node_modules/@react-three/drei/")) return "drei-vendor";
          },
        },
      },
    },
    optimizeDeps: {
      include: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    server: {
      allowedHosts: ["costa-societies-toilet-plugin.trycloudflare.com"],
      proxy: VITE_API_URL
        ? {
            "/api": {
              target: VITE_API_URL,
              changeOrigin: true,
              secure: VITE_API_URL.startsWith("https://"),
            },
          }
        : undefined,
    },
  };
});
