import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { generateCourseOutlineHandler } from "../controllers/ai.controller.js";

const router = Router();

router.post("/course-outline", protect, restrictTo("ADMIN"), aiLimiter, generateCourseOutlineHandler);

export default router;
