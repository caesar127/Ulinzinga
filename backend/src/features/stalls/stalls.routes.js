import express from "express";
import {
  createStallSetup,
  getStall,
  getOrganizerStalls,
  editStall,
  toggleStallActive,
  createStallType,
  editStallType,
  removeStallType,
  makeBooking,
  changeBookingStatus,
  cancelStallBooking,
  getAllBookings,
  checkAvailability,
  stallSummary,
} from "./stalls.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createStallSetup);
router.get("/organizer", getOrganizerStalls);
router.get("/event/:eventId", getStall);
router.get("/event/:eventId/summary", stallSummary);

router.put("/:stallId", editStall);
router.patch("/:stallId/active", toggleStallActive);

router.post("/:stallId/types", createStallType);
router.put("/:stallId/types/:typeId", editStallType);
router.delete("/:stallId/types/:typeId", removeStallType);

router.post("/:stallId/book", makeBooking);
router.get("/:stallId/bookings", getAllBookings);
router.patch("/:stallId/bookings/:bookingId/status", changeBookingStatus);
router.patch("/:stallId/bookings/:bookingId/cancel", cancelStallBooking);

router.get("/:stallId/availability", checkAvailability);

export default router;
