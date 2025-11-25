import express from "express";
import {
  getRecommendedEvents,
  getTrendingEvents,
  addFavoriteEvent,
  removeFavoriteEvent,
  addFavoriteOrganizer,
  removeFavoriteOrganizer,
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

export default router;
