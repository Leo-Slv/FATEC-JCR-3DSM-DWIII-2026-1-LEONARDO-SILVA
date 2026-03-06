const API = '/api/pessoas';
const msg = document.getElementById('msg');
const form = document.getElementById('formPessoa');
const tbody = document.getElementById('listaPessoas');

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;');
}

function decodeAttr(s) {
  return String(s).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<');
}

function showMsg(text, isError = true) {
  msg.textContent = text || '';
  msg.className = isError ? 'msg erro' : 'msg sucesso';
  msg.hidden = !text;
}

function renderizarLista(pessoas) {
  const lista = Array.isArray(pessoas) ? pessoas : [];
  tbody.innerHTML = lista.map(p => {
    const nome = p && p.nome != null ? String(p.nome) : '';
    const email = p && p.email != null ? String(p.email) : '';
    const id = p && p.id != null ? p.id : '';
    return `
      <tr data-id="${id}" data-nome="${escapeAttr(nome)}" data-email="${escapeAttr(email)}">
        <td>${id}</td>
        <td>${nome}</td>
        <td>${email}</td>
        <td class="acoes">
          <button type="button" class="btn btn-editar">Atualizar</button>
          <button type="button" class="btn btn-excluir" data-id="${id}">Excluir</button>
        </td>
      </tr>
    `;
  }).join('');
  tbody.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', function () { editar(this.closest('tr')); });
  });
  tbody.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', function () { excluir(parseInt(this.dataset.id, 10)); });
  });
}

async function listar() {
  showMsg('');
  try {
    const res = await fetch(API);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMsg(data.erro || 'Erro ao carregar a lista de pessoas.', true);
      renderizarLista([]);
      return;
    }
    renderizarLista(data);
  } catch (e) {
    showMsg('Falha de rede ou servidor. Tente novamente.', true);
    renderizarLista([]);
  }
}

async function excluir(id) {
  if (!confirm('Excluir esta pessoa?')) return;
  showMsg('');
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      showMsg('Pessoa excluída com sucesso.', false);
      listar();
      return;
    }
    const data = await res.json().catch(() => ({}));
    showMsg(data.erro || 'Erro ao excluir.');
  } catch (e) {
    showMsg('Falha de rede. Tente novamente.');
  }
}

function editar(tr) {
  if (!tr || !tr.dataset) return;
  const nomeInput = form.querySelector('[name="nome"]');
  const emailInput = form.querySelector('[name="email"]');
  nomeInput.value = tr.dataset.nome ? decodeAttr(tr.dataset.nome) : '';
  emailInput.value = tr.dataset.email ? decodeAttr(tr.dataset.email) : '';
  form.dataset.editId = tr.dataset.id;
  form.querySelector('button[type="submit"]').textContent = 'Atualizar';
}

function cadastrar(nome, email) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  });
}

function atualizar(id, nome, email) {
  return fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = form.dataset.editId;
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  showMsg('');
  if (!nome) {
    showMsg('Preencha o nome.');
    return;
  }
  if (!email) {
    showMsg('Preencha o email.');
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    showMsg('Digite um email válido.');
    return;
  }
  try {
    const res = editId
      ? await atualizar(editId, nome, email)
      : await cadastrar(nome, email);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMsg(data.erro || 'Erro ao salvar.');
      return;
    }
    showMsg(editId ? 'Pessoa atualizada com sucesso.' : 'Pessoa cadastrada com sucesso.', false);
    delete form.dataset.editId;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    listar();
  } catch (err) {
    showMsg('Falha de rede. Tente novamente.');
  }
});

listar();
