const express = require('express');
const controller = require('../controllers/pessoaController');

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.listarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
