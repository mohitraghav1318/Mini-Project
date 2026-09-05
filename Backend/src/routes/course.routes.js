import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
	createCourse,
	createLesson,
	listCourses,
} from "../controllers/course.controller.js";

const router = Router();

router.get("/", listCourses);
router.post("/", protect, restrictTo("ADMIN"), createCourse);
router.post("/:courseId/lessons", protect, restrictTo("ADMIN"), createLesson);

export default router;