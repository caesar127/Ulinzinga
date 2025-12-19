import axios from "axios";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../users/users.model.js";

export const merchantLogin = async (req, res) => {
  try {
    const { role = "organizer" } = req.body;
    const clientId = process.env.PAYCHANGU_CLIENT_ID;
    const apiKey = process.env.PAYCHANGU_API_KEY;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (!clientId || !apiKey)
      return res.status(500).json({ error: "Missing PayChangu credentials" });

    const redirectUri = `${frontendUrl}/auth/callback`;

    const payload = {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "payments:write payments:read",
      state: `state_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}|${role}`,
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

    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate PayChangu connect link" });
  }
};

export const verifyMerchantToken = async (req, res) => {
  const { access_token, selected_role } = req.body;

  const apiKey = process.env.PAYCHANGU_API_KEY;
  if (!access_token)
    return res.status(400).json({ error: "Access token required" });

  try {
    const userResponse = await axios.get(
      `https://api.paychangu.com/connect/user?access_token=${access_token}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = userResponse.data;
    console.log(data);
    if (!data || !data.user || !data.user.email)
      return res
        .status(400)
        .json({ error: "Invalid user data from PayChangu" });

    const paychanguUser = data.user;
    const business = data.business || {};
    const balances = data.balances || [];
    const merchantReference = data.reference;

    let userRole = "organizer";

    if (selected_role && ["vendor", "organizer"].includes(selected_role)) {
      userRole = selected_role;
    } else if (["vendor", "organizer"].includes(paychanguUser.role)) {
      userRole = paychanguUser.role;
    }

    let user = await User.findOne({ email: paychanguUser.email });

    const malawiBalances = balances.filter((b) => b.currency_name === "Malawi");

    if (user) {
      user.name = paychanguUser.name || user.name;
      user.profile = user.profile || {};
      user.profile.phone = paychanguUser.phone || user.profile.phone;
      user.changuId = business.reference || user.changuId;
      user.reference = merchantReference || user.reference;
      user.authProvider = "paychangu";
      user.role = userRole;

      if (business && business.reference) {
        user.profile.business = {
          reference: business.reference,
          name: business.name,
          live: business.live,
        };
      }

      user.profile.balances = malawiBalances;

      await user.save();
    } else {
      user = new User({
        name: paychanguUser.name,
        email: paychanguUser.email,
        profile: {
          phone: paychanguUser.phone,
          business: business.reference
            ? {
                reference: business.reference,
                name: business.name,
                live: business.live,
              }
            : null,
          balances: malawiBalances,
        },
        changuId: business.reference || null,
        reference: merchantReference || null,
        authProvider: "paychangu",
        role: userRole,
      });

      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return all user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Merchant (Vendor/Organizer) verified successfully",
      token,
      user: userData,
      business: business,
      balances: malawiBalances,
    });
  } catch (err) {
    console.error("Error verifying PayChangu token:", err.message);
    res.status(500).json({ error: "Failed to verify PayChangu token" });
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
      user.authProvider = "paychangu";
      user.role = ["vendor", "organizer"].includes(data.role)
        ? data.role
        : "organizer";
      await user.save();
    } else {
      user = new User({
        name: data.name,
        email: data.email,
        profile: { phone: data.phone },
        changuId: data.id,
        authProvider: "paychangu",
        role: ["vendor", "organizer"].includes(data.role)
          ? data.role
          : "organizer",
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return all user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Merchant (Vendor/Organizer) login successful",
      token,
      user: userData,
    });
  } catch (err) {
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

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/auth/callback?code=${code}&success=true`;
    res.redirect(redirectUrl);
  } catch (err) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/auth/callback?error=google_auth_failed&error_description=${encodeURIComponent(
      "Failed to complete Google OAuth"
    )}`;
    res.redirect(redirectUrl);
  }
};

export const userSignup = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      username,
      authProvider: "local",
      role: "user",
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Return all user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: "User signup successful!",
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email })
      .select("+password")
      .populate("wallet")
      .populate("favoriteEvents")
      .populate("interests")
      .populate("favoriteOrganizers");
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with that email" });

    if (user.authProvider !== "local")
      return res.status(400).json({
        message: "Please use the appropriate login method for this account",
      });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return all user data (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "User login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const merchantLogout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const userLogout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const { default: tokenBlacklist } = await import(
      "../../core/utils/tokenBlacklist.js"
    );

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const expiryTime = decoded.exp * 1000;

      tokenBlacklist.blacklistToken(token, expiryTime);

      res.json({ message: "User logged out successfully" });
    } catch (jwtError) {
      res.json({ message: "User logged out successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to logout" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId)
      .populate("wallet")
      .populate("favoriteEvents")
      .populate("interests")
      .populate("favoriteOrganizers");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Return all user data (excluding password if it exists)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};
