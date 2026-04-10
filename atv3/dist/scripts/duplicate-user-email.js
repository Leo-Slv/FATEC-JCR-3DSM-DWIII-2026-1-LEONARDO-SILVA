"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../models/user.model");
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/dwiii-revisao";
async function main() {
    await mongoose_1.default.connect(MONGODB_URI);
    await user_model_1.UserModel.collection.drop().catch(() => undefined);
    await user_model_1.UserModel.create({ name: "User 1", email: "same@email.com", password: "123" });
    try {
        await user_model_1.UserModel.create({ name: "User 2", email: "same@email.com", password: "456" });
    }
    catch (err) {
        if (err?.code === 11000) {
            console.log("Erro esperado (E11000 - unique):", err.keyValue);
        }
        else {
            console.log("Erro inesperado:", err);
        }
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
void main();
