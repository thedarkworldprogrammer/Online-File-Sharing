import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 3 * 1024 * 1024 * 1024 // 3GB
  }
});

export default upload;