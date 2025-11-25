import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserInterests,
  getCurrentUserProfile,
} from "./users.controller.js";
import Joi from "joi";
import { validateRequest } from "../../core/utils/validators.js";

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
router.get("/profile", getCurrentUserProfile);
router.put("/:id", updateUser);
router.put("/:id/profile", updateUserProfile);
router.put(
  "/:id/interests",
  validateRequest(interestsUpdateSchema),
  updateUserInterests
);
router.delete("/:id", deleteUser);

export default router;
