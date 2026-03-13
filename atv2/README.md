# Lista de Compras - Aula 5

CRUD de Lista de Compras com TypeScript, Express e MongoDB (Mongoose).

## Requisitos

- Node.js 18+
- MongoDB (local ou MongoDB Atlas)

## Instalação

```bash
npm install
```

## Configuração

- **MongoDB**: Por padrão usa `mongodb://localhost:27017/shopping-list`
- Para alterar: defina a variável de ambiente `MONGODB_URI`

## Rodar o Projeto

```bash
# Desenvolvimento (com ts-node)
npm run dev

# Ou compilar e rodar
npm run build
npm start
```

Acesse: http://localhost:3001

## Banco de Dados

- **Banco**: shopping-list
- **Coleção**: shoppingitems

Crie o banco e a coleção no MongoDB Compass (ou deixe o Mongoose criar automaticamente ao inserir o primeiro documento).

## Estrutura

```
lista-compras/
├── src/
│   ├── config/db.ts      # Conexão MongoDB
│   ├── models/ShoppingItem.ts
│   ├── controllers/shoppingItemController.ts
│   ├── routes/shoppingItemRoutes.ts
│   ├── server.ts
│   └── public/           # Frontend
│       ├── index.html
│       ├── style.css
│       └── app.js
├── package.json
└── tsconfig.json
```
