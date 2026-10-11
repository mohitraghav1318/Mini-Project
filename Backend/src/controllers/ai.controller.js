import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { VALID_OCCUPATIONS } from "../constants/occupations.js";
import { generateCourseOutline } from "../services/aiCourse.service.js";

const VALID_LEVELS = ["beginner", "intermediate", "advanced"];
const VALID_LANGUAGES = ["both", "en", "hi"];

const LIMITS = {
  topic: 120,
  occupation: 40,
  level: 20,
  language: 10,
  context: 2000,
};

export const generateCourseOutlineHandler = asyncHandler(async (req, res) => {
  const { topic, occupation, level = "beginner", language = "both", lessonCount = 5 } = req.body ?? {};
  let { context } = req.body ?? {};

  const errors = [];
  if (typeof topic !== "string" || topic.trim().length < 3) {
    errors.push("Topic must be at least 3 characters long.");
  } else if (topic.trim().length > LIMITS.topic) {
    errors.push(`Topic must be at most ${LIMITS.topic} characters long.`);
  }
  if (typeof occupation !== "string" || !VALID_OCCUPATIONS.includes(occupation)) {
    errors.push("A valid occupation must be selected.");
  }
  if (typeof level !== "string" || !VALID_LEVELS.includes(level)) {
    errors.push("Level must be one of: beginner, intermediate, advanced.");
  }
  if (typeof language !== "string" || !VALID_LANGUAGES.includes(language)) {
    errors.push("Language must be one of: both, en, hi.");
  }
  const count = Number(lessonCount);
  if (!Number.isInteger(count) || count < 3 || count > 8) {
    errors.push("Lesson count must be an integer between 3 and 8.");
  }
  if (context !== undefined) {
    if (typeof context !== "string") {
      errors.push("Context must be text.");
    } else {
      context = context.trim().slice(0, LIMITS.context);
      if (!context) context = undefined;
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, "Invalid AI request.", errors);
  }

  const outline = await generateCourseOutline({
    topic: topic.trim().slice(0, LIMITS.topic),
    occupation,
    level,
    language,
    lessonCount: count,
    ...(context !== undefined && { context }),
  });

  return res.status(200).json({ success: true, data: outline });
});
