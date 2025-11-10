import express from "express";
import userController from "./users.controller.js";
import { authenticateToken, requireAdmin } from "../../shared/middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", requireAdmin, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;