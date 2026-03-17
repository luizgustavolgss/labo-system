const API_URL = 'http://localhost:3000/patients';

const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.querySelector('.close');
const form = document.getElementById('examForm');
const tableBody = document.querySelector('#examTable tbody');

let editingId = null;

openModalBtn.onclick = () => {
  modal.style.display = 'block';
  editingId = null;
  form.reset();
};

closeModalBtn.onclick = () => modal.style.display = 'none';

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

function formatarCPF(cpf) {
  return cpf.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

form.cpf.addEventListener('input', (e) => {
  e.target.value = formatarCPF(e.target.value);
});

async function loadPatients() {
  const res = await fetch(API_URL);
  const patients = await res.json();

  tableBody.innerHTML = '';

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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpfFormatado = form.cpf.value;
  
  if (cpfFormatado.length !== 14) {
    alert('CPF deve estar no formato 123.456.789-00');
    return;
  }

  const patient = {
    name: form.name.value,
    cpf: cpfFormatado,
    exam: form.exam.value,
    status: form.status.value,
  };

  const res = await fetch(API_URL);
  const patients = await res.json();
  
  const cpfExistente = patients.some(p => 
    p.cpf === cpfFormatado && p.id !== editingId
  );

  if (cpfExistente) {
    alert('CPF já existe!');
    return;
  }

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

  form.reset();
  modal.style.display = 'none';
  editingId = null;
  loadPatients();
});

tableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('delete')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadPatients();
  }

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