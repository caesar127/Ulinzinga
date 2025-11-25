import express from "express";
import userEventsRoutes from "./userEvents.routes.js";
import authRoutes from "../../auth/auth.routes.js";
import userRoutes from "../../users/users.routes.js";
import connectionRoutes from "../../connection/connection.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/events", userEventsRoutes);

router.use("/connections", connectionRoutes);

export default router;