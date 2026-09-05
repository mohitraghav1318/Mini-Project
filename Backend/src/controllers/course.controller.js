import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";
import { VALID_OCCUPATIONS } from "../constants/occupations.js";
import { fetchYoutubeMetadata, parseYoutubeVideoId } from "../utils/youtube.js";

export const listCourses = asyncHandler(async (req, res) => {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { lessons: true },
  });

  return res.status(200).json({
    success: true,
    data: courses,
  });
});

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

export const createLesson = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);
  const { title, order, youtubeUrl } = req.body;

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  if (!title || order === undefined || order === null || !youtubeUrl) {
    throw new ApiError(400, "Title, order, and YouTube URL are required.");
  }

  const videoId = parseYoutubeVideoId(youtubeUrl);

  if (!videoId) {
    throw new ApiError(400, "Invalid YouTube URL");
  }

  const { thumbnailUrl } = await fetchYoutubeMetadata(videoId);
  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      order,
      youtubeUrl,
      videoId,
      thumbnailUrl,
    },
  });

  return res.status(201).json({
    success: true,
    data: lesson,
  });
});