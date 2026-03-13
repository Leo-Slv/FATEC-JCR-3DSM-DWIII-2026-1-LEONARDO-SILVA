import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import connectDB from './config/db';
import shoppingItemRoutes from './routes/shoppingItemRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/itens', shoppingItemRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
