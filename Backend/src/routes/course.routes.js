import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { createCourse } from "../controllers/course.controller.js";

const router = Router();

router.post("/", protect, restrictTo("ADMIN"), createCourse);

export default router;