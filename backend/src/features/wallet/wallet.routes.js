import express from "express";
import {
  getWallet,
  addFunds,
  spendFunds,
  walletTransactions,
} from "./wallet.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getWallet);
router.post("/credit", verifyToken, addFunds);
router.post("/debit", verifyToken, spendFunds);
router.get("/transactions", verifyToken, walletTransactions);

export default router;
