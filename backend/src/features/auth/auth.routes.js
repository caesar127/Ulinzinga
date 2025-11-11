import express from "express";
import {
  merchantLogin,
  merchantRegister,
  merchantLogout,
  googleLogin,
  googleCallback,
  signup,
  login,
  getCurrentUser,
} from "./auth.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

// PayChangu merchant auth
router.post("/merchant/login", merchantLogin);
router.post("/merchant/register", merchantRegister);
router.post("/merchant/logout", merchantLogout);

// Google OAuth
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);

// user auth
router.post("/signup", signup);
router.post("/login", login);

// Current logged-in user (protected)
router.get("/me", verifyToken, getCurrentUser);

export default router;
