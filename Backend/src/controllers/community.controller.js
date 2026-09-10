import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";
import { isUserEnrolled } from "../services/enrollment.service.js";

function parseId(value, message) {
  const id = Number(value);
  if (!Number.isInteger(id)) {
    throw new ApiError(404, message);
  }
  return id;
}

async function requireCourseAccess(user, courseId, action) {
  if (user.role === "ADMIN") {
    return;
  }

  const enrollment = await isUserEnrolled(user.id, courseId);
  if (!enrollment) {
    throw new ApiError(403, `You must be enrolled in this course to ${action}.`);
  }
}

async function requirePost(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, courseId: true, authorId: true },
  });

  if (!post) {
    throw new ApiError(404, "Post not found.");
  }

  return post;
}

async function requireComment(commentId) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, authorId: true },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  return comment;
}

export const listCoursePosts = asyncHandler(async (req, res) => {
  const courseId = parseId(req.params.courseId, "Course not found.");
  await requireCourseAccess(req.user, courseId, "view posts");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  const posts = await prisma.post.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  return res.status(200).json({ success: true, data: posts });
});

export const createCoursePost = asyncHandler(async (req, res) => {
  const courseId = parseId(req.params.courseId, "Course not found.");

  if (req.user.role === "ADMIN") {
    throw new ApiError(403, "Admins cannot create posts.");
  }

  await requireCourseAccess(req.user, courseId, "create posts");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  if (typeof req.body.content !== "string" || !req.body.content.trim()) {
    throw new ApiError(400, "Post content is required.");
  }

  const post = await prisma.post.create({
    data: {
      courseId,
      authorId: req.user.id,
      content: req.body.content.trim(),
    },
    select: {
      id: true,
      courseId: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });

  return res.status(201).json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = parseId(req.params.postId, "Post not found.");
  const post = await requirePost(postId);

  if (req.user.role !== "ADMIN" && post.authorId !== req.user.id) {
    throw new ApiError(403, "You do not have permission to delete this post.");
  }

  await prisma.post.delete({ where: { id: postId } });

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});

export const listPostComments = asyncHandler(async (req, res) => {
  const postId = parseId(req.params.postId, "Post not found.");
  const post = await requirePost(postId);
  await requireCourseAccess(req.user, post.courseId, "view comments");

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });

  return res.status(200).json({ success: true, data: comments });
});

export const createPostComment = asyncHandler(async (req, res) => {
  const postId = parseId(req.params.postId, "Post not found.");
  const post = await requirePost(postId);

  if (req.user.role === "ADMIN") {
    throw new ApiError(403, "Admins cannot create comments.");
  }

  await requireCourseAccess(req.user, post.courseId, "create comments");

  if (typeof req.body.content !== "string" || !req.body.content.trim()) {
    throw new ApiError(400, "Comment content is required.");
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: req.user.id,
      content: req.body.content.trim(),
    },
    select: {
      id: true,
      postId: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });

  return res.status(201).json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = parseId(req.params.commentId, "Comment not found.");
  const comment = await requireComment(commentId);

  if (req.user.role !== "ADMIN" && comment.authorId !== req.user.id) {
    throw new ApiError(403, "You do not have permission to delete this comment.");
  }

  await prisma.comment.delete({ where: { id: commentId } });

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully.",
  });
});