import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../users/users.model.js";

export const merchantLogin = async (req, res) => {
  try {
    const clientId = process.env.PAYCHANGU_CLIENT_ID;
    const redirectUri = process.env.PAYCHANGU_REDIRECT_URI;
    const apiKey = process.env.PAYCHANGU_API_KEY;

    if (!clientId || !redirectUri || !apiKey)
      return res.status(500).json({ error: "Missing PayChangu credentials" });

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

    res.json({ url: data });
  } catch (err) {
    console.error("PayChangu login error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Failed to generate PayChangu connect link" });
  }
};

export const merchantRegister = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token)
    return res.status(400).json({ error: "Access token required" });

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

    const data = userResponse.data;
    if (!data || !data.email)
      return res
        .status(400)
        .json({ error: "Invalid user data from PayChangu" });

    let user = await User.findOne({ email: data.email });

    if (user) {
      user.name = data.name || user.name;
      user.profile = user.profile || {};
      user.profile.phone = data.phone || user.profile.phone;
      user.changuId = data.id;
      await user.save();
    } else {
      user = new User({
        name: data.name,
        email: data.email,
        profile: { phone: data.phone },
        changuId: data.id,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("PayChangu register error:", err);
    res.status(500).json({ error: "Failed to fetch or save user data" });
  }
};

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

export const googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res.status(400).json({ error: "Authorization code missing" });

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { id_token, access_token } = tokenRes.data;

    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const googleUser = userInfoRes.data;

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

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Google login successful", token, user });
  } catch (err) {
    console.error("Google callback error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to complete Google OAuth" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Signup successful!",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with that email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const merchantLogout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};
