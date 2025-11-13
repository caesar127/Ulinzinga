import express from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "./content.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createContent);
router.get("/", getAllContent);
router.get("/:id", getContentById);
router.put("/:id", verifyToken, updateContent);
router.delete("/:id", verifyToken, deleteContent);

export default router;
