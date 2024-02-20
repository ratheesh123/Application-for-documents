const express = require("express");
const router = express.Router();
const multer = require("multer");
const documentController = require("../src/api/controllers/documentController");
const authenticate = require("../authMiddleware"); 
const path = require("path");
const fs = require("fs");
const User = require("../models/user");

// Multer Configuration for File Uploads
const uploadDir = path.join(__dirname, "../uploads");
fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

// Serve uploaded files
router.get("/uploads/:fileName", (req, res) => {
  const { fileName } = req.params;
  const directoryPath = path.join(__dirname, "uploads");
  const filePath = path.join(directoryPath, fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error during file send:", err);
      res.status(500).send("Error sending the file.");
    }
  });
});

// Get all non-admin users and their documents
router.get("/users", async (req, res) => {
  try {
    // Fetch users excluding 'admin' roles and populate their documents
    // Ensure your User model's schema properly references the documents
    const users = await User.find({ role: { $ne: "admin" } }).populate(
      "documents"
    ); // Adjust 'documents' if your field has a different name

    // If no users found, return a 404 response
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send the populated users array back to the client
    res.json(users);
  } catch (error) {
    // Log and return any errors
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// File upload
router.post(
  "/upload",
  authenticate,
  upload.array("files"),
  documentController.uploadDocuments
);

// Delete a user and their documents
router.delete(
  "/users/:userId",
  authenticate,
  documentController.deleteUserAndDocuments
);

// Delete a document
router.delete("/documents/:docId", documentController.deleteDocument);

module.exports = router;
