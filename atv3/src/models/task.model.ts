import { Schema, model, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model<Task>("Task", taskSchema);

