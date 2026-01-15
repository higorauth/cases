# JOSIAS Backend

Backend NestJS para o sistema de conversação com IA integrada.

##  Requisitos

- Node.js 18+
- npm 9+
- PostgreSQL 14+ ou Supabase (para banco de dados)
- Redis 6+ (para cache de conversas)

##  Instalação

\\\ash
cd backend
npm install
\\\

##  Configuração

1. Crie um arquivo \.env\ na raiz do diretório backend:

\\\env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/josias"

# AI Service
AI_SERVICE_URL="http://localhost:8000"
AI_SERVICE_TIMEOUT=30000

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# Server
PORT=3001
NODE_ENV="development"
\\\

##  Quick Start

\\\ash
# Em desenvolvimento
npm run start:dev

# Em produção
npm run build
npm run start
\\\

##  Estrutura de Módulos

### Prisma Module
- PrismaService: Gerencia conexão com banco de dados
- Fallback automático para mock se Prisma não estiver disponível

### AI Module
- AiService: Comunicação com serviço Python/FastAPI em localhost:8000

### Settings Module  
- SettingsService: CRUD de configurações de IA por usuário
- Endpoints: GET/PUT /settings/:userId

### Conversations Module
- ConversationsService: Gerenciamento de conversas e mensagens
- Endpoints: GET/POST/DELETE /conversations/:userId, POST /conversations/:conversationId/message

##  Integração

**Frontend** (port 3000)  **Backend** (port 3001)  **AI Service** (port 8000)

##  Banco de Dados

Schema Prisma com modelos: User, AISettings, Conversation, Message, KnowledgeBase

##  Variáveis de Ambiente

- DATABASE_URL: String de conexão PostgreSQL
- AI_SERVICE_URL: URL do serviço de IA (padrão: http://localhost:8000)
- REDIS_HOST/PORT: Configuração do Redis
- PORT: Porta do servidor (padrão: 3001)

##  Licença

MIT
