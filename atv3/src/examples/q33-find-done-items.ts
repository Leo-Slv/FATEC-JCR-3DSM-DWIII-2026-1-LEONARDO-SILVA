import { prisma } from "../prisma";

export async function listDoneShoppingItems() {
  return prisma.shoppingItem.findMany({
    where: {
      isDone: true,
    },
  });
}

