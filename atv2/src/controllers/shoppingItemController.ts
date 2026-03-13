import { Request, Response } from 'express';
import ShoppingItem from '../models/ShoppingItem';

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    const { nome, quantidade, preco, categoria } = req.body;
    if (!nome || !nome.trim()) {
      res.status(400).json({ erro: 'Nome do item é obrigatório.' });
      return;
    }
    const item = await ShoppingItem.create({
      nome: nome.trim(),
      quantidade: quantidade ?? 1,
      preco: preco ?? 0,
      categoria: categoria?.trim() ?? 'Geral',
      status: req.body.status ?? 'pendente'
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar item.' });
  }
}

export async function listarTodos(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.query;
    const filter: Record<string, string> = {};
    if (status && status !== 'all') filter.status = status as string;
    const itens = await ShoppingItem.find(filter).sort({ createdAt: -1 });
    res.json(itens);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar itens.' });
  }
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ erro: 'Item não encontrado.' });
      return;
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar item.' });
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    const { nome, quantidade, preco, categoria, status } = req.body;
    const updateData: Record<string, unknown> = {};
    if (nome !== undefined) updateData.nome = nome;
    if (quantidade !== undefined) updateData.quantidade = quantidade;
    if (preco !== undefined) updateData.preco = preco;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (status !== undefined) updateData.status = status;
    const item = await ShoppingItem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ erro: 'Item não encontrado.' });
      return;
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar item.' });
  }
}

export async function excluir(req: Request, res: Response): Promise<void> {
  try {
    const item = await ShoppingItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ erro: 'Item não encontrado.' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir item.' });
  }
}
