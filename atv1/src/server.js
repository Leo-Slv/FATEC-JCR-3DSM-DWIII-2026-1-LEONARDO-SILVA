const express = require('express');
const path = require('path');
const carroRoutes = require('./routes/carroRoutes');
const pessoaRoutes = require('./routes/pessoaRoutes');
const pessoaPorCarroRoutes = require('./routes/pessoaPorCarroRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/carros', carroRoutes);
app.use('/api/pessoas', pessoaRoutes);
app.use('/api/pessoa-por-carro', pessoaPorCarroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
