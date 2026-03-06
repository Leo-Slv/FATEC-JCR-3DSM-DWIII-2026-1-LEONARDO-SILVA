const { PrismaClient } = require('@prisma/client');
const { erro, sucesso } = require('../utils/respostas');
const { isInteger, stringPreenchida, emailBasico } = require('../utils/validacao');

const prisma = new PrismaClient();

async function criar(req, res) {
  try {
    const { nome, email } = req.body || {};
    if (!stringPreenchida(nome)) return erro(res, 400, 'Nome é obrigatório.');
    if (!stringPreenchida(email)) return erro(res, 400, 'Email é obrigatório.');
    if (!emailBasico(email)) return erro(res, 400, 'Email inválido.');

    const pessoa = await prisma.pessoa.create({
      data: { nome: nome.trim(), email: email.trim() }
    });
    return sucesso(res, 201, pessoa);
  } catch (err) {
    if (err.code === 'P2002') return erro(res, 400, 'Este email já está cadastrado.');
    return erro(res, 400, err.meta?.cause || err.message);
  }
}

async function listarTodos(req, res) {
  try {
    const pessoas = await prisma.pessoa.findMany();
    return sucesso(res, 200, Array.isArray(pessoas) ? pessoas : []);
  } catch (err) {
    return erro(res, 500, 'Erro ao listar pessoas. Tente novamente.');
  }
}

async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    const pessoa = await prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) return erro(res, 404, 'Pessoa não encontrada.');
    return sucesso(res, 200, pessoa);
  } catch (err) {
    return erro(res, 500, 'Erro ao buscar pessoa.');
  }
}

async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    const { nome, email } = req.body || {};
    const data = {};
    if (nome !== undefined) {
      if (!stringPreenchida(nome)) return erro(res, 400, 'Nome não pode ser vazio.');
      data.nome = nome.trim();
    }
    if (email !== undefined) {
      if (!stringPreenchida(email)) return erro(res, 400, 'Email não pode ser vazio.');
      if (!emailBasico(email)) return erro(res, 400, 'Email inválido.');
      data.email = email.trim();
    }
    if (Object.keys(data).length === 0) return erro(res, 400, 'Envie pelo menos um campo para atualizar (nome ou email).');
    const pessoa = await prisma.pessoa.update({ where: { id }, data });
    return sucesso(res, 200, pessoa);
  } catch (err) {
    if (err.code === 'P2025') return erro(res, 404, 'Pessoa não encontrada.');
    if (err.code === 'P2002') return erro(res, 400, 'Este email já está cadastrado.');
    return erro(res, 400, err.meta?.cause || err.message);
  }
}

async function excluir(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    await prisma.pessoa.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return erro(res, 404, 'Pessoa não encontrada.');
    if (err.code === 'P2003') return erro(res, 400, 'Não é possível excluir: pessoa possui associações.');
    return erro(res, 500, 'Erro ao excluir pessoa.');
  }
}

module.exports = { criar, listarTodos, buscarPorId, atualizar, excluir };
