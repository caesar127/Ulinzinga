import express from "express";
import {
  getWallet,
  addFunds,
  spendFunds,
  transferFunds,
  walletTransactions,
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  depositToSavingsGoal,
  withdrawFromSavingsGoal,
  paychanguCallback,
  getWalletSummary,
} from "./wallet.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";

const router = express.Router();

// Basic wallet operations
router.get("/", verifyToken, getWallet);
router.get("/summary", verifyToken, getWalletSummary);
router.post("/deposit", verifyToken, addFunds);
router.post("/spend", verifyToken, spendFunds);
router.post("/transfer", verifyToken, transferFunds);
router.get("/transactions", verifyToken, walletTransactions);

// Savings goals management
router.post("/savings/goals", verifyToken, createGoal);
router.get("/savings/goals", verifyToken, getGoals);
router.put("/savings/goals/:goalId", verifyToken, updateGoal);
router.delete("/savings/goals/:goalId", verifyToken, deleteGoal);

// Savings operations
router.post("/savings/goals/:goalId/deposit", verifyToken, depositToSavingsGoal);
router.post("/savings/goals/:goalId/withdraw", verifyToken, withdrawFromSavingsGoal);

// PayChangu webhook/callback (no auth required)
router.post("/paychangu/callback", paychanguCallback);

export default router;
