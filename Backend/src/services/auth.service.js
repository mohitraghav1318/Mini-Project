import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { generateResetToken, hashToken } from "../utils/token.js";
import { sendEmail } from "../utils/mailer.js";

const RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const SALT_ROUNDS = 12;

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const validateUserCredentials = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    district: user.district,
    onboarded: user.onboarded,
    points: user.points,
    state: user.state,
    workPreference: user.workPreference,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Return tokenVersion separately — the controller needs it for the JWT,
  // but it should NOT go in the response sent to the frontend.
  return { safeUser, tokenVersion: user.tokenVersion };
};


export const requestPasswordReset = async (email) => {
  const user = await findUserByEmail(email);

  // Always behave the same way whether or not the user exists,
  // so we don't leak which emails are registered.
  if (!user) {
    return;
  }

  const { rawToken, hashedToken } = generateResetToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash: hashedToken,
      resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_EXPIRY_MS),
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your Rural Women Helper password",
    html: `
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. This link will expire in 30 minutes.</p>
      <p><a href="${resetLink}">Reset your password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
};

export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = hashToken(rawToken);

  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash: hashedToken,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset link.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetTokenHash: null,
      resetTokenExpiry: null,
      tokenVersion: { increment: 1 },
    },
  });
};