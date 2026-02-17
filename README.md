# 🔮 Sistema de Escalas de Folga

Sistema web completo para gerenciamento de solicitações de folgas para cartomantes, com autenticação JWT, validações de regras de negócio e interface moderna.

## 🚀 Tecnologias

### Backend
- **Django 5.2.4** - Framework web Python
- **Django REST Framework** - API REST
- **Simple JWT** - Autenticação JWT
- **PostgreSQL** - Banco de dados (produção)
- **SQLite** - Banco de dados (desenvolvimento)
- **CORS Headers** - Configuração de CORS

### Frontend
- **React 19** - Biblioteca UI
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações
- **React Modal** - Modais customizados
- **CSS Modules** - Estilos isolados

## ✨ Funcionalidades

### Usuários
- ✅ Registro e autenticação via JWT
- ✅ Perfil de usuário
- ✅ Renovação automática de tokens

### Solicitações de Folga
- ✅ Criar solicitação de folga (dia da semana + turno)
- ✅ Visualizar minhas solicitações
- ✅ Validação de limite de folgas por semana
- ✅ Prevenção de duplicatas

### Gestores/Admin
- ✅ Aprovar ou recusar solicitações
- ✅ Visualizar todas as solicitações
- ✅ Dashboard com estatísticas
- ✅ Observações nas recusas

### Escala da Semana
- ✅ Visualização em tabela da escala completa
- ✅ Mostra folgas aprovadas por cartomante/turno
- ✅ Atualização em tempo real

## 📋 Pré-requisitos

- **Python 3.10+**
- **Node.js 18+**
- **pip** (gerenciador de pacotes Python)
- **npm** (gerenciador de pacotes Node)

## 🔧 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Sistema_De_Folgas.git
cd Sistema_De_Folgas-1
```

### 2. Configurar Backend

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env (copiar do .env.example)
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Editar .env e configurar SECRET_KEY

# Executar migrações
python manage.py migrate

# Criar superusuário (admin)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

O backend estará disponível em: `http://localhost:8000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env (copiar do .env.example)
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Iniciar servidor de desenvolvimento
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 🐳 Docker (Opcional)

```bash
# Build e iniciar todos os serviços
docker-compose up --build

# Executar migrações no container
docker-compose exec backend python manage.py migrate

# Criar superusuário
docker-compose exec backend python manage.py createsuperuser
```

## 📚 Documentação da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register/` | Registrar novo usuário |
| POST | `/api/auth/login/` | Login (retorna tokens) |
| POST | `/api/auth/logout/` | Logout |
| POST | `/api/auth/token/refresh/` | Renovar access token |
| GET | `/api/auth/me/` | Obter perfil do usuário |

### Solicitações de Folga

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/api/solicitacoes/` | Listar solicitações | Autenticado |
| POST | `/api/solicitacoes/` | Criar solicitação | Autenticado |
| GET | `/api/solicitacoes/{id}/` | Detalhes da solicitação | Autenticado |
| PUT/PATCH | `/api/solicitacoes/{id}/` | Atualizar solicitação | Dono ou Admin |
| DELETE | `/api/solicitacoes/{id}/` | Deletar solicitação | Dono ou Admin |
| POST | `/api/solicitacoes/{id}/aprovar/` | Aprovar folga | Admin |
| POST | `/api/solicitacoes/{id}/recusar/` | Recusar folga | Admin |
| GET | `/api/solicitacoes/minhas_folgas/` | Minhas solicitações | Autenticado |
| GET | `/api/solicitacoes/estatisticas/` | Dashboard stats | Autenticado |

### Exemplo de Uso

```bash
# 1. Registrar
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"cartomante","password":"senha123","email":"teste@email.com"}'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"cartomante","password":"senha123"}'

# 3. Criar solicitação de folga (use o access token)
curl -X POST http://localhost:8000/api/solicitacoes/ \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cartomante_nome":"Madame Zelda","dia_semana":"segunda","turno":"manha"}'

# 4. Listar solicitações
curl -X GET http://localhost:8000/api/solicitacoes/ \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

## 🧪 Testes

### Backend

```bash
# Executar todos os testes
python manage.py test

# Executar com coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend

```bash
cd frontend
npm test
```

## 📁 Estrutura do Projeto

```
Sistema_De_Folgas-1/
├── config/                 # Configurações Django
│   ├── settings/          # Settings por ambiente
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── escala/            # App de escalas de folga
│   │   ├── api/          # API REST
│   │   └── models.py
│   └── users/            # App de autenticação
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── services/     # Serviços API
│   │   ├── hooks/        # Custom hooks
│   │   ├── contexts/     # React contexts
│   │   └── utils/        # Utilitários
│   └── public/
├── tests/                # Testes backend
├── manage.py
├── requirements.txt
└── docker-compose.yml
```

## 🔐 Segurança

- ✅ Autenticação JWT com refresh tokens
- ✅ Validação de permissões por endpoint
- ✅ CORS configurado adequadamente
- ✅ Senhas hasheadas com Django
- ✅ Validações de dados no backend
- ✅ Proteção contra duplicatas

## 🚀 Deploy

### Backend (Render/Railway/Heroku)

1. Configure as variáveis de ambiente
2. Configure o banco PostgreSQL
3. Execute as migrations
4. Crie um superusuário
5. Colete arquivos estáticos: `python manage.py collectstatic`

### Frontend (Vercel/Netlify)

1. Configure `REACT_APP_API_URL` para apontar ao backend em produção
2. Build: `npm run build`
3. Deploy da pasta `build/`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


- Django e React communities
- Todos os contribuidores do projeto
