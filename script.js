// Simulação de backend usando JSON Server
const API_URL = 'http://localhost:3000/patients';

//Elementos principais
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.querySelector('.close');
const form = document.getElementById('examForm');
const tableBody = document.querySelector('#examTable tbody');

// Variável para armazenar o ID do paciente em edição
let editingId = null;

// Abrir modal para cadastrar um novo paciente
openModalBtn.onclick = () => {
  modal.style.display = 'block';
  editingId = null;
  form.reset();
};

closeModalBtn.onclick = () => modal.style.display = 'none';

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

// Função para formatar CPF enquanto o usuário digita
function formatarCPF(cpf) {
  return cpf.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

form.cpf.addEventListener('input', (e) => {
  e.target.value = formatarCPF(e.target.value);
});

// Carregar pacientes do "backend" na tabela
async function loadPatients() {
  const res = await fetch(API_URL);
  const patients = await res.json();

  tableBody.innerHTML = '';

  // Cria uma lista para cada paciente e coloca na tabela 
  patients.forEach((p) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.cpf}</td>
      <td>${p.exam}</td>
      <td>${p.status}</td>
      <td>
        <button class="edit" data-id="${p.id}">✏️</button>
        <button class="delete" data-id="${p.id}">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Adiciona ou edita paciente
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpfFormatado = form.cpf.value;
  
  // Valida o formato do CPF 
  if (cpfFormatado.length !== 14) {
    alert('CPF deve estar no formato 123.456.789-00');
    return;
  }

  // Monta o objeto paciente
  const patient = {
    name: form.name.value,
    cpf: cpfFormatado,
    exam: form.exam.value,
    status: form.status.value,
  };

  const res = await fetch(API_URL);
  const patients = await res.json();
  
  // Verificar se o CPF já existe
  const cpfExistente = patients.some(p => 
    p.cpf === cpfFormatado && p.id !== editingId
  );  

  if (cpfExistente) {
    alert('CPF já existe!');
    return;
  }

  // atualiza ou cria um novo paciente
  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
  }

  // Limpa o formulário e fechar o modal
  form.reset();
  modal.style.display = 'none';
  editingId = null;
  loadPatients();
});

// Eventos para editar e excluir pacientes
tableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // Remove o paciente
  if (e.target.classList.contains('delete')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadPatients();
  }

  // Busca o paciente para editar
  if (e.target.classList.contains('edit')) {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    form.name.value = p.name;
    form.cpf.value = p.cpf;
    form.exam.value = p.exam;
    form.status.value = p.status;

    editingId = id;
    modal.style.display = 'block';
  }
});

loadPatients();