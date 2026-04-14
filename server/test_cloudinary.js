import cloudinary from "./config/cloudinary.js";
import fs from "fs";

fs.writeFileSync("test.txt", "hello cloudinary");

cloudinary.uploader.upload_large("test.txt", {
  resource_type: "auto",
  folder: "temp-files"
}).then(res => {
  console.log("Cloudinary returned keys:");
  console.log(Object.keys(res));
  console.log("URL:", res.secure_url);
  console.log("Public ID:", res.public_id);
  console.log("Resource Type:", res.resource_type);
  process.exit(0);
}).catch(err => {
  console.error("Cloudinary Error:", err);
  process.exit(1);
});
