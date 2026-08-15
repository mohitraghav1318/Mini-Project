import asyncHandler from "../utils/asyncHandler.js";
import { getAllInterests } from "../services/interest.service.js";

export const listInterests = asyncHandler(async (req, res) => {
  const interests = await getAllInterests();
  return res.status(200).json({
    success: true,
    data: interests,
  });
});