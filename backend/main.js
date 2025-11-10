import { config } from "dotenv";
import express from "express";
import os from "os";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

config({ quiet: true });
const app = express();

app.use(
  compression({
    level: 8,
    threshold: 1024,
  })
);

// Import routes
import authRoutes from "./src/features/auth/auth.routes.js";
import userRoutes from "./src/features/users/users.routes.js";
import eventsRoutes from "./src/features/events/events.routes.js";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventsRoutes);

app.get("/", (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  for (const [key, value] of Object.entries(networkInterfaces)) {
    for (const net of value) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  res.send({
    ip: addresses[0],
  });
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
