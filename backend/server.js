const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // load .env

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());

// contact routes (POST + protected GET)
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
