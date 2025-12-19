import express from "express";
import multer from "multer";
import {
  uploadGalleryItem,
  fetchEventGallery,
  fetchUserGallery,
  fetchVault,
  fetchPendingGallery,
  approveGallery,
  rejectGallery,
  deleteGallery,
  checkEventUploadAccess,
} from "./eventGallery.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.single("file"), uploadGalleryItem);
router.get("/event/:eventId/access", verifyToken, checkEventUploadAccess);
router.get("/event/:eventId", fetchEventGallery);
router.get("/user/:userId", fetchUserGallery);
router.get("/vault", verifyToken, fetchVault);
router.get("/pending/:eventId", verifyToken, fetchPendingGallery);
router.post("/approve/:galleryId", verifyToken, approveGallery);
router.post("/reject/:galleryId", verifyToken, rejectGallery);
router.delete("/:galleryId", deleteGallery);

export default router;
