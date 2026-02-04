import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/"];
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
    fileSize: 100 * 1024 * 1024, // 100MB limit for profile pictures
  },
});

export const uploadSingle = (field) => upload.single(field);
export const uploadMultiple = (field, max = 10) => upload.array(field, max);
export const uploadFields = (fields) => upload.fields(fields);
