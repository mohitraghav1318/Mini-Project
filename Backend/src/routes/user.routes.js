import { Router } from "express";
import { completeOnboarding } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.patch("/onboarding", protect, completeOnboarding);

export default router;