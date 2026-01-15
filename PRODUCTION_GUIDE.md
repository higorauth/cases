# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## PRÉ-DEPLOYMENT (Antes de subir para produção)

### ✅ Verificação Técnica
- [ ] Todas as variáveis de `.env` foram movidas para variáveis de ambiente seguras (não em arquivo)
- [ ] API Keys e senhas NÃO estão em arquivos de configuração
- [ ] Frontend compilado com `npm run build`
- [ ] Backend compilado com `npm run build`
- [ ] Testes passando: `npm run test`
- [ ] Linter sem erros: `npm run lint`
- [ ] Ambiente de produção diferente do desenvolvimento

### 🔐 Segurança
- [ ] CORS configurado apenas para domínios autorizados
- [ ] Autenticação implementada em endpoints privados
- [ ] Rate limiting configurado
- [ ] Validação de inputs em todos os endpoints
- [ ] Logs de erro não expõem informações sensíveis
- [ ] HTTPS habilitado em produção

### 🗄️ Banco de Dados
- [ ] Usar PostgreSQL/Supabase em produção (não SQLite)
- [ ] Backups automáticos configurados
- [ ] Migrações Prisma testadas: `npx prisma migrate deploy`
- [ ] Índices de banco de dados otimizados
- [ ] Teste de performance com dados reais

### 🔄 Deployment
- [ ] CI/CD pipeline configurado
- [ ] Docker setup opcional (para escalabilidade)
- [ ] Monitoramento e alertas configurados
- [ ] Plano de rollback documentado
- [ ] Teste de carga realizado

---

## 📋 GUIA RÁPIDO DE DEPLOY

### Opção 1: Heroku / Railway (Fácil)
```bash
# 1. Push para GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Configurar variáveis de ambiente na plataforma
# DATABASE_URL, OPENAI_API_KEY, etc.

# 3. Deploy automático
```

### Opção 2: VPS (Mais controle)
```bash
# 1. SSH no servidor
ssh user@seu-servidor.com

# 2. Clonar projeto
git clone seu-repositorio.git
cd seu-repositorio

# 3. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Instalar PM2 (mantém serviço rodando)
npm install -g pm2

# 5. Instalar dependências
npm install
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
cd ../ai-service && python -m venv venv && source venv/bin/activate

# 6. Iniciar com PM2
pm2 start "npm run start:prod" --name backend
pm2 start "npm run start" --name frontend
pm2 startup
pm2 save
```

### Opção 3: Docker (Recomendado para escala)
```dockerfile
# Criar Dockerfile para cada serviço
# Backend
FROM node:18
WORKDIR /app
COPY backend .
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

---

## 🎯 URLs DE PRODUÇÃO

Configure estas variáveis de ambiente:

```env
# Produção
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api
DATABASE_URL=postgresql://user:pass@sua-db.com:5432/josias_prod
REDIS_URL=redis://sua-cache.com:6379
OPENAI_API_KEY=sk-your-production-key
NODE_ENV=production
```

---

## ⚠️ IMPORTANT - NÃO FAÇA ISSO EM PRODUÇÃO

❌ Não use credenciais do desenvolvimento  
❌ Não deixe DEBUG=true  
❌ Não exponha variáveis de ambiente sensíveis  
❌ Não use banco de dados de desenvolvimento  
❌ Não rode com npm run dev (sempre usar build + start:prod)  

---

## 🆘 Se algo der errado em produção

1. **Verificar logs**: `pm2 logs backend`
2. **Rollback**: `git revert <commit>` + redeploy
3. **Restart**: `pm2 restart backend`
4. **Health Check**: `curl https://seu-dominio.com/health`

---

**Data de criação**: 23/12/2025  
**Status**: Pronto para produção
