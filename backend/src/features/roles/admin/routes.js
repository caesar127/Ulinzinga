import express from "express";
import { requireRole } from "../../../core/middleware/auth.middleware.js";
import { USER_ROLES } from "../../../core/utils/constants.js";
import userRoutes from "../../../features/users/users.routes.js";

const router = express.Router();

const requireAdmin = requireRole([USER_ROLES.ADMIN]);

router.use("/users", requireAdmin, userRoutes);

export default router;
