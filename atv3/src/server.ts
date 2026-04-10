import express, { type Request, type Response } from "express";
import mongoose, { Types } from "mongoose";
import { TaskModel } from "./models/task.model";

const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/dwiii-revisao";

void mongoose.connect(MONGODB_URI);

// Questão 3: PUT (atualização completa) de uma tarefa
app.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const id = String((req.params as any).id ?? "");

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const { title, description, isDone } = req.body as {
      title?: unknown;
      description?: unknown;
      isDone?: unknown;
    };

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "title é obrigatório (string)." });
    }

    if (description !== undefined && description !== null && typeof description !== "string") {
      return res.status(400).json({ message: "description deve ser string ou ausente." });
    }

    if (typeof isDone !== "boolean") {
      return res.status(400).json({ message: "isDone é obrigatório (boolean)." });
    }

    const updated = await TaskModel.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description === undefined ? undefined : (description as any),
        isDone,
      },
      { new: true, runValidators: true, overwrite: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    return res.status(200).json(updated);
  } catch {
    return res.status(500).json({ message: "Erro interno." });
  }
});

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});

