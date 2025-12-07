import express from "express";
import { requireRole } from "../../../core/middleware/auth.middleware.js";
import { USER_ROLES } from "../../../core/utils/constants.js";
import vendorEventsRoutes from "../../vendor-events/vendorEvents.routes.js";

const router = express.Router();

const requireVendor = requireRole([USER_ROLES.VENDOR]);

// router.use("/", requireVendor, vendorEventsRoutes);

export default router;