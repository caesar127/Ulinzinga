import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import {
  create,
  list,
  getOne,
  update,
  uploadBanner,
  uploadLogo,
  deleteOrganizerEvent,
} from "./organizerEvents.controller.js";

const router = express.Router();

const uploadPath = "uploads/events";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  create
);
router.put(
  "/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  update
);
router.get("/", list);
router.get("/:id", getOne);
router.post("/:id/banner", upload.single("banner"), uploadBanner);
router.post("/:id/logo", upload.single("logo"), uploadLogo);
router.delete("/:id", deleteOrganizerEvent);

export default router;
