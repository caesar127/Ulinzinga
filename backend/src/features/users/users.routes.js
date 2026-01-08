import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserPicture,
  updateUserInterests,
  getCurrentUserProfile,
} from "./users.controller.js";
import Joi from "joi";
import { validateRequest } from "../../core/utils/validators.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";
import { uploadSingle } from "../../core/middleware/upload.middleware.js";

const router = express.Router();

const interestsUpdateSchema = Joi.object({
  interests: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("Invalid category ID format")
    )
    .min(1)
    .required(),
});

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/profile/:id", getCurrentUserProfile);
router.put("/:id", updateUser);
router.put("/:id/profile", updateUserProfile);
router.post("/picture", verifyToken, uploadSingle("picture"), updateUserPicture);
router.put(
  "/:id/interests",
  validateRequest(interestsUpdateSchema),
  updateUserInterests
);
router.delete("/:id", deleteUser);

export default router;
