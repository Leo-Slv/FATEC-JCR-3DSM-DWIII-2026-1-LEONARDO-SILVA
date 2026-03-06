const express = require('express');
const controller = require('../controllers/pessoaPorCarroController');

const router = express.Router();

router.post('/', controller.associar);
router.get('/', controller.listarTodas);
router.delete('/:id', controller.excluir);

module.exports = router;
