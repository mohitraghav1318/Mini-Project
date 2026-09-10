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

export const updateCourse = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);
  const { title, description, category } = req.body;

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  if (title === undefined && description === undefined && category === undefined) {
    throw new ApiError(400, "At least one course field is required.");
  }

  if (title !== undefined && !title) {
    throw new ApiError(400, "Title cannot be empty.");
  }

  if (description !== undefined && !description) {
    throw new ApiError(400, "Description cannot be empty.");
  }

  if (category !== undefined && !VALID_OCCUPATIONS.includes(category)) {
    throw new ApiError(400, "Invalid course category.");
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
    },
  });

  return res.status(200).json({
    success: true,
    data: updatedCourse,
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  const deletedCourse = await prisma.course.delete({
    where: { id: courseId },
  });

  return res.status(200).json({
    success: true,
    data: deletedCourse,
  });
});

export const updateLesson = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);
  const lessonId = Number(req.params.lessonId);
  const { title, youtubeUrl } = req.body;

  if (!Number.isInteger(courseId) || !Number.isInteger(lessonId)) {
    throw new ApiError(404, "Course or lesson not found.");
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
  });

  if (!lesson) {
    throw new ApiError(404, "Course or lesson not found.");
  }

  if (title === undefined && youtubeUrl === undefined) {
    throw new ApiError(400, "At least one lesson field is required.");
  }

  if (title !== undefined && !title) {
    throw new ApiError(400, "Title cannot be empty.");
  }

  const data = {
    ...(title !== undefined && { title }),
  };

  if (youtubeUrl !== undefined) {
    const videoId = parseYoutubeVideoId(youtubeUrl);

    if (!videoId) {
      throw new ApiError(400, "Invalid YouTube URL");
    }

    const { thumbnailUrl } = await fetchYoutubeMetadata(videoId);
    Object.assign(data, { youtubeUrl, videoId, thumbnailUrl });
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data,
  });

  return res.status(200).json({
    success: true,
    data: updatedLesson,
  });
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);
  const lessonId = Number(req.params.lessonId);

  if (!Number.isInteger(courseId) || !Number.isInteger(lessonId)) {
    throw new ApiError(404, "Course or lesson not found.");
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
  });

  if (!lesson) {
    throw new ApiError(404, "Course or lesson not found.");
  }

  const deletedLesson = await prisma.lesson.delete({
    where: { id: lessonId },
  });

  return res.status(200).json({
    success: true,
    data: deletedLesson,
  });
});

export const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  if (req.user.role === "ADMIN") {
    throw new ApiError(403, "Admins cannot enroll in courses.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new ApiError(409, "You are already enrolled in this course.");
  }

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId,
      },
    });

    return res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    if (error?.code === "P2002") {
      throw new ApiError(409, "You are already enrolled in this course.");
    }

    throw error;
  }
});

export const unenrollFromCourse = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Enrollment not found.");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId,
      },
    },
  });

  if (!enrollment) {
    throw new ApiError(404, "You are not enrolled in this course.");
  }

  await prisma.enrollment.delete({
    where: { id: enrollment.id },
  });

  return res.status(200).json({
    success: true,
    message: "Enrollment removed successfully.",
  });
});

export const getEnrollmentStatus = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId,
      },
    },
    select: { id: true },
  });

  return res.status(200).json({
    success: true,
    data: { enrolled: Boolean(enrollment) },
  });
});