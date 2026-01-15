#!/usr/bin/env powershell
# JOSIAS - START BACKEND ONLY (TESTE)

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "JOSIAS - TESTANDO BACKEND" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"

Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Versao: $nodeVersion" -ForegroundColor Green

Write-Host ""
Write-Host "2. Verificando dependencias do backend..." -ForegroundColor Yellow
if (Test-Path "$backendPath\node_modules") {
    Write-Host "   Modules ja instalados" -ForegroundColor Green
}
else {
    Write-Host "   Instalando modulos..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install --legacy-peer-deps
}

Write-Host ""
Write-Host "3. Compilando backend..." -ForegroundColor Yellow
Set-Location $backendPath
npm run build

Write-Host ""
Write-Host "4. Iniciando backend..." -ForegroundColor Yellow
Write-Host "   URL: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Aguarde 15-20 segundos para inicializacao completa" -ForegroundColor Yellow
Write-Host ""

npm run start:dev
