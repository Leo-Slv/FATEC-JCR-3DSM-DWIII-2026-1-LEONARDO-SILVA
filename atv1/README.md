# Atividade 1 – Prisma ORM

Este projeto fica em `DWIII/atv1`. Execute todos os comandos **a partir desta pasta** (`atv1`).

## Como rodar

1. Entre na pasta da atividade:
   ```bash
   cd atv1
   ```
   (Se o repositório root for `DWIII`, use `cd DWIII/atv1` a partir de onde estiver.)

2. Ajuste o `.env` com sua conexão PostgreSQL:
   ```
   DATABASE_URL="postgresql://postgres:root@localhost:5432/prisma_atividade?schema=public"
   ```

3. Instale as dependências e gere o cliente Prisma:
   ```bash
   npm install
   npx prisma generate
   ```

4. Crie as tabelas no banco (se ainda não existirem):
   ```bash
   npx prisma migrate dev --name init
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

6. Acesse no navegador: http://localhost:3000
