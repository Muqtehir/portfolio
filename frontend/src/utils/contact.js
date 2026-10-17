import emailjs from "@emailjs/browser";

export async function sendContactMessage({ email, fullName, message }) {
  const { VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID } =
    import.meta.env;

  if (!VITE_EMAILJS_PUBLIC_KEY || !VITE_EMAILJS_SERVICE_ID || !VITE_EMAILJS_TEMPLATE_ID) {
    const error = new Error(
      "Contact email is not configured. Set the EmailJS public key, service ID, and template ID.",
    );
    error.code = "EMAILJS_CONFIG_MISSING";
    throw error;
  }

  return emailjs.send(
    VITE_EMAILJS_SERVICE_ID,
    VITE_EMAILJS_TEMPLATE_ID,
    {
      from_name: fullName,
      reply_to: email,
      message,
      subject: `Portfolio contact from ${fullName}`,
    },
    { publicKey: VITE_EMAILJS_PUBLIC_KEY },
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
