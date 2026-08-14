import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { validateRegisterInput, validateLoginInput } from "../utils/validators.js";
import { createUser, validateUserCredentials } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import { getCookieOptions } from "../utils/cookieOptions.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const validationErrors = validateRegisterInput({ name, email, password });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return res.status(201).json({
    success: true,
    message: "Account created successfully. Please log in.",
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validationErrors = validateLoginInput({ email, password });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await validateUserCredentials(normalizedEmail, password);

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  res.cookie("token", token, getCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: user,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});