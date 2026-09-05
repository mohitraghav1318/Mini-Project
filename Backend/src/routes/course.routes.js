import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { createCourse, listCourses } from "../controllers/course.controller.js";

const router = Router();

router.get("/", listCourses);
router.post("/", protect, restrictTo("ADMIN"), createCourse);

export default router;