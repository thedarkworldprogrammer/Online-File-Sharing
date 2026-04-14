import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const fileSchema = new mongoose.Schema({
  fileUrl: String,
  publicId: String,
  fileName: String,
  fileType: String,
  resourceType: String,
  token: String,
  password: String,
  expiresAt: Date,
  downloadCount: { type: Number, default: 0 },
  maxDownloads: { type: Number, default: 3 }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const files = await File.find().sort({createdAt:-1}).limit(1);
  console.log(JSON.stringify(files[0], null, 2));
  process.exit(0);
});
