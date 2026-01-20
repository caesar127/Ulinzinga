import express from "express";
import multer from "multer";
import {
  uploadContent,
  fetchEventContent,
  fetchUserContent,
  fetchVault,
  fetchGalleryContent,
  fetchPendingContent,
  approveContent,
  rejectContent,
  deleteContent,
  checkEventUploadAccess,
} from "./content.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", verifyToken, upload.array("files", 10), uploadContent);

router.get("/event/:eventId/access", verifyToken, checkEventUploadAccess);
router.get("/event/:eventId", fetchEventContent);

router.get("/gallery", fetchGalleryContent);

router.get("/user/:userId", fetchUserContent);
router.get("/vault", verifyToken, fetchVault);

router.get("/pending/:eventId", verifyToken, fetchPendingContent);

router.post("/approve/:contentId", verifyToken, approveContent);
router.post("/reject/:contentId", verifyToken, rejectContent);

router.delete("/:contentId", verifyToken, deleteContent);

export default router;
