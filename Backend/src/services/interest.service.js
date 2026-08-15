import prisma from "../config/db.js";

export const getAllInterests = async () => {
  return prisma.interest.findMany({
    orderBy: { name: "asc" },
  });
};