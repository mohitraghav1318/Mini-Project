import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

function buildLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new ApiError(429, message));
    },
  });
}

export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many attempts. Please try again in 15 minutes.",
});

export const forgotPasswordLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many password reset requests. Please try again in 15 minutes.",
});