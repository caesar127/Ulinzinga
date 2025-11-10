import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  softDeleteEvent,
  restoreEvent,
  getUpcomingEvents,
  getPastEvents,
  getEventsByMerchant,
} from "./events.controller.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/past", getPastEvents);
router.get("/id/:id", getEventById);
router.get("/slug/:slug", getEventBySlug);
router.get("/upcoming", getUpcomingEvents);
router.get("/merchant/:merchantName", getEventsByMerchant);

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.put("/:id/restore", restoreEvent);
router.delete("/:id/deactivate", softDeleteEvent);

export default router;
