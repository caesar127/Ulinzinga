// Central route configuration for all modules
import express from "express";
import publicRoutes from "./features/roles/public/routes.js";
import userRoutes from "./features/roles/user/routes.js";
import organizerRoutes from "./features/roles/organizer/routes.js";
import adminRoutes from "./features/roles/admin/routes.js";
import { errorHandler } from "./core/middleware/error.middleware.js";

const router = express.Router();

router.use("/public", publicRoutes);
router.use("/user", userRoutes);
router.use("/organizer", organizerRoutes);
router.use("/admin", adminRoutes);

// Error handling middleware
router.use(errorHandler);

export default router;