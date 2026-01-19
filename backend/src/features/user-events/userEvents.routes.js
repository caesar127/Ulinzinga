import express from "express";
import {
  getRecommendedEvents,
  getTrendingEvents,
  addFavoriteEvent,
  removeFavoriteEvent,
  addFavoriteOrganizer,
  removeFavoriteOrganizer,
  getUserEventDetails,
  getEventsByInterests,
  getUserPurchasedEvents,
} from "./userEvents.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/recommended", verifyToken, getRecommendedEvents);
router.get("/trending", verifyToken, getTrendingEvents);
router.get("/interests", verifyToken, getEventsByInterests);

router.post("/favorites/events", verifyToken, addFavoriteEvent);
router.delete("/favorites/events/:eventId", verifyToken, removeFavoriteEvent);

router.post("/favorites/organizers", verifyToken, addFavoriteOrganizer);
router.delete(
  "/favorites/organizers/:organizerId",
  verifyToken,
  removeFavoriteOrganizer
);

router.get("/purchasedevents", verifyToken, getUserPurchasedEvents);
router.get("/tickets/:eventId", verifyToken, getUserEventDetails);

export default router;
