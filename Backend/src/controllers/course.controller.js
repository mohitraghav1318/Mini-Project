import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";
import { VALID_OCCUPATIONS } from "../constants/occupations.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    throw new ApiError(400, "Title, description, and category are required.");
  }

  if (!VALID_OCCUPATIONS.includes(category)) {
    throw new ApiError(400, "Invalid course category.");
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      category,
      createdBy: req.user.id,
    },
  });

  return res.status(201).json({
    success: true,
    data: course,
  });
});