import cron from "node-cron";
import File from "../models/File.js";
import cloudinary from "../config/cloudinary.js";

cron.schedule("*/10 * * * *", async () => {
  const expiredFiles = await File.find({
    expiresAt: { $lt: new Date() }
  });

  for (let file of expiredFiles) {
    await cloudinary.uploader.destroy(file.publicId);
    await File.findByIdAndDelete(file._id);
  }

  console.log("Expired files cleaned");
});

