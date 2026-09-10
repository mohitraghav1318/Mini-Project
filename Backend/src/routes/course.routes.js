import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
	createCourse,
	createLesson,
	deleteCourse,
	deleteLesson,
	enrollInCourse,
	getEnrollmentStatus,
	listCourses,
	unenrollFromCourse,
	updateCourse,
	updateLesson,
} from "../controllers/course.controller.js";
import { createCoursePost, listCoursePosts } from "../controllers/community.controller.js";

const router = Router();

router.get("/", listCourses);
router.post("/", protect, restrictTo("ADMIN"), createCourse);
router.put("/:courseId", protect, restrictTo("ADMIN"), updateCourse);
router.delete("/:courseId", protect, restrictTo("ADMIN"), deleteCourse);
router.post("/:courseId/lessons", protect, restrictTo("ADMIN"), createLesson);
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
router.get("/:courseId/posts", protect, listCoursePosts);
router.post("/:courseId/posts", protect, createCoursePost);

export default router;