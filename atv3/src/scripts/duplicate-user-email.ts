import mongoose from "mongoose";
import { UserModel } from "../models/user.model";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/dwiii-revisao";

async function main() {
  await mongoose.connect(MONGODB_URI);

  await UserModel.collection.drop().catch(() => undefined);

  await UserModel.create({ name: "User 1", email: "same@email.com", password: "123" });

  try {
    await UserModel.create({ name: "User 2", email: "same@email.com", password: "456" });
  } catch (err: any) {
    if (err?.code === 11000) {
      console.log("Erro esperado (E11000 - unique):", err.keyValue);
    } else {
      console.log("Erro inesperado:", err);
    }
  } finally {
    await mongoose.disconnect();
  }
}

void main();

