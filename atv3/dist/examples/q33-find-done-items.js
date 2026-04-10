"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDoneShoppingItems = listDoneShoppingItems;
const prisma_1 = require("../prisma");
async function listDoneShoppingItems() {
    return prisma_1.prisma.shoppingItem.findMany({
        where: {
            isDone: true,
        },
    });
}
