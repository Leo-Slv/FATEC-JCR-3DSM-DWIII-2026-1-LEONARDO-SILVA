import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-list';

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB conectado com sucesso.');
  } catch (erro) {
    console.error('Erro ao conectar MongoDB:', erro);
    process.exit(1);
  }
}

export default connectDB;
