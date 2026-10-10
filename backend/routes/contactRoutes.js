const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Configure a real SMTP transporter. Ethereal is intentionally not used here:
// it accepts messages for testing but does not deliver them to the inbox.
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT
  ? parseInt(process.env.SMTP_PORT, 10)
  : undefined;
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const transporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort || 587,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
      })
    : null;

if (transporter) {
  transporter.verify().catch((err) => {
    console.error("SMTP verify failed:", err && err.message ? err.message : err);
  });
} else {
  console.warn(
    "SMTP is not configured. Contact form submissions cannot be delivered.",
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

    const adminEmail =
      process.env.ADMIN_EMAIL || "izzatudeenmuqtehir@gmail.com";
    if (!transporter) {
      return res.status(503).json({
        error: "Email service is not configured. Please try again later.",
      });
    }

    const mailSubject = `New contact submission from ${fullName}`;
    const mailText = `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      to: adminEmail,
      replyTo: email,
      subject: mailSubject,
      text: mailText,
    });

    console.log(`Contact email sent to ${adminEmail}`);
    return res.status(200).json({ message: "Contact saved and email sent" });
  } catch (err) {
    console.error("Error processing contact submission:", err);
    return res.status(500).json({ error: "Could not send contact message" });
  }
});

// GET /api/contact?admin=TOKEN  (simple protection via ADMIN_TOKEN)
// GET /api/contact - protected: requires admin token in header only
router.get("/", async (req, res) => {
  // Accept token via header; allow ?admin=TOKEN as a fallback for local testing.
  const headerToken =
    req.headers["x-admin-token"] ||
    (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const queryToken = req.query && req.query.admin;
  const token = headerToken || queryToken;

  if (!process.env.ADMIN_TOKEN) {
    console.warn("ADMIN_TOKEN not set - admin access is not configured.");
  }

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res
      .status(401)
      .json({ error: "Unauthorized - admin token required in header" });
  }

  if (queryToken && !headerToken) {
    console.warn(
      "Admin token supplied via query string — avoid this in production.",
    );
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
