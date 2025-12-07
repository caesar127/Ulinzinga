import express from "express";
import { requireRole } from "../../../core/middleware/auth.middleware.js";
import { USER_ROLES } from "../../../core/utils/constants.js";
import organizerEventsRoutes from "./organizerEvents.routes.js";
import stallRoutes from "../../stalls/stalls.routes.js";

const router = express.Router();

const requireOrganizer = requireRole([USER_ROLES.ORGANIZER]);

router.use("/events", requireOrganizer, organizerEventsRoutes);
router.use("/stalls", requireOrganizer, stallRoutes);

export default router;