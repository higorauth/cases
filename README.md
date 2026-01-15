# 🤖 JOSIAS - Sistema de IA Conversacional para Atendimento

Plataforma completa de IA conversacional para atendimento de leads com capacidades de vendas e suporte. Sistema distribuído com frontend moderno, backend robusto e microserviço de IA.

## 🎯 Características

- ✅ **Interface Web Moderna**: Next.js 14+ com TypeScript e Tailwind CSS
- ✅ **API REST Robusta**: NestJS com arquitetura modular
- ✅ **Microserviço de IA**: FastAPI com suporte a OpenAI e RAG
- ✅ **Chat em Tempo Real**: WebSocket-ready
- ✅ **Gerenciamento de Conversas**: Histórico completo com Redis
- ✅ **Configuração Personalizável**: Ajustes dinâmicos de IA
- ✅ **Busca Vetorial**: Integração com Supabase pgvector

## 🏗️ Arquitetura

### Stack Completo

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js 14+)  │  Mobile (React Native)  │
│  TypeScript | Tailwind    │  (Em Desenvolvimento)   │
└──────────┬────────────────────────────┬──────────────┘
           │                            │
           └──────────────┬─────────────┘
                          │
                ┌─────────▼────────────┐
                │  Backend (NestJS)   │
                │  TypeScript | Rest  │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼────┐        ┌────▼──────┐   ┌─────▼───────┐
    │PostgreSQL       │  Redis    │   │  FastAPI    │
    │(Supabase)       │ (Cache)   │   │ (AI Service)│
    └────────┘        └───────────┘   └─────────────┘
```

### Serviços

| Serviço | Porta | Stack | Status |
|---------|-------|-------|--------|
| **Frontend** | 3000 | Next.js 14+ | ✅ Pronto |
| **Backend** | 3001 | NestJS | ✅ Pronto |
| **IA Service** | 8000 | FastAPI | ✅ Pronto |
| **Redis** | 6379 | Redis | ⚠️ Requer instalação |
| **Banco de Dados** | 5432 | PostgreSQL | ⚠️ Requer configuração |

## 📁 Estrutura do Projeto

```
Documentos/JOSIAS/
├── frontend/                    # Next.js Application
│   ├── src/
│   │   ├── app/                # App Router e páginas
│   │   ├── components/         # Componentes React
│   │   │   ├── sidebar.tsx
│   │   │   ├── chat-interface.tsx
│   │   │   ├── settings-panel.tsx
│   │   │   └── credentials-form.tsx
│   │   ├── lib/                # Utilidades
│   │   │   ├── api.ts         # Cliente API Axios
│   │   │   └── utils.ts       # Helpers Tailwind
│   │   └── types/              # TypeScript interfaces
│   ├── package.json
│   └── .env.local
│
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── ai/                # Serviço de IA
│   │   ├── conversations/     # Gerenciador de conversas
│   │   ├── settings/          # Configurações de usuário
│   │   ├── prisma/            # ORM Service
│   │   ├── app.module.ts      # Módulo raiz
│   │   └── main.ts            # Bootstrap
│   ├── prisma/
│   │   └── schema.prisma      # Schema do banco
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── ai-service/                  # Python FastAPI
│   ├── app/
│   │   ├── config.py          # Configurações
│   │   ├── main.py            # FastAPI app
│   │   ├── models/            # Pydantic schemas
│   │   │   └── schemas.py
│   │   ├── services/          # Business logic
│   │   │   ├── openai_service.py
│   │   │   ├── rag_service.py
│   │   │   └── memory_service.py
│   │   └── routers/           # API endpoints
│   │       └── chat.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/                  # Virtual environment
│
├── shared/                      # Código compartilhado
│   └── (Futuro: tipos TS/Python)
│
├── README.md                    # Este arquivo
├── STARTUP_GUIDE.md            # Guia de inicialização
└── package-lock.json           # Dependências do workspace

