"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const task_model_1 = require("./models/task.model");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/dwiii-revisao";
void mongoose_1.default.connect(MONGODB_URI);
// Questão 3: PUT (atualização completa) de uma tarefa
app.put("/tasks/:id", async (req, res) => {
    try {
        const id = String(req.params.id ?? "");
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido." });
        }
        const { title, description, isDone } = req.body;
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "title é obrigatório (string)." });
        }
        if (description !== undefined && description !== null && typeof description !== "string") {
            return res.status(400).json({ message: "description deve ser string ou ausente." });
        }
        if (typeof isDone !== "boolean") {
            return res.status(400).json({ message: "isDone é obrigatório (boolean)." });
        }
        const updated = await task_model_1.TaskModel.findByIdAndUpdate(id, {
            title: title.trim(),
            description: description === undefined ? undefined : description,
            isDone,
        }, { new: true, runValidators: true, overwrite: true });
        if (!updated) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
        return res.status(200).json(updated);
    }
    catch {
        return res.status(500).json({ message: "Erro interno." });
    }
});
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
    console.log(`API on http://localhost:${PORT}`);
});
