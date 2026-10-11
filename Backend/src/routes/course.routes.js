import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
	createCourse,
	createLesson,
	deleteCourse,
	deleteLesson,
	enrollInCourse,
	getAdminStats,
	getCourseById,
	getEnrollmentStatus,
	listCourses,
	unenrollFromCourse,
	updateCourse,
	updateLesson,
} from "../controllers/course.controller.js";
import { createCoursePost, listCoursePosts } from "../controllers/community.controller.js";
import { askDoubt } from "../controllers/doubt.controller.js";
import { extractLessonNotes } from "../controllers/notes.controller.js";
import { askLimiter, notesLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.get("/", listCourses);
router.get("/admin/stats", protect, restrictTo("ADMIN"), getAdminStats);
router.get("/:courseId", getCourseById);
router.post("/", protect, restrictTo("ADMIN"), createCourse);
router.put("/:courseId", protect, restrictTo("ADMIN"), updateCourse);
router.delete("/:courseId", protect, restrictTo("ADMIN"), deleteCourse);
router.post("/:courseId/lessons", protect, restrictTo("ADMIN"), createLesson);
router.post(
  "/:courseId/lessons/notes/extract",
  protect,
  restrictTo("ADMIN"),
  notesLimiter,
  extractLessonNotes
);
router.put(
	"/:courseId/lessons/:lessonId",
	protect,
	restrictTo("ADMIN"),
	updateLesson
);
router.delete(
	"/:courseId/lessons/:lessonId",
	protect,
	restrictTo("ADMIN"),
	deleteLesson
);
router.post("/:courseId/enroll", protect, enrollInCourse);
router.delete("/:courseId/enroll", protect, unenrollFromCourse);
router.get("/:courseId/enrollment-status", protect, getEnrollmentStatus);
router.post("/:courseId/ask", protect, askLimiter, askDoubt);
router.get("/:courseId/posts", protect, listCoursePosts);
router.post("/:courseId/posts", protect, createCoursePost);

export default router;
