import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileUrl: String,
  publicId: String,
  token: String,
  password: String,
  expiresAt: Date,
  downloadCount: { type: Number, default: 0 },
  maxDownloads: { type: Number, default: 3 }
}, { timestamps: true });

export default mongoose.model("File", fileSchema);