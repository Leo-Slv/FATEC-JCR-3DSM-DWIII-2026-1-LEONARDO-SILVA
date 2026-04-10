import { prisma } from "../prisma";

export async function createShoppingItem(input: { name: string; quantity: number; isDone?: boolean }) {
  if (!Number.isFinite(input.quantity) || input.quantity < 0) {
    throw new Error("quantity não pode ser negativo.");
  }

  return prisma.shoppingItem.create({
    data: {
      name: input.name,
      quantity: input.quantity,
      isDone: input.isDone ?? false,
    },
  });
}

