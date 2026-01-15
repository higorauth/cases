#!/usr/bin/env powershell
# JOSIAS - START FRONTEND ONLY (TESTE)

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "JOSIAS - TESTANDO FRONTEND" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Versao: $nodeVersion" -ForegroundColor Green

Write-Host ""
Write-Host "2. Verificando dependencias do frontend..." -ForegroundColor Yellow
if (Test-Path "$frontendPath\node_modules") {
    Write-Host "   Modules ja instalados" -ForegroundColor Green
}
else {
    Write-Host "   Instalando modulos..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install --legacy-peer-deps
}

Write-Host ""
Write-Host "3. Iniciando frontend..." -ForegroundColor Yellow
Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Aguarde 30-45 segundos para compilacao completa" -ForegroundColor Yellow
Write-Host ""

Set-Location $frontendPath
npm run dev
