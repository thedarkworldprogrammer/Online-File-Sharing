import File from "../models/File.js";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import fs from "fs";
import https from "https";

// Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        req.file.path,
        {
          resource_type: "auto",
          folder: "temp-files",
          chunk_size: 6000000 // 6MB chunks
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Delete local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    const token = uuidv4();

    let hashedPassword = null;
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const payload = {
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype.split('/').pop(),
      resourceType: result.resource_type,
      token,
      password: hashedPassword,
      expiresAt
    };

    const file = await File.create(payload);

    res.json({
      link: `${process.env.BASE_URL}/file/${token}`
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
    fileName: file.fileName || file.publicId,
    fileUrl: file.fileUrl,
    fileType: file.fileType || file.fileUrl.split('.').pop(),
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
    if (!req.body.password) return res.status(401).send("Password required");
    const isMatch = await bcrypt.compare(req.body.password, file.password);
    if (!isMatch) return res.status(401).send("Wrong password");
  }

  file.downloadCount++;
  
  // Clean up if limit reached - we expire it immediately instead of deleting
  // instantly so the user can still download it right now.
  if (file.downloadCount >= file.maxDownloads) {
    file.expiresAt = new Date();
  }
  
  await file.save();

  // Provide the browser with a direct native Node stream wrapper URL that avoids
  // Cloudinary's unsupported fl_attachment quirks for raw files and missing file extensions.
  const proxyUrl = `${process.env.BASE_URL}/api/stream/${file.token}?pwd=${encodeURIComponent(req.body.password || "")}`;
  
  res.json({ url: proxyUrl });
};

// Stream File Natively 
export const streamFile = async (req, res) => {
  const file = await File.findOne({ token: req.params.token });

  if (!file) return res.status(404).send("File not found");
  
  if (new Date() > file.expiresAt) {
    return res.status(410).send("Link expired");
  }

  // Password verification inline stream redirect
  if (file.password) {
    const isMatch = await bcrypt.compare(req.query.pwd || "", file.password);
    if (!isMatch) return res.status(401).send("Wrong password");
  }

  if (!file.fileUrl) {
    return res.status(500).send("Origin URL is missing. File might be corrupted.");
  }

  // Force actual physical format attachment download headers natively.
  try {
    const safeName = encodeURIComponent(file.fileName || "download");
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeName}`);
    
    https.get(file.fileUrl, (cloudinaryRes) => {
      res.setHeader("Content-Type", cloudinaryRes.headers["content-type"] || "application/octet-stream");
      cloudinaryRes.pipe(res);
    }).on("error", (err) => {
      res.status(500).send("Stream error during transmission");
    });
  } catch (err) {
    res.status(500).send("Failed to construct secure download stream");
  }
};
