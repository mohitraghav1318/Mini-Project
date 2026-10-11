import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";
import { isUserEnrolled } from "../services/enrollment.service.js";
import { answerTutor, sanitizeHistory, selectLessonContext } from "../services/doubtBot.service.js";

const VALID_LANGUAGES = ["hi", "en"];
const MIN_QUESTION = 3;
const MAX_QUESTION = 500;

async function requireCourseAccess(user, courseId) {
  if (user.role === "ADMIN") {
    return;
  }

  const enrollment = await isUserEnrolled(user.id, courseId);
  if (!enrollment) {
    throw new ApiError(403, "You must be enrolled in this course to ask questions.");
  }
}

export const askDoubt = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);
  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      lessons: {
        select: { id: true, title: true, order: true, content: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  await requireCourseAccess(req.user, courseId);

  const { question, language = "hi", history } = req.body ?? {};

  const errors = [];
  if (typeof question !== "string" || question.trim().length < MIN_QUESTION) {
    errors.push(`Question must be at least ${MIN_QUESTION} characters long.`);
  } else if (question.trim().length > MAX_QUESTION) {
    errors.push(`Question must be at most ${MAX_QUESTION} characters long.`);
  }
  if (typeof language !== "string" || !VALID_LANGUAGES.includes(language)) {
    errors.push("Language must be one of: hi, en.");
  }
  if (errors.length > 0) {
    throw new ApiError(400, "Invalid question.", errors);
  }

  // sanitizeHistory throws ApiError(400) on malformed history.
  const cleanHistory = sanitizeHistory(history);

  const trimmedQuestion = question.trim();
  const { excerpts, matched } = selectLessonContext(course.lessons, trimmedQuestion);

  const { answer, answerKind } = await answerTutor({
    course,
    excerpts,
    matchedNotes: matched,
    question: trimmedQuestion,
    language,
    history: cleanHistory,
  });

  return res.status(200).json({
    success: true,
    data: {
      answer,
      language,
      grounded: answerKind !== "general",
      answerKind,
      sources:
        answerKind === "general"
          ? []
          : excerpts.map(({ lessonId, order, title }) => ({ lessonId, order, title })),
    },
  });
});
