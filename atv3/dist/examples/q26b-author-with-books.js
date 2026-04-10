"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorWithBooks = getAuthorWithBooks;
const prisma_1 = require("../prisma");
async function getAuthorWithBooks(id) {
    return prisma_1.prisma.author.findUnique({
        where: { id },
        include: { books: true },
    });
}
