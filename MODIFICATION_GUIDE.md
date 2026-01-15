# 🎯 JOSIAS - CONFIGURATION GUIDE

## 📂 Estrutura do Projeto

```
JOSIAS/
├── frontend/              # Next.js (React)
│   ├── src/
│   │   ├── app/          # Páginas e layout
│   │   ├── components/   # Componentes React
│   │   ├── contexts/     # Context API (temas, estado global)
│   │   ├── lib/          # Utilitários e API client
│   │   └── types/        # TypeScript types
│   └── .env.local        # Variáveis do frontend
│
├── backend/              # NestJS (Node.js)
│   ├── src/
│   │   ├── ai/          # Módulo de IA
│   │   ├── conversations/ # Módulo de conversas
│   │   ├── settings/    # Módulo de configurações
│   │   ├── prisma/      # Banco de dados
│   │   └── main.ts      # Entrada da aplicação
│   ├── prisma/
│   │   └── schema.prisma # Schema do banco
│   └── .env             # Variáveis do backend
│
├── ai-service/          # FastAPI (Python)
│   ├── app/
│   │   ├── models/      # Schemas/DTOs
│   │   ├── routers/     # Endpoints
│   │   ├── services/    # Lógica de negócio
│   │   └── main.py      # Aplicação FastAPI
│   ├── requirements.txt  # Dependências Python
│   └── .env             # Variáveis do AI
│
└── Documentos de Referência (este arquivo)
```

---

## 🔧 COMO MODIFICAR CADA SERVIÇO

### 1️⃣ Frontend (Next.js)

#### Adicionar Nova Página
```typescript
// src/app/nova-pagina/page.tsx
export default function NovaPage() {
  return <h1>Nova Página</h1>
}
```

#### Adicionar Novo Componente
```typescript
// src/components/novo-componente.tsx
interface Props {
  titulo: string;
}

export function NovoComponente({ titulo }: Props) {
  return <div>{titulo}</div>
}
```

#### Conectar com API
```typescript
// src/lib/api.ts
export async function fetchData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`)
  return response.json()
}
```

**Variáveis de Ambiente:**
- `NEXT_PUBLIC_API_URL` = URL do backend (http://localhost:3001)

---

### 2️⃣ Backend (NestJS)

#### Adicionar Novo Endpoint
```typescript
// src/conversations/conversations.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('conversations')
export class ConversationsController {
  @Get()
  findAll() {
    return { message: 'Todas as conversas' }
  }

  @Post()
  create(@Body() data: any) {
    return { message: 'Conversa criada', data }
  }
}
```

#### Chamar AI Service
```typescript
// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  async chat(message: string) {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/chat`,
      { message }
    );
    return response.data;
  }
}
```

**Variáveis de Ambiente:**
- `DATABASE_URL` = Conexão do banco de dados
- `AI_SERVICE_URL` = URL do AI Service (http://localhost:8000)
- `REDIS_HOST` = Host do Redis
- `REDIS_PORT` = Porta do Redis
- `OPENAI_API_KEY` = Chave da OpenAI
- `PORT` = Porta do backend (3001)

---

### 3️⃣ AI Service (FastAPI)

#### Adicionar Novo Endpoint
```python
# app/routers/novo_router.py
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/nova-rota", tags=["nova"])

@router.get("/")
async def obter_dados():
    return {"dados": "exemplo"}

@router.post("/")
async def criar(dados: dict):
    return {"status": "criado", "dados": dados}
```

```python
# app/main.py
from app.routers import novo_router
app.include_router(novo_router.router)
```

#### Usar OpenAI
```python
# app/services/openai_service.py
from openai import OpenAI

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def chat(self, message: str):
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": message}]
        )
        return response.choices[0].message.content
```

**Variáveis de Ambiente:**
- `OPENAI_API_KEY` = Chave da OpenAI
- `DATABASE_URL` = Banco de dados (opcional)

---

## 🗂️ FLUXO DE DADOS

```
Frontend (http://localhost:3000)
        ↓
   [Faz requisição HTTP]
        ↓
Backend (http://localhost:3001)
        ├→ Salva no Banco de Dados (PostgreSQL)
        ├→ Cache no Redis
        └→ Chama AI Service
                ↓
        AI Service (http://localhost:8000)
                ├→ Processa com OpenAI
                ├→ Usa RAG (Retrieval)
                └→ Retorna resposta
        ↓
   [Resposta volta ao Frontend]
        ↓
Frontend exibe resultado
```

---

## 🚀 COMANDOS ÚTEIS

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Compilar
npm run start        # Produção
npm run lint         # Verificar erros
```

### Backend
```bash
npm run start:dev    # Desenvolvimento
npm run build        # Compilar
npm run start:prod   # Produção
npm run lint         # Verificar erros
npm run test         # Testes
```

### AI Service
```bash
python -m uvicorn app.main:app --reload  # Desenvolvimento
python -m uvicorn app.main:app           # Produção
pytest                                    # Testes
```

---

## 📝 EXEMPLO: Adicionar nova funcionalidade

### Requisito: Adicionar página "Histórico" no frontend com dados do backend

**PASSO 1 - Frontend: Criar página**
```typescript
// frontend/src/app/historico/page.tsx
import { useEffect, useState } from 'react'
import { fetchHistorico } from '@/lib/api'

export default function HistoricoPage() {
  const [historico, setHistorico] = useState([])

  useEffect(() => {
    fetchHistorico().then(setHistorico)
  }, [])

  return (
    <div>
      <h1>Histórico</h1>
      {historico.map(item => (
        <p key={item.id}>{item.titulo}</p>
      ))}
    </div>
  )
}
```

**PASSO 2 - Frontend: Adicionar função API**
```typescript
// frontend/src/lib/api.ts
export async function fetchHistorico() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations`
  )
  return response.json()
}
```

**PASSO 3 - Backend: Criar endpoint**
```typescript
// backend/src/conversations/conversations.controller.ts
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Get()
  async findAll() {
    return this.conversationsService.findAll()
  }
}
```

**PASSO 4 - Backend: Criar serviço**
```typescript
// backend/src/conversations/conversations.service.ts
@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.conversation.findMany()
  }
}
```

**PRONTO!** Agora a página mostrará o histórico do backend.

---

## 🔴 Troubleshooting

| Problema | Solução |
|----------|---------|
| Frontend não conecta no backend | Verificar `NEXT_PUBLIC_API_URL` em `.env.local` |
| Backend não inicia | Executar `npm install` e `npm run build` |
| AI Service lento | Aumentar timeout ou verificar quota OpenAI |
| Banco não funciona | Verificar `DATABASE_URL` e conexão PostgreSQL |
| Redis não conecta | Instalar Redis ou usar Redis cloud |

---

**Última atualização**: 23/12/2025
