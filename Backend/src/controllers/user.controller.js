import asyncHandler from "../utils/asyncHandler.js";
// import { updateUserOnboarding } from "../services/user.service.js";
import { validateProfileUpdateInput } from "../utils/validators.js";
import { updateUserOnboarding, updateUserProfile } from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

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

// Lets an already-onboarded user edit their own profile fields later.
// Different from completeOnboarding: this is for EDITS after the fact,
// not first-time setup, so it never flips "onboarded".
export const updateProfile = asyncHandler(async (req, res) => {
  const { bio, district, state, workPreference, interestIds } = req.body;

  // Validate only what was actually sent (partial update).
  const validationErrors = validateProfileUpdateInput({
    bio,
    district,
    state,
    workPreference,
    interestIds,
  });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  const user = await updateUserProfile(req.user.id, {
    bio,
    district,
    state,
    workPreference,
    interestIds,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});