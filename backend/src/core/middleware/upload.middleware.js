import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/", "video/"];
  if (allowed.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export const uploadSingle = (field) => upload.single(field);
export const uploadMultiple = (field, max = 5) => upload.array(field, max);
export const uploadFields = (fields) => upload.fields(fields);
