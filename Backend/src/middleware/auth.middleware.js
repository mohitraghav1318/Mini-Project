import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";
import prisma from "../config/db.js";
import { SAFE_USER_SELECT } from "../services/user.service.js";

export const protect = asyncHandler(async (req, res, next) => {
  // console.log("RAW COOKIE HEADER:", req.headers.cookie);
  // console.log("PARSED COOKIES:", req.cookies);
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  console.log("Request entered at:", Date.now());

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  console.time("db-user-lookup");
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: SAFE_USER_SELECT,
  });
  console.timeEnd("db-user-lookup");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  req.user = user;
  console.log("Request responding at:", Date.now());
  next();
});

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action.");
    }
    next();
  };
};