import express from "express";
import {
  scanQRCode,
  getQRCode,
} from "./tickets.controller.js";

const router = express.Router();

// Scan QR code by UUID
// GET /qrcode/scan/:uuid
router.get("/scan/:uuid", scanQRCode);

// Get QR code data by UUID
// GET /qrcode/:uuid
router.get("/:uuid", getQRCode);

export default router;