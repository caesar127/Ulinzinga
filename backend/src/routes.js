import express from "express";
import publicRoutes from "./features/roles/public/routes.js";
import userRoutes from "./features/roles/user/routes.js";
import organizerRoutes from "./features/roles/organizer/routes.js";
import adminRoutes from "./features/roles/admin/routes.js";
import vendorRoutes from "./features/roles/vendor/routes.js";
import { errorHandler } from "./core/middleware/error.middleware.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/vendor", vendorRoutes);
router.use("/public", publicRoutes);
router.use("/organizer", organizerRoutes);

router.use(errorHandler);

export default router;