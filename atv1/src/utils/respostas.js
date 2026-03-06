/**
 * Padrão de resposta da API:
 * - Sucesso (listagem): sempre array []
 * - Sucesso (um item): objeto
 * - Erro: { erro: string }
 */

function erro(res, status, mensagem) {
  return res.status(status).json({ erro: mensagem });
}

function sucesso(res, status, dados) {
  return res.status(status).json(dados);
}

module.exports = { erro, sucesso };
