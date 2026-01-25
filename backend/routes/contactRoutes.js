const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Configure SMTP transporter from env - best-effort (optional auth)
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT
  ? parseInt(process.env.SMTP_PORT, 10)
  : undefined;
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let transporter = null;
if (smtpHost) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort || 587,
    secure: smtpSecure || false,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  });

  transporter.verify().catch((err) => {
    console.warn("SMTP verify failed:", err && err.message ? err.message : err);
  });
} else {
  console.warn(
    "SMTP_HOST not set — email notifications disabled. Set SMTP_HOST/SMTP_USER/SMTP_PASS in .env to enable."
  );
}

// POST /api/contact
router.post("/", async (req, res) => {
  const { fullName, email, message } = req.body || {};

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const contact = new Contact({ fullName, email, message });
    await contact.save();

    // Send notification email (best-effort)
    const adminEmail =
      process.env.ADMIN_EMAIL || "izzatudeenmuqtehir@gmail.com";
    if (transporter) {
      const mailSubject = `New contact submission from ${fullName}`;
      const mailText = `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailHtml = `<p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${(
        message || ""
      ).replace(/\n/g, "<br/>")}</p>`;

      transporter
        .sendMail({
          from:
            process.env.SMTP_FROM ||
            `no-reply@${(smtpHost || "localhost").replace(/^smtp\./, "")}`,
          to: adminEmail,
          subject: mailSubject,
          text: mailText,
          html: mailHtml,
        })
        .then(() => console.log(`Contact email sent to ${adminEmail}`))
        .catch((err) =>
          console.error(
            "Error sending contact email:",
            err && err.message ? err.message : err
          )
        );
    } else {
      console.warn("Email not sent: SMTP transporter not configured.");
    }

    return res.status(200).json({ message: "Contact saved" });
  } catch (err) {
    console.error("Error saving contact:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/contact?admin=TOKEN  (simple protection via ADMIN_TOKEN)
// GET /api/contact - protected: requires admin token in header only
router.get("/", async (req, res) => {
  // Accept token via header only to avoid exposing secrets in URLs
  const headerToken =
    req.headers["x-admin-token"] ||
    (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

  if (!process.env.ADMIN_TOKEN) {
    console.warn("ADMIN_TOKEN not set - admin access is not configured.");
  }

  if (!headerToken || headerToken !== process.env.ADMIN_TOKEN) {
    return res
      .status(401)
      .json({ error: "Unauthorized - admin token required in header" });
  }

  try {
    const items = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
