import axios from "axios";
import User from "../users/users.model.js";
import jwt from "jsonwebtoken";

/* ---------------- PAYCHANGU LOGIN ---------------- */
export const merchantlogin = async (req, res) => {
  try {
    const clientId = process.env.PAYCHANGU_CLIENT_ID;
    const redirectUri = process.env.PAYCHANGU_REDIRECT_URI;
    const apiKey = process.env.PAYCHANGU_API_KEY;

    if (!clientId || !redirectUri || !apiKey) {
      return res.status(500).json({ error: "Missing PayChangu credentials" });
    }

    const payload = {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "payments:write payments:read",
      state: `state_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`,
      mode: "live",
    };

    const { data } = await axios.post(
      "https://api.paychangu.com/connect/authorize-link",
      payload,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PayChangu connect URL:", data);
    res.json({ url: data });
  } catch (err) {
    console.error("PayChangu login error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Failed to generate PayChangu connect link" });
  }
};

/* ---------------- PAYCHANGU REGISTER ---------------- */
export const merchantregister = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) {
    return res.status(400).json({ error: "Access token required" });
  }

  try {
    const userResponse = await axios.get(
      "https://api.paychangu.com/new-endpoint-1",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paychanguUserData = userResponse.data;

    if (!paychanguUserData || !paychanguUserData.email) {
      return res
        .status(400)
        .json({ error: "Invalid user data from PayChangu" });
    }

    let user = await User.findByEmail(paychanguUserData.email);

    if (user) {
      user.name = paychanguUserData.name || user.name;
      user.profile = user.profile || {};
      user.profile.phone = paychanguUserData.phone || user.profile.phone;
      user.changuId = paychanguUserData.id;
      await user.save();
    } else {
      user = new User({
        name: paychanguUserData.name,
        email: paychanguUserData.email,
        profile: { phone: paychanguUserData.phone },
        changuId: paychanguUserData.id,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("PayChangu register error:", err);
    res.status(500).json({ error: "Failed to fetch or save user data" });
  }
};

/* ---------------- GOOGLE OAUTH LOGIN ---------------- */
export const googleLogin = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const scope = "openid email profile";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&access_type=offline&prompt=consent`;

    res.json({ url: authUrl });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Failed to generate Google login link" });
  }
};

/* ---------------- GOOGLE OAUTH CALLBACK ---------------- */
export const googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Authorization code missing" });

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { id_token, access_token } = tokenRes.data;

    // 2. Get user info from Google
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser = userInfoRes.data;

    // 3. Create or update user in DB
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      user.name = googleUser.name || user.name;
      user.profile = user.profile || {};
      user.profile.picture = googleUser.picture || user.profile.picture;
      user.googleId = googleUser.sub;
      await user.save();
    } else {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        profile: { picture: googleUser.picture },
        googleId: googleUser.sub,
      });
      await user.save();
    }

    // 4. Create JWT for your app
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Redirect or return JSON
    // You can redirect to your frontend with token as query param
    // Example: res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);

    res.json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Google callback error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to complete Google OAuth" });
  }
};

/* ---------------- LOGOUT ---------------- */
export const merchantlogout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

/* ---------------- CURRENT USER ---------------- */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      profile: user.profile,
      createdAt: user.createdAt,
    };

    res.json({ user: userResponse });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};
