import asyncHandler from "../utils/asyncHandler.js";
import { validateProfileUpdateInput } from "../utils/validators.js";
import { updateUserProfile } from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

// Lets a logged-in user edit their own profile fields
// (e.g. fix a typo in district, or update their occupation).
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, shgName, district, state, occupation } = req.body;

  // Validate only what was actually sent (partial update).
  const validationErrors = validateProfileUpdateInput({
    name,
    shgName,
    district,
    state,
    occupation,
  });
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Validation failed", validationErrors);
  }

  const user = await updateUserProfile(req.user.id, {
    name,
    shgName,
    district,
    state,
    occupation,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});