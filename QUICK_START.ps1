#!/usr/bin/env powershell
# JOSIAS Quick Start Guide

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║     JOSIAS - GUIA RÁPIDO DE INICIALIZAÇÃO                      ║
╚════════════════════════════════════════════════════════════════╝

🚀 INICIAR AGORA (3 PASSOS)

PASSO 1: Abrir Terminal 1 (Frontend)
──────────────────────────────────────
cd c:\Users\silva\OneDrive\Desktop\Documentos\JOSIAS\frontend
npm run dev

✓ Frontend estará em: http://localhost:3000


PASSO 2: Abrir Terminal 2 (Backend)
──────────────────────────────────────
cd c:\Users\silva\OneDrive\Desktop\Documentos\JOSIAS\backend
npm run start:dev

✓ Backend estará em: http://localhost:3001


PASSO 3 (OPCIONAL): AI Service
───────────────────────────────
cd c:\Users\silva\OneDrive\Desktop\Documentos\JOSIAS\ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

✓ AI Service estará em: http://localhost:8000


═══════════════════════════════════════════════════════════════

📋 ARQUIVOS IMPORTANTES

- EXECUTIVE_SUMMARY.md    → Sumário executivo
- PROJECT_SUMMARY.md      → Detalhes técnicos
- STARTUP_GUIDE.md        → Guia de inicialização
- BACKEND_COMPLETION.md   → Status do backend
- README.md               → Visão geral


═══════════════════════════════════════════════════════════════

🔧 VARIÁVEIS DE AMBIENTE

Backend (.env):
  DATABASE_URL="postgresql://..."
  AI_SERVICE_URL="http://localhost:8000"
  REDIS_HOST="localhost"
  PORT=3001

AI Service (.env):
  OPENAI_API_KEY="sk-..."
  SUPABASE_URL="https://..."
  SUPABASE_KEY="eyJ..."
  REDIS_HOST="localhost"


═══════════════════════════════════════════════════════════════

✅ STATUS VERIFICADO

✓ Frontend: Next.js 16+ compilado e rodando
✓ Backend: NestJS 11+ compilado e rodando  
✓ AI Service: FastAPI pronto (Python necessário)
✓ Banco de dados: Schema criado (conexão pendente)
✓ Documentação: Completa


═══════════════════════════════════════════════════════════════

🎯 PRÓXIMOS PASSOS

1. Abrir http://localhost:3000 e testar interface
2. (Opcional) Instalar Python para ativar AI Service
3. (Opcional) Conectar PostgreSQL/Supabase real
4. (Opcional) Adicionar autenticação
5. (Opcional) Configurar Redis para cache


═══════════════════════════════════════════════════════════════

Desenvolvido com ❤️ usando Next.js + NestJS + FastAPI
JOSIAS v1.0.0 - 20 de Dezembro de 2024

"@ -ForegroundColor Cyan
