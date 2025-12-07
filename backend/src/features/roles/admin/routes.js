import express from "express";
import { requireRole, verifyToken } from "../../../core/middleware/auth.middleware.js";
import { USER_ROLES } from "../../../core/utils/constants.js";
import userRoutes from "../../../features/users/users.routes.js";
import eventsRoutes from "../../../features/events/events.routes.js";

const router = express.Router();

const requireAdmin = requireRole([USER_ROLES.ADMIN]);

router.use("/users", verifyToken, requireAdmin, userRoutes);
router.use("/events", verifyToken, requireAdmin, eventsRoutes);

export default router;
