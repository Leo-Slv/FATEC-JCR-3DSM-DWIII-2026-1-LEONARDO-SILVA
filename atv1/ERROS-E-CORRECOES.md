# Erros encontrados e correções

## 1. Erro visível na tela: `pessoas.map is not a function`

**Causa:** Quando a API retorna erro (ex.: 500 por falha no banco), o body vem como `{ erro: "mensagem" }`. O frontend fazia `const pessoas = await res.json()` e em seguida `pessoas.map(...)` sem verificar se a resposta foi sucesso nem se o corpo era um array. Assim, em caso de erro, `pessoas` era um objeto e `.map` não existe em objeto.

**Correção:**
- Verificar `res.ok` antes de tratar o body como lista.
- Se `!res.ok`, ler `data.erro` e exibir mensagem; usar lista vazia para renderizar.
- Se `res.ok`, usar `Array.isArray(data) ? data : []` antes de qualquer `.map`.
- Aplicado o mesmo padrão em pessoas, carros e associações.

---

## 2. Levantamento de erros tratados

### Frontend
| Cenário | Tratamento |
|--------|------------|
| API retorna erro (body `{ erro }`) | Verificação de `res.ok`; exibição de `data.erro`; lista vazia sem quebrar a tela |
| Resposta não é array | `Array.isArray(x) ? x : []` antes de `.map` |
| Falha de rede / fetch | `try/catch` com mensagem amigável e lista vazia |
| JSON inválido na resposta | `.json().catch(() => ({}))` para não quebrar |
| DELETE retorna 204 (sem body) | Não chamar `.json()` quando `res.status === 204` |
| Submit com campos vazios | Validação no front (nome, email, modelo, marca, ano) |
| Email inválido | Checagem básica (contém `@` e `.`) |
| Ano inválido | Intervalo 1900–2100 e número inteiro |
| Associação com pessoa/carro undefined | Uso de `a.pessoa?.nome` e `safeStr()` para evitar quebra |
| Selects em associações com resposta de erro | Só usar como array se `res.ok && Array.isArray(data)` |

### Backend
| Cenário | Tratamento |
|--------|------------|
| Body incompleto / campos faltando | Validação com `stringPreenchida`, `emailBasico`, `isInteger` |
| ID inválido ou inexistente | `isInteger(id)`; 404 para registro não encontrado (P2025) |
| Email duplicado | Prisma P2002 → 400 com mensagem "Este email já está cadastrado" |
| Associação duplicada | P2002 → 400 "Esta pessoa já está associada a este carro" |
| FK inválida (pessoa/carro não existe) | Checagem com findUnique antes de create; P2003 tratado |
| Exclusão com associações existentes | P2003 → 400 com mensagem orientando desfazer associações |
| Listagem (findMany) | Retorno garantido como array: `Array.isArray(result) ? result : []` |
| Erro interno Prisma | 500 com mensagem genérica (sem expor stack) |

### Padrão de resposta da API
- **Sucesso (listagem):** status 200, body = array `[]`.
- **Sucesso (um item):** status 200 ou 201, body = objeto.
- **Erro:** status 4xx/5xx, body = `{ erro: string }`.
- **DELETE sucesso:** status 204, sem body.

---

## 3. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/utils/respostas.js` | **Novo.** Helpers `erro()` e `sucesso()` para respostas padronizadas. |
| `src/utils/validacao.js` | **Novo.** `isInteger`, `stringPreenchida`, `emailBasico`. |
| `src/controllers/pessoaController.js` | Validação de entrada; uso de respostas e tratamento de P2002, P2025, P2003. |
| `src/controllers/carroController.js` | Idem; validação de ano (1900–2100). |
| `src/controllers/pessoaPorCarroController.js` | Validação de ids; checagem de existência de pessoa/carro; P2002/P2003. |
| `src/public/pessoas.js` | Verificação `res.ok` e `Array.isArray`; `renderizarLista()`; tratamento de 204; validação no submit. |
| `src/public/carros.js` | Mesmo padrão de pessoas. |
| `src/public/associacoes.js` | Mesmo padrão; `safeStr` e dados opcionais em pessoa/carro; selects só com array quando OK. |
| `src/public/style.css` | Redesign: container, form-card, tabela, botões, mensagens de erro/sucesso. |
| `src/public/index.html` | Estrutura com container e classe da página inicial. |
| `src/public/pessoas.html` | Form-card, tabela-wrapper, botão primary, msg com aria-live. |
| `src/public/carros.html` | Idem. |
| `src/public/associacoes.html` | Idem. |

---

## 4. Como testar os cenários principais

1. **Listagem com API OK**  
   Banco rodando e tabelas criadas: abrir Pessoas/Carros/Associações e conferir se as listas carregam sem erro.

2. **Listagem com API em erro**  
   Parar o banco ou quebrar a `DATABASE_URL`: recarregar a página de Pessoas. Deve aparecer mensagem de erro em vermelho e tabela vazia, sem "map is not a function".

3. **Cadastro com campo vazio**  
   Enviar formulário de pessoa sem nome ou sem email: mensagem de validação no front ou, se enviar direto, erro 400 da API.

4. **Email duplicado**  
   Cadastrar duas pessoas com o mesmo email: segunda deve retornar 400 com "Este email já está cadastrado".

5. **Excluir registro**  
   Excluir pessoa/carro: deve retornar 204 e a lista deve atualizar com mensagem de sucesso. Se houver associações, backend pode retornar 400 orientando a remover associações primeiro.

6. **Associação duplicada**  
   Associar a mesma pessoa ao mesmo carro duas vezes: segunda vez deve retornar 400 "Esta pessoa já está associada a este carro".

7. **Atualizar registro**  
   Clicar em "Atualizar" em uma linha, ajustar dados e enviar: deve retornar 200 e mensagem de sucesso.

8. **Design**  
   Navegar por todas as páginas: conteúdo centralizado, formulários em card, tabela com cabeçalho escuro, botões com hover e mensagens de erro/sucesso destacadas.
