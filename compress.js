const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGE_DIR = path.join(__dirname, "images"); // Your images folder
const MAX_SIZE = 1920; // Maximum width/height
const QUALITY = 70; // JPEG/WEBP compression quality

function compressImages(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively compress subfolders
      compressImages(filePath);
    } else if (/\.(jpe?g|png)$/i.test(file)) {
      const ext = path.extname(file).toLowerCase();
      const tempFile = filePath.replace(ext, `-compressed${ext}`);

      sharp(filePath)
        .resize(MAX_SIZE, MAX_SIZE, { fit: "inside" })
        .toFormat("jpeg", { quality: QUALITY })
        .toFile(tempFile)
        .then(() => {
          fs.unlinkSync(filePath); // Delete original
          fs.renameSync(tempFile, filePath); // Rename compressed file
          console.log(`✅ Compressed: ${filePath}`);
        })
        .catch((err) => console.error(`❌ Error compressing ${file}:`, err));
    }
  });
}

compressImages(IMAGE_DIR);
