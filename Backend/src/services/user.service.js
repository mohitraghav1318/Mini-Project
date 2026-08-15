import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  points: true,
  bio: true,
  district: true,
  state: true,
  workPreference: true,
  onboarded: true,
  createdAt: true,
  interests: {
    select: { id: true, name: true },
  },
};

export const updateUserOnboarding = async (userId, { bio, district, state, workPreference, interestIds }) => {
  if (interestIds && !Array.isArray(interestIds)) {
    throw new ApiError(400, "interestIds must be an array of interest IDs.");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      bio,
      district,
      state,
      workPreference,
      onboarded: true,
      ...(interestIds && {
        interests: {
          set: interestIds.map((id) => ({ id })),
        },
      }),
    },
    select: SAFE_USER_SELECT,
  });

  return user;
};

export { SAFE_USER_SELECT };