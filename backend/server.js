require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const authenticate = require("./authMiddleware");
const User = require("./models/user");
const Document = require("./models/document");
const userRoutes = require("./routes/userRoutes");
const nodemailer = require("nodemailer");
//const emailRoutes = require("./routes/emailRoutes");

const userController = require("./src/api/controllers/userController");
const documentRoutes = require("./routes/documentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// Email sending endpoint
app.post("/api/send-email", authenticate, async (req, res) => {
  const { to, subject, text } = req.body;

  // Check if the authenticated user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Unauthorized" });
  }

  // Sending email logic
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: to, // Receiver's email address
      subject: subject,
      text: text,
    });

    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send email" });
  }
});

//User routes
app.post("/api/register", userController.register);
app.post("/api/login", userController.login);

app.use("/api", documentRoutes);

// Use routes from other files
app.use("/api", userRoutes);
//app.use('/api', documentRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// All other GET requests not handled before will return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
