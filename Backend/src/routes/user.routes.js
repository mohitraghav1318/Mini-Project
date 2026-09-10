import { Router } from "express";
import { listMyEnrollments, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Update your own profile (e.g. fix a typo in district, occupation, etc.)
router.patch("/me", protect, updateProfile);
router.get("/me/enrollments", protect, listMyEnrollments);

export default router;