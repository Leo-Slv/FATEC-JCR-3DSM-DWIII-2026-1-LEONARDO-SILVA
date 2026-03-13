import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShoppingItem extends Document {
  nome: string;
  quantidade: number;
  preco?: number;
  categoria?: string;
  status: 'pendente' | 'comprado' | 'cancelado';
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingItemSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
    quantidade: { type: Number, required: true, default: 1 },
    preco: { type: Number, default: 0 },
    categoria: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pendente', 'comprado', 'cancelado'],
      default: 'pendente',
    },
  },
  { timestamps: true }
);

const ShoppingItemModel = mongoose.model<IShoppingItem>(
  'ShoppingItem',
  ShoppingItemSchema,
  'shoppingitems'
);

export default ShoppingItemModel;
