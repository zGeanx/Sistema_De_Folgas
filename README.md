# 🔮 Sistema de Escalas de Folga

Sistema web completo para gerenciamento de solicitações de folgas para cartomantes, com separação de rotas para cartomantes (mobile-first) e administradores, interface com estética cósmica, validações de regras de negócio e dashboard em tempo real.

---

## 🚀 Tecnologias

### Backend
- **Django 5.2.4** - Framework web Python
- **Django REST Framework** - API REST
- **Simple JWT** - Autenticação JWT
- **PostgreSQL** - Banco de dados (produção)
- **SQLite** - Banco de dados (desenvolvimento)
- **CORS Headers** - Configuração de CORS

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Bundler ultrarrápido de desenvolvimento e build
- **React Router DOM 7** - Roteamento client-side com separação de páginas
- **TailwindCSS 3** - Framework de estilização com Design System customizado
- **shadcn/ui (Radix UI)** - Componentes de interface acessíveis e componíveis
- **Lucide React** - Biblioteca de ícones
- **Axios** - Cliente HTTP com interceptors para renovação de token JWT
- **React Toastify** - Notificações toast estilizadas

---

## ✨ Funcionalidades

### 📱 Portal das Cartomantes (`/`) — *Mobile-First*
- ✅ **Marcação Rápida de Folga**: Formulário touch-friendly com seleção intuitiva de dias em grade e cards de turnos (Manhã, Tarde, Noite).
- ✅ **Confirmação Visual**: Modal de confirmação antes do envio da solicitação.
- ✅ **Minha Escala**: Visualização em formato de cards da grade semanal de escalas aprovadas.
- ✅ **Bottom Navigation**: Barra de navegação inferior com efeito luminoso para alternar entre *Marcar Folga* e *Minha Escala*.
- ✅ **Responsivo**: Perfeita adaptação tanto em telas de celulares quanto em desktops.

### 🛡️ Portal Administrativo / Gestão (`/admin`)
- ✅ **Dashboard com KPIs em Tempo Real**: Total de solicitações, pendentes, aprovadas, recusadas e quantidade de cartomantes na escala.
- ✅ **Gestão Completa de Solicitações**: Aprovar, recusar e excluir solicitações de folga em 1 clique.
- ✅ **Filtros e Busca**: Busca instantânea por nome da cartomante e filtros por status (Todas, Pendente, Aprovada, Recusada).
- ✅ **Grade Semanal Consolidada**: Visualização tabular da distribuição de escalas e folgas de todas as cartomantes da semana.
- ✅ **Sidebar Retrátil**: Menu lateral moderno para desktop e bottom nav dedicada no mobile.

---

## 🧭 Rotas da Aplicação

| Rota | Descrição | Público |
|------|-----------|---------|
| `/` | Portal do Cartomante (Marcar Folga + Escala Semanal) | Cartomantes |
| `/admin` | Painel Administrativo (Dashboard + Gestão + Escala) | Gestores / Admins |

---

## 📋 Pré-requisitos

- **Python 3.10+**
- **Node.js 18+**
- **pip** (gerenciador de pacotes Python)
- **npm** (gerenciador de pacotes Node)

---

## 🔧 Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone https://github.com/zGeanx/Sistema_De_Folgas.git
cd Sistema_De_Folgas
```

### 2. Configurar Backend (Django)

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows (PowerShell / CMD):
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env (copiar do .env.example)
copy .env.example .env   # Windows
# cp .env.example .env   # Linux/Mac

# Executar migrações do banco
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Iniciar servidor de desenvolvimento
python manage.py runserver
```

> O backend estará acessível em: `http://localhost:8000`

### 3. Configurar Frontend (React + Vite)

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Vite)
npm run dev
```

> O frontend estará acessível em: `http://localhost:3000`

---

## 🐳 Docker (Opcional)

```bash
# Build e iniciar todos os serviços
docker-compose up --build

# Executar migrações no container
docker-compose exec backend python manage.py migrate

# Criar superusuário
docker-compose exec backend python manage.py createsuperuser
```

---

## 📚 Documentação da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register/` | Registrar novo usuário |
| POST | `/api/auth/login/` | Login (retorna JWT access/refresh) |
| POST | `/api/auth/logout/` | Logout e invalidação de token |
| POST | `/api/auth/token/refresh/` | Renovar access token |
| GET | `/api/auth/me/` | Obter perfil do usuário logado |

### Solicitações de Folga

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/solicitacoes/` | Listar todas as solicitações |
| POST | `/api/solicitacoes/` | Criar nova solicitação de folga |
| GET | `/api/solicitacoes/{id}/` | Obter detalhes da solicitação |
| PATCH | `/api/solicitacoes/{id}/` | Atualizar dados/status da solicitação |
| DELETE | `/api/solicitacoes/{id}/` | Remover solicitação |

---

## 📁 Estrutura do Projeto

```
Sistema_De_Folgas/
├── escala/                       # App Django de gestão de escalas
│   ├── migrations/               # Migrações do banco de dados
│   ├── models.py                 # Modelo SolicitacaoFolga
│   ├── serializers.py            # Serializers DRF
│   ├── urls.py                   # Rotas da API
│   └── views.py                  # ViewSet de solicitações
├── config/                       # Configurações do projeto Django
│   ├── settings.py               # Configurações gerais, CORS e JWT
│   └── urls.py                   # URLs base do projeto
├── frontend/                     # Aplicação React (Vite)
│   ├── public/                   # Arquivos estáticos
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # DashboardStats, cards de KPIs
│   │   │   ├── formulario/       # FormularioFolga mobile-first
│   │   │   ├── gestao/           # SolicitacoesGestao (aprovação/recusa)
│   │   │   ├── layout/           # Header, BottomNav, AdminSidebar
│   │   │   ├── tabela/           # TabelaEscala (cards / grade semanal)
│   │   │   └── ui/               # Componentes shadcn/ui (Button, Dialog, etc.)
│   │   ├── contexts/             # AuthContext
│   │   ├── hooks/                # useFolgas
│   │   ├── lib/                  # Utilitários shadcn (cn)
│   │   ├── pages/
│   │   │   ├── CartomantePage.jsx # Página principal do Cartomante
│   │   │   └── AdminPage.jsx      # Painel de Administração
│   │   ├── services/             # Axios client, auth.service, folgas.service
│   │   ├── utils/                # Constantes e formatadores
│   │   ├── App.jsx               # Roteador principal com React Router
│   │   ├── main.jsx              # Ponto de entrada React com BrowserRouter
│   │   └── index.css             # Design tokens e temas cósmicos
│   ├── components.json           # Configuração do shadcn/ui
│   ├── index.html                # Template HTML com meta tags mobile
│   ├── package.json              # Dependências e scripts
│   ├── tailwind.config.js        # Tokens de cores, animações e breakpoints
│   └── vite.config.js            # Configuração do Vite e aliases (@/)
├── manage.py                     # CLI Django
├── requirements.txt              # Dependências Python
└── docker-compose.yml            # Orquestração Docker
```

---

## 🎨 Design System

- **Paleta de Cores Cósmica**: Obsidian (`#0B0E17`), Midnight (`#131825`), Twilight (`#1A2035`), com acentos em Amber Gold (`#E8A832`), Amethyst (`#9B6DFF`), Jade (`#34D399`) e Coral (`#F87171`).
- **Tipografia**: *Plus Jakarta Sans* para legibilidade de interface e *Cinzel* para títulos místicos.
- **Micro-interações**: Efeitos de iluminação ambiente, glow suave na navegação e transições fluídas.

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add nova feature'`)
4. Faça o Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo de licença para mais detalhes.
