# DWIII – Desenvolvimento Web III

Repositório raiz das atividades. Cada atividade está em uma subpasta própria.

## Estrutura

```
DWIII/
  atv1/          ← Atividade 1 – Prisma ORM (Express, PostgreSQL, frontend simples)
  atv2/           (futuro)
  atv3/           (futuro)
  ...
```

## Rodar uma atividade

Entre na pasta da atividade e siga o README de dentro dela. Exemplo para a Atividade 1:

```bash
cd atv1
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start
```

Detalhes em **atv1/README.md**.
