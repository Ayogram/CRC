
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resultsPath = path.join(process.cwd(), "scratch", "upload-results.json");
let results = {};
if (fs.existsSync(resultsPath)) {
  results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
}

// PRIORITIZING SMALLER ASSETS
const filesToUpload = [
  "victory.mp4", "redemption.mp4", "childrenplayground.MP4", "receptionareas.mp4",
  "24beddom.MOV", "crclux.jpg", "events.jpg", "media__1776271813071.jpg", "media__1776271649661.jpg"
];

async function uploadFiles() {
  console.log("Prioritizing Halls and Playground...");
  for (const fileName of filesToUpload) {
    if (results[fileName]) {
      console.log(`Skipping ${fileName} (Already uploaded)`);
      continue;
    }

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
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      console.log(`Success: ${fileName} -> ${result.secure_url}`);
    } catch (e) {
      console.error(`Failed to upload ${fileName}:`, e.message);
    }
  }
  console.log("Upload finished.");
}

uploadFiles();
