# 🚀 JOSIAS - Guia de Inicialização

## Status da Construção ✅

- ✅ **Frontend**: Next.js 14+ completo com TypeScript, Tailwind CSS e Shadcn/ui
- ✅ **Backend**: NestJS com módulos para Conversas, Configurações e IA
- ✅ **AI Service**: FastAPI com OpenAI, RAG e Memory
- ⚠️ **Banco de Dados**: Prisma schema criado (aguardando conexão real)
- ✅ **Ambiente**: Variáveis de ambiente configuradas

---

## 📋 Pré-requisitos

1. **Node.js** 18+ (para Frontend e Backend)
2. **Python** 3.11+ (para AI Service)
3. **PostgreSQL** ou **Supabase** (para Banco de Dados)
4. **Redis** (para Cache)
5. **Chaves de API**:
   - OpenAI: `sk-...`
   - Supabase: URL e chave pública

---

## 🎯 Como Iniciar

### Terminal 1 - Frontend (Next.js)

```bash
cd Documentos/JOSIAS/frontend
npm run dev
```

Acessa em: **http://localhost:3000**

---

### Terminal 2 - Backend (NestJS)

```bash
cd Documentos/JOSIAS/backend

# Primeira vez: compilar projeto
npm run build

# Depois: rodar em desenvolvimento
npm run start:dev
```

Roda em: **http://localhost:3001**

✅ **Status**: Backend compilando com sucesso! Prisma possui fallback automático.

---

### Terminal 3 - AI Service (Python)

```bash
cd Documentos/JOSIAS/ai-service
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Roda em: **http://localhost:8000**

---

### Terminal 4 - Redis (Obrigatório)

```bash
redis-server
```

Roda em: **localhost:6379**

---

## 🗄️ Configuração do Banco de Dados

### Opção 1: Supabase (Recomendado)

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e chave pública
4. Adicione ao arquivo `.env` do backend:

```env
DATABASE_URL=postgresql://user:password@db.xxx.supabase.co:5432/postgres
```

5. Execute as migrações do Prisma:

```bash
cd backend
npx prisma migrate dev --name init
```

---

### Opção 2: PostgreSQL Local

```bash
# Instalar PostgreSQL
# Criar banco de dados
createdb josias

# Configurar .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/josias"

# Executar migrações
cd backend
npx prisma migrate dev --name init
```

---

## 🔑 Configurar Credenciais

### Frontend

Crie/edite `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend

Crie/edite `backend/.env`:

```env
DATABASE_URL="postgresql://..."
AI_SERVICE_URL="http://localhost:8000"
REDIS_HOST="localhost"
REDIS_PORT=6379
PORT=3001
```

### AI Service

Crie/edite `ai-service/.env`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

APP_HOST=0.0.0.0
APP_PORT=8000
```

---

## 🧪 Testar Integração

### 1. Criar Conversa (Frontend)

1. Abra http://localhost:3000
2. Clique em "Nova Conversa"

### 2. Enviar Mensagem

1. Digite uma mensagem
2. Pressione Enter ou clique em Enviar

### 3. Visualizar Health Checks

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:3001

# AI Service
curl http://localhost:8000/health
```

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module"

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install

# Python
cd ai-service && pip install -r requirements.txt
```

### Erro: "Connection refused"

- Verificar se Redis está rodando: `redis-cli ping`
- Verificar se PostgreSQL está rodando
- Verificar URLs no `.env`

### Erro: "Prisma Client not generated"

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## 📚 Estrutura do Projeto

```
Documentos/JOSIAS/
├── frontend/          # Next.js App (Port 3000)
│   ├── src/
│   │   ├── app/       # Pages e layout
│   │   ├── components/# UI components
│   │   ├── lib/       # Utilitários e API
│   │   └── types/     # TypeScript types
│   └── package.json
│
├── backend/           # NestJS API (Port 3001)
│   ├── src/
│   │   ├── ai/        # Serviço de IA
│   │   ├── conversations/  # Gerenciador de conversas
│   │   ├── settings/  # Configurações de IA
│   │   └── prisma/    # ORM
│   ├── prisma/        # Schema do BD
│   └── package.json
│
├── ai-service/        # Python FastAPI (Port 8000)
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   └── routers/
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🚀 Próximos Passos

1. **Integrar pgvector** no Supabase para RAG
2. **Configurar autenticação** (JWT/Supabase Auth)
3. **Adicionar logging** e monitoramento
4. **Implementar mobile** (React Native Expo)
5. **Deploy** (Vercel, Railway, ou similar)

---

## 📞 Suporte

Para dúvidas sobre funcionamento de componentes ou integração, consulte os arquivos:
- Frontend: `frontend/src/components/` e `frontend/src/types/`
- Backend: `backend/src/*/` módulos
- AI: `ai-service/app/services/`

---

**JOSIAS** - Seu assistente de IA inteligente para atendimento conversacional 🤖
