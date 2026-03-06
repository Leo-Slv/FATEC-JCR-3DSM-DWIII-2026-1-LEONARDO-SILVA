const prisma = require('../lib/prisma');
const { erro, sucesso } = require('../utils/respostas');
const { isInteger, stringPreenchida } = require('../utils/validacao');

const ANO_MIN = 1900;
const ANO_MAX = 2100;

async function criar(req, res) {
  try {
    const { modelo, marca, ano } = req.body || {};
    if (!stringPreenchida(modelo)) return erro(res, 400, 'Modelo é obrigatório.');
    if (!stringPreenchida(marca)) return erro(res, 400, 'Marca é obrigatória.');
    const anoNum = ano !== undefined && ano !== null && ano !== '' ? parseInt(ano, 10) : NaN;
    if (!Number.isInteger(anoNum) || anoNum < ANO_MIN || anoNum > ANO_MAX) {
      return erro(res, 400, `Ano deve ser um número entre ${ANO_MIN} e ${ANO_MAX}.`);
    }
    const carro = await prisma.carro.create({
      data: { modelo: modelo.trim(), marca: marca.trim(), ano: anoNum }
    });
    return sucesso(res, 201, carro);
  } catch (err) {
    return erro(res, 400, err.meta?.cause || err.message);
  }
}

async function listarTodos(req, res) {
  try {
    const carros = await prisma.carro.findMany();
    return sucesso(res, 200, Array.isArray(carros) ? carros : []);
  } catch (err) {
    return erro(res, 500, 'Erro ao listar carros. Tente novamente.');
  }
}

async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    const carro = await prisma.carro.findUnique({ where: { id } });
    if (!carro) return erro(res, 404, 'Carro não encontrado.');
    return sucesso(res, 200, carro);
  } catch (err) {
    return erro(res, 500, 'Erro ao buscar carro.');
  }
}

async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    const { modelo, marca, ano } = req.body || {};
    const data = {};
    if (modelo !== undefined) {
      if (!stringPreenchida(modelo)) return erro(res, 400, 'Modelo não pode ser vazio.');
      data.modelo = modelo.trim();
    }
    if (marca !== undefined) {
      if (!stringPreenchida(marca)) return erro(res, 400, 'Marca não pode ser vazia.');
      data.marca = marca.trim();
    }
    if (ano !== undefined && ano !== null && ano !== '') {
      const anoNum = parseInt(ano, 10);
      if (!Number.isInteger(anoNum) || anoNum < ANO_MIN || anoNum > ANO_MAX) {
        return erro(res, 400, `Ano deve ser entre ${ANO_MIN} e ${ANO_MAX}.`);
      }
      data.ano = anoNum;
    }
    if (Object.keys(data).length === 0) return erro(res, 400, 'Envie pelo menos um campo para atualizar (modelo, marca ou ano).');
    const carro = await prisma.carro.update({ where: { id }, data });
    return sucesso(res, 200, carro);
  } catch (err) {
    if (err.code === 'P2025') return erro(res, 404, 'Carro não encontrado.');
    return erro(res, 400, err.meta?.cause || err.message);
  }
}

async function excluir(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isInteger(id)) return erro(res, 400, 'ID inválido.');
    await prisma.carro.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return erro(res, 404, 'Carro não encontrado.');
    if (err.code === 'P2003') return erro(res, 400, 'Não é possível excluir: carro possui associações.');
    return erro(res, 500, 'Erro ao excluir carro.');
  }
}

module.exports = { criar, listarTodos, buscarPorId, atualizar, excluir };
