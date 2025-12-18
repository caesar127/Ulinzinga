import express from "express";

import {
  getAvailableEvents,
  getVendorEventById,
  getStallAvailability,
  bookStall,
} from "./vendorEvents.controller.js";

const router = express.Router();

router.get("/events", getAvailableEvents);
router.get("/events/:id", getVendorEventById);
router.get("/events/:id/stalls", getStallAvailability);
router.post("/events/:id/stalls/book", bookStall);

export default router;
