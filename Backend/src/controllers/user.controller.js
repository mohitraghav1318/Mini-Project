import asyncHandler from "../utils/asyncHandler.js";
import { updateUserOnboarding } from "../services/user.service.js";

export const completeOnboarding = asyncHandler(async (req, res) => {
  const { bio, district, state, workPreference, interestIds } = req.body;

  const user = await updateUserOnboarding(req.user.id, {
    bio,
    district,
    state,
    workPreference,
    interestIds,
  });

  return res.status(200).json({
    success: true,
    message: "Preferences saved.",
    data: user,
  });
});