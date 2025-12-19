import express from "express";
import {
  getRecommendedEvents,
  getTrendingEvents,
  addFavoriteEvent,
  removeFavoriteEvent,
  addFavoriteOrganizer,
  removeFavoriteOrganizer,
  getUserTickets,
  getUserEventDetails,
} from "./userEvents.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/recommended", getRecommendedEvents);
router.get("/trending", getTrendingEvents);

router.post("/favorites/events", addFavoriteEvent);
router.delete("/favorites/events/:eventId", removeFavoriteEvent);

router.post("/favorites/organizers", addFavoriteOrganizer);
router.delete("/favorites/organizers/:organizerId", removeFavoriteOrganizer);

// Get user's purchased events/tickets
router.get("/tickets", getUserTickets);
router.get("/tickets/:eventId", getUserEventDetails);

export default router;
