// src/features/connections/connections.routes.js
import express from "express";
import {
  sendConnectionRequest,
  approveConnection,
  declineConnection,
  listConnections,
  listPendingRequests,
  listSentRequests,
  removeConnection,
  getSuggestedConnectionsController,
  getAdvancedSuggestedConnectionsController,
} from "./connection.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", listConnections);
router.delete("/:id", removeConnection);
router.post("/", sendConnectionRequest);
router.get("/pending", listPendingRequests);
router.get("/sent", listSentRequests);
router.patch("/:id/accept", approveConnection);
router.patch("/:id/reject", declineConnection);
router.get("/suggestions", getSuggestedConnectionsController);
router.get("/suggestions/advanced", getAdvancedSuggestedConnectionsController);

export default router;
