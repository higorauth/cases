# Script de exemplo - Copie para SETUP_COMPLETE.ps1 e configure suas chaves
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    JOSIAS - Setup Completo" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
$frontendPath = Join-Path $projectRoot "frontend"
$backendPath = Join-Path $projectRoot "backend"
$aiServicePath = Join-Path $projectRoot "ai-service"

# Frontend .env.local
Write-Host "1. Configurando Frontend..." -ForegroundColor Yellow
if (-not (Test-Path $frontendPath)) {
    Write-Host "   ERRO: Pasta frontend não encontrada!" -ForegroundColor Red
    exit 1
}

@"
NEXT_PUBLIC_API_URL=http://localhost:3001
"@ | Out-File -FilePath "$frontendPath\.env.local" -Encoding UTF8

Write-Host "   OK: Frontend pronto" -ForegroundColor Green

# Backend .env
Write-Host "2. Configurando Backend..." -ForegroundColor Yellow
if (-not (Test-Path $backendPath)) {
    Write-Host "   ERRO: Pasta backend não encontrada!" -ForegroundColor Red
    exit 1
}

@"
DATABASE_URL=postgresql://user:password@localhost:5432/josias
AI_SERVICE_URL=http://localhost:8000
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3001
OPENAI_API_KEY=your-openai-api-key-here
"@ | Out-File -FilePath "$backendPath\.env" -Encoding UTF8

Write-Host "   OK: Backend pronto" -ForegroundColor Green

# AI Service .env
Write-Host "3. Configurando AI Service..." -ForegroundColor Yellow
if (-not (Test-Path $aiServicePath)) {
    Write-Host "   ERRO: Pasta ai-service não encontrada!" -ForegroundColor Red
    exit 1
}

@"
OPENAI_API_KEY=your-openai-api-key-here
REDIS_HOST=localhost
REDIS_PORT=6379
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
"@ | Out-File -FilePath "$aiServicePath\.env" -Encoding UTF8

Write-Host "   OK: AI Service pronto" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "    SETUP CONCLUÍDO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure suas chaves API nos arquivos .env" -ForegroundColor White
Write-Host "2. Execute: .\START_ALL.ps1" -ForegroundColor White
Write-Host ""
