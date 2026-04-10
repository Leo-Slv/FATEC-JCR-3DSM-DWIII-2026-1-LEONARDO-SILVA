import { prisma } from "../prisma";

export async function getAuthorWithBooks(id: number) {
  return prisma.author.findUnique({
    where: { id },
    include: { books: true },
  });
}

