// src/services/user.service.js
import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { VALID_OCCUPATIONS } from "../constants/occupations.js";

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  points: true,
  shgName: true,
  district: true,
  state: true,
  occupation: true,
  createdAt: true,
};

// Updates a user's editable profile fields.
// All fields are optional — a user might only fix one mistake (e.g. wrong district)
// without resending everything else. Prisma skips "undefined" fields automatically.
export const updateUserProfile = async (userId, { name, shgName, district, state, occupation }) => {
  if (occupation !== undefined && !VALID_OCCUPATIONS.includes(occupation)) {
    throw new ApiError(400, "Invalid occupation selected.");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      shgName,
      district,
      state,
      occupation,
    },
    select: SAFE_USER_SELECT,
  });

  return user;
};

export { SAFE_USER_SELECT };