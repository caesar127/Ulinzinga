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

// Admin tickets endpoints
router.get("/tickets/by-email/:email", getUserTicketsByEmail);

export default router;
