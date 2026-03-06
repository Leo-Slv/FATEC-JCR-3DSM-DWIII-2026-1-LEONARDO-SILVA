const { PrismaClient } = require('@prisma/client');
const { erro, sucesso } = require('../utils/respostas');
const { isInteger } = require('../utils/validacao');

const prisma = new PrismaClient();

async function associar(req, res) {
  try {
    const { pessoaId, carroId } = req.body || {};
    if (!isInteger(pessoaId)) return erro(res, 400, 'pessoaId inválido.');
    if (!isInteger(carroId)) return erro(res, 400, 'carroId inválido.');
    const pid = parseInt(pessoaId, 10);
    const cid = parseInt(carroId, 10);
    const [pessoa, carro] = await Promise.all([
      prisma.pessoa.findUnique({ where: { id: pid } }),
      prisma.carro.findUnique({ where: { id: cid } })
    ]);
    if (!pessoa) return erro(res, 404, 'Pessoa não encontrada.');
    if (!carro) return erro(res, 404, 'Carro não encontrado.');
    const assoc = await prisma.pessoaPorCarro.create({
      data: { pessoaId: pid, carroId: cid },
      include: { pessoa: true, carro: true }
    });
    return sucesso(res, 201, assoc);
  } catch (err) {
    if (err.code === 'P2002') return erro(res, 400, 'Esta pessoa já está associada a este carro.');
    if (err.code === 'P2003') return erro(res, 400, 'Pessoa ou carro não encontrado.');
    return erro(res, 400, err.meta?.cause || err.message);
  }
}

async function listarTodas(req, res) {
  try {
    const list = await prisma.pessoaPorCarro.findMany({
      include: { pessoa: true, carro: true }
    });
    return sucesso(res, 200, Array.isArray(list) ? list : []);
  } catch (err) {
    return erro(res, 500, 'Erro ao listar associações. Tente novamente.');
  }
}

async function excluir(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    await prisma.pessoaPorCarro.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return erro(res, 404, 'Associação não encontrada.');
    return erro(res, 500, 'Erro ao excluir associação.');
  }
}

module.exports = { associar, listarTodas, excluir };
