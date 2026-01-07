const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST /api/contact
router.post("/", async (req, res) => {
  const { fullName, email, subject, message } = req.body || {};

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const contact = new Contact({ fullName, email, subject, message });
    await contact.save();
    return res.status(200).json({ message: "Contact saved" });
  } catch (err) {
    console.error("Error saving contact:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/contact?admin=TOKEN  (simple protection via ADMIN_TOKEN)
router.get("/", async (req, res) => {
  const token = req.query.admin || req.headers["x-admin-token"];
  if (!process.env.ADMIN_TOKEN) {
    console.warn(
      "ADMIN_TOKEN not set - GET /api/contact will be protected by token but none is configured."
    );
  }

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res
      .status(401)
      .json({ error: "Unauthorized - admin token required" });
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
