import express from "express";
import { getUserTicketsByEmail } from "../events/events.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:email", getUserTicketsByEmail);

export default router;