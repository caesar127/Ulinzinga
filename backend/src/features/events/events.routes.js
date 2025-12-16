import express from "express";
import {
  getAllEvents,
  getEventById,
  initiatePurchase,
  syncEventsController,
  cleanupOrphanedEventsController,
  updateEventVisibility,
  updateEventStatus,
  deleteEvent,
  getUserTicketsByEmail,
} from "./events.controller.js";
import ticketsRoutes from "../tickets/tickets.routes.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/:eventSlug/purchase", initiatePurchase);
router.post("/sync", syncEventsController);
router.post("/cleanup-orphaned", cleanupOrphanedEventsController);

// Admin management endpoints
router.put("/:id/visibility", updateEventVisibility);
router.put("/:id/status", updateEventStatus);
router.delete("/:id", deleteEvent);

// Legacy admin tickets endpoints
router.get("/tickets/:email", getUserTicketsByEmail);

// New tickets module routes - mounted at /events/:id/tickets
router.use("/:id/tickets", ticketsRoutes);

export default router;
