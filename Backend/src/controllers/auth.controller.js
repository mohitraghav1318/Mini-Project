import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { validateRegisterInput, validateLoginInput } from "../utils/validators.js";
import { createUser, validateUserCredentials } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import { getCookieOptions } from "../utils/cookieOptions.js";
import { validateForgotPasswordInput, validateResetPasswordInput } from "../utils/validators.js";
import { requestPasswordReset, resetPassword as resetPasswordService } from "../services/auth.service.js";


// register controller
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

// login controoler
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validationErrors = validateLoginInput({ email, password });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { safeUser, tokenVersion } = await validateUserCredentials(normalizedEmail, password);

  const token = generateToken({
    userId: safeUser.id,
    role: safeUser.role,
    tokenVersion,
  });

  res.cookie("token", token, getCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: safeUser,
  });
});


// get curr user 
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});


// logout curre user
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});


// forgot password controller
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const validationErrors = validateForgotPasswordInput({ email });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  const normalizedEmail = email.trim().toLowerCase();

  await requestPasswordReset(normalizedEmail);

  // Always the same response, whether or not the email exists —
  // prevents attackers from figuring out which emails are registered.
  return res.status(200).json({
    success: true,
    message: "If an account with that email exists, a reset link has been sent.",
  });
});

// reset password controller
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const validationErrors = validateResetPasswordInput({ token, newPassword });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  await resetPasswordService(token, newPassword);

  return res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in with your new password.",
  });
});