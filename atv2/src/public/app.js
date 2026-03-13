const API_BASE = '/api/itens';

let itens = [];
let statusFiltro = 'all';
let busca = '';

const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const itemForm = document.getElementById('itemForm');
const modalTitle = document.getElementById('modalTitle');
const itemId = document.getElementById('itemId');
const btnCreate = document.getElementById('btnCreate');
const btnCancel = document.getElementById('btnCancel');

// Carregar itens
async function carregarItens() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Erro ao carregar itens');
    itens = await res.json();
    renderizarTabela();
  } catch (err) {
    console.error(err);
    itens = [];
    renderizarTabela();
  }
}

// Filtrar itens (status + busca)
function filtrarItens() {
  return itens.filter(item => {
    const matchStatus = statusFiltro === 'all' || item.status === statusFiltro;
    const matchBusca = !busca || item.nome.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });
}

function formatarPreco(val) {
  return Number(val ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderizarTabela() {
  const filtrados = filtrarItens();
  if (filtrados.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <p>Nenhum item encontrado.</p>
          <p>Adicione um item clicando em "+ Adicionar Item"</p>
        </td>
      </tr>`;
    return;
  }
  tableBody.innerHTML = filtrados.map(item => `
    <tr>
      <td><input type="checkbox" class="row-checkbox" data-id="${item._id}"></td>
      <td>#${String(item._id).slice(-6)}</td>
      <td>
        <div class="product-cell">
          <div class="product-thumb">📦</div>
          <span>${escaparHtml(item.nome)}</span>
        </div>
      </td>
      <td>${item.quantidade ?? 1}</td>
      <td>R$ ${formatarPreco(item.preco)}</td>
      <td><span class="status-badge status-${item.status || 'pendente'}">${formatarStatus(item.status)}</span></td>
      <td>
        <button type="button" class="btn-action btn-edit" data-id="${item._id}" title="Editar">✎</button>
        <button type="button" class="btn-action btn-delete" data-id="${item._id}" title="Excluir">🗑</button>
      </td>
    </tr>
  `).join('');
  bindAcoes();
}

function escaparHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatarStatus(s) {
  const map = { pendente: 'Pendente', comprado: 'Comprado', cancelado: 'Cancelado' };
  return map[s] || s;
}

function bindAcoes() {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => abrirModalEditar(btn.dataset.id));
  });
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => excluirItem(btn.dataset.id));
  });
}

async function abrirModalEditar(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Item não encontrado');
    const item = await res.json();
    itemId.value = item._id;
    document.getElementById('nome').value = item.nome;
    document.getElementById('quantidade').value = item.quantidade ?? 1;
    document.getElementById('preco').value = item.preco ?? 0;
    document.getElementById('status').value = item.status || 'pendente';
    modalTitle.textContent = 'Editar Item';
    modalOverlay.classList.add('open');
  } catch (err) {
    alert('Erro ao carregar item.');
  }
}

async function excluirItem(id) {
  if (!confirm('Deseja realmente excluir este item?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir');
    await carregarItens();
  } catch (err) {
    alert('Erro ao excluir item.');
  }
}

// Modal
btnCreate.addEventListener('click', () => {
  itemId.value = '';
  itemForm.reset();
  document.getElementById('quantidade').value = 1;
  document.getElementById('preco').value = 0;
  document.getElementById('status').value = 'pendente';
  modalTitle.textContent = 'Adicionar Item';
  modalOverlay.classList.add('open');
});

btnCancel.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

itemForm.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    nome: document.getElementById('nome').value.trim(),
    quantidade: parseInt(document.getElementById('quantidade').value, 10) || 1,
    preco: parseFloat(document.getElementById('preco').value) || 0,
    status: document.getElementById('status').value
  };
  const id = itemId.value;
  try {
    if (id) {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao atualizar');
    } else {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao criar');
    }
    modalOverlay.classList.remove('open');
    await carregarItens();
  } catch (err) {
    alert('Erro ao salvar item. Verifique os dados.');
  }
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    statusFiltro = tab.dataset.status;
    renderizarTabela();
  });
});

// Busca
searchInput.addEventListener('input', () => {
  busca = searchInput.value;
  renderizarTabela();
});

// Inicialização
carregarItens();
