const API = '/api/carros';
const msg = document.getElementById('msg');
const form = document.getElementById('formCarro');
const tbody = document.getElementById('listaCarros');

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

function renderizarLista(carros) {
  const lista = Array.isArray(carros) ? carros : [];
  tbody.innerHTML = lista.map(c => {
    const modelo = c && c.modelo != null ? String(c.modelo) : '';
    const marca = c && c.marca != null ? String(c.marca) : '';
    const ano = c && c.ano != null ? c.ano : '';
    const id = c && c.id != null ? c.id : '';
    return `
      <tr data-id="${id}" data-modelo="${escapeAttr(modelo)}" data-marca="${escapeAttr(marca)}" data-ano="${ano}">
        <td>${id}</td>
        <td>${modelo}</td>
        <td>${marca}</td>
        <td>${ano}</td>
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
      showMsg(data.erro || 'Erro ao carregar a lista de carros.', true);
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
  if (!confirm('Excluir este carro?')) return;
  showMsg('');
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      showMsg('Carro excluído com sucesso.', false);
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
  form.modelo.value = tr.dataset.modelo ? decodeAttr(tr.dataset.modelo) : '';
  form.marca.value = tr.dataset.marca ? decodeAttr(tr.dataset.marca) : '';
  form.ano.value = tr.dataset.ano || '';
  form.dataset.editId = tr.dataset.id;
  form.querySelector('button[type="submit"]').textContent = 'Atualizar';
}

function cadastrar(modelo, marca, ano) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelo, marca, ano })
  });
}

function atualizar(id, modelo, marca, ano) {
  return fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelo, marca, ano })
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = form.dataset.editId;
  const modelo = form.modelo.value.trim();
  const marca = form.marca.value.trim();
  const anoRaw = form.ano.value.trim();
  const ano = anoRaw === '' ? NaN : parseInt(anoRaw, 10);
  showMsg('');
  if (!modelo) {
    showMsg('Preencha o modelo.');
    return;
  }
  if (!marca) {
    showMsg('Preencha a marca.');
    return;
  }
  if (!Number.isInteger(ano) || ano < 1900 || ano > 2100) {
    showMsg('Ano deve ser um número entre 1900 e 2100.');
    return;
  }
  try {
    const res = editId
      ? await atualizar(editId, modelo, marca, ano)
      : await cadastrar(modelo, marca, ano);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMsg(data.erro || 'Erro ao salvar.');
      return;
    }
    showMsg(editId ? 'Carro atualizado com sucesso.' : 'Carro cadastrado com sucesso.', false);
    delete form.dataset.editId;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    listar();
  } catch (err) {
    showMsg('Falha de rede. Tente novamente.');
  }
});

listar();
