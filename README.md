# 🧪 Labo System
Sistema web para gerenciamento de laboratório clínico (simulação com API fake)

## 📋 Funcionalidades
- Cadastro de pacientes
- Edição de dados dos pacientes
- Visualização da lista de pacientes
- Exclusão de pacientes

## 🛠️ Tecnologias Utilizadas
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js com JSON Server (API fake)
- Ferramentas: Git, npm

## 📦 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
- Node.js (https://nodejs.org/) versão 12 ou superior
    - Verificar: `node -v`
- Git (https://git-scm.com/install/)
    - Verificar: `git -v`

## 🚀 Como executar o projeto

### 1. Clone o repositório
- Opção 1: `git clone https://github.com/luizgustavolgss/labo-system.git`

- Opção 2: Faça o download do ZIP e extraia em uma pasta.

### 2. Acesse a pasta do projeto
- `cd labo-system`

### 3. Instale as dependências
- `npm install` 

### 4. Inicie o servidor backend (API fake)
- Opção 1: Usando script npm (já configurado)
    - `npm run server`

- Opção 2: Comando direto do JSON Server
    - `json-server --watch db.json`

### 5. Abra o arquivo principal
- Opção 1: Abra o arquivo index.html diretamente no navegador

- Opção 2: extensão Live Server (ou equivalente) no VS Code

## 🔌 Endpoints da API
Com o servidor rodando, a API estará disponível em:
`http://localhost:3000/pacientes`

## 📧 Contato
- Nome: Luiz Gustavo Santos da Silva  
- GitHub: https://github.com/luizgustavolgss  
- Email: luizgustavolgss.dev@gmail.com
