import express from "express";
import {
  getAllEvents,
  getEventById,
  initiatePurchase,
} from "./events.controller.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/:eventSlug/purchase", initiatePurchase);

export default router;
