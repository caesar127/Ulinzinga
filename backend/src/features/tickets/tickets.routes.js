import express from "express";
import {
  listTicketsForEvent,
  getTicketDetails,
  redeemTicket,
  unredeemTicket,
  getTicketStatistics,
  bulkSyncTickets,
  getFilteredTickets,
  exportTickets,
} from "./tickets.controller.js";

const router = express.Router();

// GET /events/:id/tickets?sync=true&isRedeemed=false&paymentStatus=paid
router.get("/", listTicketsForEvent);

// GET /events/:id/tickets/filter?isRedeemed=false&paymentStatus=paid&customerEmail=user@example.com&search=john&page=1&limit=50
router.get("/filter", getFilteredTickets);

// GET /events/:id/tickets/statistics
router.get("/statistics", getTicketStatistics);

// POST /events/:id/tickets/sync
router.post("/sync", bulkSyncTickets);

// GET /events/:id/tickets/export?format=csv
// GET /events/:id/tickets/export?format=json&paymentStatus=paid
router.get("/export", exportTickets);

// GET /events/:id/tickets/:ticketId
// GET /events/:id/tickets/:ticketId?sync=true
router.get("/:ticketId", getTicketDetails);

// POST /events/:id/tickets/:ticketId/redeem
router.post("/:ticketId/redeem", redeemTicket);

// POST /events/:id/tickets/:ticketId/unredeem
router.post("/:ticketId/unredeem", unredeemTicket);

export default router;