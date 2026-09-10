import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  deleteComment,
  deletePost,
  listPostComments,
  createPostComment,
} from "../controllers/community.controller.js";

const router = Router();

router.delete("/posts/:postId", protect, deletePost);
router.get("/posts/:postId/comments", protect, listPostComments);
router.post("/posts/:postId/comments", protect, createPostComment);
router.delete("/comments/:commentId", protect, deleteComment);

export default router;