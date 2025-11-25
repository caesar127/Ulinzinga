import fs from "fs";
import path from "path";

export const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
export const allowedVideoTypes = ["video/mp4", "video/quicktime"];

export const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
};

export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to delete file:", err);
    return false;
  }
};
