import emailjs from "@emailjs/browser";

const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "z8p4cW6WnLpd3g5FA";
const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_vhulg89";
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_v478kbo";

export async function sendContactMessage({ email, fullName, message }) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    const error = new Error(
      "Contact email is not configured. Set the EmailJS public key, service ID, and template ID.",
    );
    error.code = "EMAILJS_CONFIG_MISSING";
    throw error;
  }

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      name: fullName,
      full_name: fullName,
      user_name: fullName,
      from_name: fullName,
      email,
      user_email: email,
      from_email: email,
      reply_to: email,
      title: `Portfolio contact from ${fullName}`,
      message,
      subject: `Portfolio contact from ${fullName}`,
    },
    { publicKey: EMAILJS_PUBLIC_KEY },
  );
}

export async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      console.warn("Clipboard API unavailable; trying the compatibility fallback.", error);
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("The browser could not copy text to the clipboard.");
  }
}
