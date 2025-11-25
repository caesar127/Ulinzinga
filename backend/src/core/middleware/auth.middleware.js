import jwt from "jsonwebtoken";
import User from "../../features/users/users.model.js";

const parseToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
};

const attachUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.userId).select("role email name");
  } catch {
    return null;
  }
};

export const verifyToken = async (req, res, next) => {
  const token = parseToken(req);
  if (!token) return res.status(401).json({ error: "Authorization required" });

  const user = await attachUser(token);
  if (!user) return res.status(401).json({ error: "Invalid or expired token" });

  req.user = {
    userId: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  next();
};

export const optionalAuth = async (req, res, next) => {
  const token = parseToken(req);
  if (token) {
    const user = await attachUser(token);
    if (user) {
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }
  }
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ error: "Authentication required" });
  next();
};

export const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowed,
        current: req.user.role,
      });
    }
    next();
  };
};

export const requireAdmin = requireRole("admin");
export const requireOrganizerOrAdmin = requireRole(["organizer", "admin"]);
export const requireVendorOrAdmin = requireRole(["vendor", "admin"]);

export const requireEventAccess = async (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ error: "Authentication required" });

  const eventId = req.params.eventId || req.params.id;

  try {
    if (req.user.role === "admin") return next();

    const Event = (await import("../../features/events/event.model.js"))
      .default;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ error: "Event not found" });

    if (
      req.user.role === "organizer" &&
      event.organizer?.toString() === req.user.userId.toString()
    )
      return next();

    if (event.status === "published" && event.is_active) return next();

    return res.status(403).json({ error: "Access denied" });
  } catch (error) {
    return res.status(500).json({ error: "Event access error" });
  }
};

export const requireOwnership = (field = "userId") => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });

    const ownerId = req.body[field] || req.params[field];
    if (
      req.user.role !== "admin" &&
      ownerId &&
      ownerId.toString() !== req.user.userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You can only access your own resources" });
    }
    next();
  };
};
