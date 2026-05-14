
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const filesToUpload = [
  "crcvid.mov", "crc1.jpg", "crc2.jpg", "crc3.jpg", "crc4.jpg",
  "goshen_ultra.mp4", "Bethel.MOV", "Zionssignature.mov", "Beulah.MOV", "Rehoboth .mov",
  "12beddom.MOV", "24beddom.MOV", "victory.mp4", "redemption.mp4", "childrenplayground.MP4",
  "receptionareas.mp4", "crclux.jpg", "events.jpg", "media__1776271813071.jpg", "media__1776271649661.jpg"
];

const results = {};

async function uploadFiles() {
  console.log("Starting bulk upload to Cloudinary...");
  for (const fileName of filesToUpload) {
    const filePath = path.join(process.cwd(), "public", "images", fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${fileName}`);
      continue;
    }

    try {
      console.log(`Uploading ${fileName}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: "crc_production_assets",
        use_filename: true,
        unique_filename: false
      });
      results[fileName] = result.secure_url;
      console.log(`Success: ${fileName} -> ${result.secure_url}`);
    } catch (e) {
      console.error(`Failed to upload ${fileName}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), "scratch", "upload-results.json"), JSON.stringify(results, null, 2));
  console.log("Upload finished. Results saved to scratch/upload-results.json");
}

uploadFiles();
