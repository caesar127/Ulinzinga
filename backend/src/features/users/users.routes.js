import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserInterests,
} from "./users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/profile", updateUserProfile);
router.put("/:id/interests", updateUserInterests);
router.delete("/:id", deleteUser);

export default router;
