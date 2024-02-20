const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema ({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  title: { type: String, required: false },
  //additionalInfo: String,
  createdAt: { type: Date, default: Date.now },
},

{ timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
