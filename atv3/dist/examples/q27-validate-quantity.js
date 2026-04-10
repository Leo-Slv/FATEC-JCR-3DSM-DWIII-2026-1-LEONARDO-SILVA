"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShoppingItem = createShoppingItem;
const prisma_1 = require("../prisma");
async function createShoppingItem(input) {
    if (!Number.isFinite(input.quantity) || input.quantity < 0) {
        throw new Error("quantity não pode ser negativo.");
    }
    return prisma_1.prisma.shoppingItem.create({
        data: {
            name: input.name,
            quantity: input.quantity,
            isDone: input.isDone ?? false,
        },
    });
}
