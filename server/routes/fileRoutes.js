import express from "express";
import upload from "../middlewares/upload.js";
import {
  uploadFile,
  getFilePreview,
  downloadFile,
  streamFile
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/file/:token", getFilePreview);
router.post("/download/:token", downloadFile);
router.get("/stream/:token", streamFile);

export default router;