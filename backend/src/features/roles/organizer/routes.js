import express from "express";
import { requireRole, verifyToken } from "../../../core/middleware/auth.middleware.js";
import { USER_ROLES } from "../../../core/utils/constants.js";
import organizerEventsRoutes from "./organizerEvents.routes.js";
import stallRoutes from "../../stalls/stalls.routes.js";
import ticketsRoutes from "../../tickets/tickets.routes.js";

const router = express.Router();

const requireOrganizer = requireRole([USER_ROLES.ORGANIZER]);

router.use("/events", verifyToken, requireOrganizer, organizerEventsRoutes);
router.use("/stalls", verifyToken, requireOrganizer, stallRoutes);
router.use("/tickets", verifyToken, requireOrganizer, ticketsRoutes);

export default router;
