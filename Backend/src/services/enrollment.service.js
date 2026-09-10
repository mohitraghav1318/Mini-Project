import prisma from "../config/db.js";

export function isUserEnrolled(userId, courseId) {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: { id: true },
  });
}