import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests, please try again later",
    },
  });
};

export const globalLimiter = createRateLimiter(15 * 60 * 1000, 500); // 500 req/15 min
