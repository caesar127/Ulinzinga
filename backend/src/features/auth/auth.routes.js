import express from "express";
import { merchantregister,googleLogin, merchantlogin, merchantlogout, getCurrentUser } from "./auth.controller.js";

const router = express.Router();

router.post("/register", merchantregister);
router.post("/login", merchantlogin);
router.post("/googlelogin", googleLogin);
router.post("/logout", merchantlogout);
router.get("/me", getCurrentUser);

export default router;
