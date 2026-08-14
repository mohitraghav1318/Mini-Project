import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";

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

  
  const { password: _, ...safeUser } = user;
  return safeUser;
};