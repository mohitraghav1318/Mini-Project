import { Router } from "express";
import { completeOnboarding, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";


const router = Router();

router.patch("/onboarding", protect, completeOnboarding);
// Update your own profile after onboarding (e.g. change bio, district, interests)
router.patch("/me", protect, updateProfile);

export default router;