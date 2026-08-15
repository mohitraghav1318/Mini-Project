import { Router } from "express";
import { listInterests } from "../controllers/interest.controller.js";

const router = Router();

router.get("/", listInterests);

export default router;