```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Python 3.11+
- PostgreSQL/Supabase
- Redis

### 1️⃣ Iniciar Frontend

```bash
cd frontend
npm install  # se ainda não feito
npm run dev
```

Acessa em: **http://localhost:3000**

### 2️⃣ Iniciar Backend

```bash
cd backend
npm install  # se ainda não feito
npm run start:dev
```

Acessa em: **http://localhost:3001**

### 3️⃣ Iniciar AI Service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Acessa em: **http://localhost:8000**

### 4️⃣ Iniciar Redis

```bash
redis-server
```

---

## 📖 Documentação Detalhada

- **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Guia completo de inicialização e configuração
- **[frontend/README.md](./frontend/README.md)** - Documentação do Frontend
- **[backend/README.md](./backend/README.md)** - Documentação do Backend
- **[ai-service/README.md](./ai-service/README.md)** - Documentação do AI Service

---

## 🔑 Configuração de Variáveis de Ambiente

Consulte [STARTUP_GUIDE.md#-configurar-credenciais](./STARTUP_GUIDE.md#-configurar-credenciais) para detalhes.

**Arquivos necessários:**
- `frontend/.env.local`
- `backend/.env`
- `ai-service/.env`

---

## 🧪 Testando a Integração

### Health Checks

```bash
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:8000/health
```

### Criar Conversa

1. Abra http://localhost:3000
2. Clique em "Nova Conversa"
3. Digite uma mensagem
4. Pressione Enter

---

## 🛠️ Troubleshooting

### Problema: Build do Frontend falha

```bash
cd frontend
npm install
npm run build
```

### Problema: Prisma não gera cliente

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Problema: Python module not found

```bash
cd ai-service
pip install -r requirements.txt
```

### Problema: Connection refused

- Redis: `redis-cli ping`
- PostgreSQL: Verificar connection string em `.env`
- Backends: Verificar portas em uso

---

## 📦 Dependências Principais

### Frontend
- next@16+
- react@19+
- typescript@5+
- tailwindcss@4+
- shadcn/ui
- lucide-react
- axios
- zustand
- react-query

### Backend
- @nestjs/core@11+
- @nestjs/config
- @nestjs/websockets
- @prisma/client@5+
- axios
- redis

### AI Service
- fastapi@0.109+
- uvicorn@0.27+
- openai@1.12+
- supabase@2.3+
- redis@5+
- pydantic@2.5+

---

## 🔄 Fluxo de Dados

```
1. Usuário digita mensagem → Frontend
   ↓
2. Frontend envia → Backend (/conversations/message)
   ↓
3. Backend consulta settings → Database
   ↓
4. Backend envia → AI Service (/chat/message)
   ↓
5. AI Service:
   - Recupera histórico do Redis
   - Busca contexto na Base de Conhecimento (pgvector)
   - Chama OpenAI API
   - Salva no Redis
   ↓
6. AI Service retorna resposta → Backend
   ↓
7. Backend salva em BD e retorna → Frontend
   ↓
8. Frontend exibe mensagem ao usuário
```

---

## 🚀 Próximos Passos

- [ ] Configurar pgvector no Supabase
- [ ] Implementar autenticação (JWT/Supabase Auth)
- [ ] Adicionar logging centralizado
- [ ] Implementar Mobile (React Native Expo)
- [ ] Setup de CI/CD (GitHub Actions)
- [ ] Deploy (Vercel + Railway + Render)
- [ ] Testes automatizados (Jest, Pytest)
- [ ] Documentação de API (Swagger/OpenAPI)

---

## 📝 Licença

MIT - Veja LICENSE para detalhes

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças significativas, abra uma issue primeiro.

---

## 📞 Suporte

Para dúvidas:
1. Consulte [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)
2. Verifique logs dos serviços
3. Consulte documentação de cada pasta

---

**JOSIAS** - Seu assistente de IA inteligente para atendimento conversacional 🤖

Versão: **1.0.0** | Data: **Dezembro 2025**
