import File from "../models/File.js";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// Upload File
export const uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_large(req.file.path, {
      resource_type: "auto",
      folder: "temp-files",
      chunk_size: 6000000 // 6MB chunks
    });

    const token = uuidv4();

    let hashedPassword = null;
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const file = await File.create({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      token,
      password: hashedPassword,
      expiresAt
    });

    res.json({
      link: `${process.env.BASE_URL}/file/${token}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Preview File
export const getFilePreview = async (req, res) => {
  const file = await File.findOne({ token: req.params.token });

  if (!file) return res.status(404).send("File not found");

  if (new Date() > file.expiresAt) {
    return res.status(410).send("Link expired");
  }

  res.json({
    fileName: file.publicId,
    fileUrl: file.fileUrl,
    fileType: file.fileUrl.split('.').pop(), // simple type detect
    downloadsLeft: file.maxDownloads - file.downloadCount,
    requiresPassword: !!file.password
  });
};


// Download File
export const downloadFile = async (req, res) => {
  const file = await File.findOne({ token: req.params.token });

  if (!file) return res.status(404).send("Invalid link");

  if (new Date() > file.expiresAt) {
    return res.status(410).send("Link expired");
  }

  if (file.downloadCount >= file.maxDownloads) {
    return res.status(403).send("Download limit exceeded");
  }

  // Password check
  if (file.password) {
    const isMatch = await bcrypt.compare(req.body.password, file.password);
    if (!isMatch) return res.status(401).send("Wrong password");
  }

  file.downloadCount++;
  await file.save();

  // Delete if limit reached
  if (file.downloadCount >= file.maxDownloads) {
    await cloudinary.uploader.destroy(file.publicId);
    await File.findByIdAndDelete(file._id);
  }

  res.json({ url: file.fileUrl });
};