import express from "express";
import {
  merchantLogin,
  merchantRegister,
  verifyMerchantToken,
  merchantLogout,
  googleLogin,
  googleCallback,
  userSignup,
  userLogin,
  userLogout,
  getCurrentUser,
  validateUsername,
} from "./auth.controller.js";
import { verifyToken } from "../../core/middleware/auth.middleware.js";
import {
  validateRequest,
  userRegistrationSchema,
  userLoginSchema,
} from "../../core/utils/validators.js";

const router = express.Router();

// Merchants (Vendors & Organizers - PayChangu auth)
router.post("/merchant/login", merchantLogin);
router.post("/merchant/verify-token", verifyMerchantToken);
router.post("/merchant/register", merchantRegister);
router.post("/merchant/logout", merchantLogout);

// Google OAuth
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);

// Regular Users (Local auth)
router.post("/user/signup", userSignup);
router.post("/user/signin", validateRequest(userLoginSchema), userLogin);
router.post("/user/logout", verifyToken, userLogout);

// Current logged-in user (protected)
router.get("/me", verifyToken, getCurrentUser);

router.get("/validateusername/:username", validateUsername);

export default router;
