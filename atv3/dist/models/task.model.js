"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    isDone: { type: Boolean, default: false },
}, { timestamps: true });
exports.TaskModel = (0, mongoose_1.model)("Task", taskSchema);
