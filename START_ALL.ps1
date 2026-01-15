#!/usr/bin/env powershell
# JOSIAS - START ALL SERVICES
# Este script inicia TODOS os serviços do projeto automaticamente

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ErrorActionPreference = "Continue"

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║     JOSIAS - INICIANDO TODOS OS SERVIÇOS                       ║
║     (Frontend + Backend + AI Service)                          ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Função para abrir nova janela do PowerShell
function Start-ServiceInNewWindow {
    param(
        [string]$Title,
        [string]$Path,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host "▶ Iniciando $Title..." -ForegroundColor $Color
    
    # Criar um arquivo temp com o comando
    $tempScript = "$env:TEMP\josias_$([guid]::NewGuid()).ps1"
    
    @"
Set-Location "$Path"
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor $Color
Write-Host "$Title" -ForegroundColor $Color
Write-Host "Diretório: $Path" -ForegroundColor $Color
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor $Color
Write-Host ""
$Command
"@ | Out-File -FilePath $tempScript -Encoding UTF8

    Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$tempScript`"" -WindowStyle Normal
}

# Verificar Node.js
Write-Host "`n[1/3] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js não encontrado! Instale em https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

# Verificar Python
Write-Host "`n[2/3] Verificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>$null
if ($null -eq $pythonVersion) {
    Write-Host "⚠️  Python não encontrado. AI Service não será iniciado." -ForegroundColor Yellow
}
else {
    Write-Host "✅ Python encontrado" -ForegroundColor Green
}

Write-Host "`n[3/3] Iniciando serviços..." -ForegroundColor Yellow
Write-Host ""

# Iniciar Frontend
Start-ServiceInNewWindow `
    -Title "🎨 FRONTEND (Next.js - http://localhost:3000)" `
    -Path "$ProjectRoot\frontend" `
    -Command "npm run dev" `
    -Color "Magenta"

Start-Sleep -Seconds 3

# Iniciar Backend
Start-ServiceInNewWindow `
    -Title "⚙️ BACKEND (NestJS - http://localhost:3001)" `
    -Path "$ProjectRoot\backend" `
    -Command "npm run start:dev" `
    -Color "Cyan"

Start-Sleep -Seconds 3

# Iniciar AI Service
Start-ServiceInNewWindow `
    -Title "🤖 AI SERVICE (FastAPI - http://localhost:8000)" `
    -Path "$ProjectRoot\ai-service" `
    -Command "python -m venv venv; venv\Scripts\activate; pip install -r requirements.txt -q; python -m uvicorn app.main:app --reload --port 8000" `
    -Color "Green"

Write-Host @"
═══════════════════════════════════════════════════════════════

✅ Todos os serviços foram iniciados!

🌐 ACESSAR:
   • Frontend:    http://localhost:3000
   • Backend:     http://localhost:3001
   • AI Service:  http://localhost:8000

⏳ AGUARDE 10-15 segundos para que tudo inicie completamente.

⚠️  IMPORTANTE PARA PRODUÇÃO:
   • Criar arquivo .env.production com variáveis seguras
   • Usar variáveis de ambiente seguras para senhas/chaves
   • Testar cada serviço individualmente antes do deploy
   • Executar npm run build antes do deploy

═══════════════════════════════════════════════════════════════
"@ -ForegroundColor Green

Write-Host "`nPressione ENTER para fechar este terminal..." -ForegroundColor Yellow
Read-Host
