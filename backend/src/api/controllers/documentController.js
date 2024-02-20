const User = require("../../../models/user");
const Document = require("../../../models/document");




exports.uploadDocuments = async (req, res) => {
  const userId = req.user.userId;

  try {
    const titles = JSON.parse(req.body.titles || "[]");
    const additionalInfo =
      req.body.additionalInfo || "No additional information provided"; // Get additional info from the request

    const documentsToSave = req.files.map((file, index) => ({
      userId,
      fileName: file.filename,
      filePath: file.path,
      title: titles[index] || "No title",
    }));

    const savedDocuments = await Document.insertMany(documentsToSave);

    const documentsWithCorrectFileName = savedDocuments.map((doc) => ({
      ...doc._doc, // Spread the document data
      fileName: doc.fileName, // Ensure this is the full name with timestamp
    }));

    // Optionally, update user's documents
    await User.findByIdAndUpdate(
      userId,
      {
        $set: { additionalInfo: additionalInfo }, // Update additionalInfo
        $push: { documents: { $each: savedDocuments.map((doc) => doc._id) } }, // Append new documents
      },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({
        message: "Files uploaded successfully",
        documents: documentsWithCorrectFileName,
      });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Failed to upload files", error: error.toString() });
  }
};


exports.deleteUserAndDocuments = async (req, res) => {
  const { userId } = req.params;
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Unauthorized" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const deletedDocuments = await Document.deleteMany({ userId: userId });
    console.log(`${deletedDocuments.deletedCount} documents were deleted.`);

    res.send({
      message: "User and all associated documents deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user and documents:", error);
    res.status(500).send({ message: "Failed to delete user and documents" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const docId = req.params.docId;
    await Document.findByIdAndDelete(docId);
    res.status(200).json({ message: "Document successfully deleted." });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Failed to delete document." });
  }
};


