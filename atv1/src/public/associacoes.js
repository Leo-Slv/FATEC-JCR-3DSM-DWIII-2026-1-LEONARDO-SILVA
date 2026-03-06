const API_ASSOC = '/api/pessoa-por-carro';
const API_PESSOAS = '/api/pessoas';
const API_CARROS = '/api/carros';
const msg = document.getElementById('msg');
const form = document.getElementById('formAssoc');
const tbody = document.getElementById('listaAssoc');
const selPessoa = form.pessoaId;
const selCarro = form.carroId;

function showMsg(text, isError = true) {
  msg.textContent = text || '';
  msg.className = isError ? 'msg erro' : 'msg sucesso';
  msg.hidden = !text;
}

function safeStr(val) {
  return val != null ? String(val) : '';
}

async function carregarSelects() {
  try {
    const [rP, rC] = await Promise.all([fetch(API_PESSOAS), fetch(API_CARROS)]);
    const dataP = await rP.json().catch(() => ({}));
    const dataC = await rC.json().catch(() => ({}));
    const pessoas = (rP.ok && Array.isArray(dataP)) ? dataP : [];
    const carros = (rC.ok && Array.isArray(dataC)) ? dataC : [];
    selPessoa.innerHTML = '<option value="">Selecione uma pessoa</option>' +
      pessoas.map(p => `<option value="${p.id}">${safeStr(p.nome)} (${safeStr(p.email)})</option>`).join('');
    selCarro.innerHTML = '<option value="">Selecione um carro</option>' +
      carros.map(c => `<option value="${c.id}">${safeStr(c.modelo)} - ${safeStr(c.marca)} (${c.ano != null ? c.ano : ''})</option>`).join('');
  } catch (e) {
    showMsg('Erro ao carregar pessoas e carros.', true);
  }
}

function renderizarLista(list) {
  const lista = Array.isArray(list) ? list : [];
  tbody.innerHTML = lista.map(a => {
    const p = a && a.pessoa ? a.pessoa : {};
    const c = a && a.carro ? a.carro : {};
    return `
      <tr>
        <td>${a.id != null ? a.id : ''}</td>
        <td>${safeStr(p.nome)}</td>
        <td>${safeStr(p.email)}</td>
        <td>${safeStr(c.modelo)}</td>
        <td>${safeStr(c.marca)}</td>
        <td>${c.ano != null ? c.ano : ''}</td>
        <td class="acoes">
          <button type="button" class="btn btn-excluir" data-id="${a.id != null ? a.id : ''}">Excluir</button>
        </td>
      </tr>
    `;
  }).join('');
  tbody.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = parseInt(this.dataset.id, 10);
      if (Number.isInteger(id)) excluir(id);
    });
  });
}

async function listar() {
  showMsg('');
  try {
    const res = await fetch(API_ASSOC);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMsg(data.erro || 'Erro ao carregar associações.', true);
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
  if (!confirm('Excluir esta associação?')) return;
  showMsg('');
  try {
    const res = await fetch(`${API_ASSOC}/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      showMsg('Associação excluída com sucesso.', false);
      listar();
      return;
    }
    const data = await res.json().catch(() => ({}));
    showMsg(data.erro || 'Erro ao excluir.');
  } catch (e) {
    showMsg('Falha de rede. Tente novamente.');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pessoaId = selPessoa.value;
  const carroId = selCarro.value;
  showMsg('');
  if (!pessoaId || !carroId) {
    showMsg('Selecione uma pessoa e um carro.');
    return;
  }
  try {
    const res = await fetch(API_ASSOC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pessoaId, carroId })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMsg(data.erro || 'Erro ao associar.');
      return;
    }
    showMsg('Associação criada com sucesso.', false);
    form.reset();
    selPessoa.selectedIndex = 0;
    selCarro.selectedIndex = 0;
    listar();
  } catch (err) {
    showMsg('Falha de rede. Tente novamente.');
  }
});

carregarSelects();
listar();
