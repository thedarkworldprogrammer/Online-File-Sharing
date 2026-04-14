import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: 'thedarkworldprogrammer',
  api_key: '327934293831594',
  api_secret: '94_SwQU8Fn9togbgKv-S0zdzomU'
});

fs.writeFileSync('test3.txt', 'hello');

cloudinary.uploader.upload_large('test3.txt', { resource_type: 'auto', folder: 'temp' })
  .then(res => {
    fs.writeFileSync('cloudinary_result.json', JSON.stringify(res, null, 2));
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
