#!/usr/bin/env powershell
# JOSIAS - START WITH PM2
# Gerencia frontend e backend automaticamente

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "JOSIAS - INICIANDO COM PM2" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $projectRoot

# Parar serviços antigos se estiverem rodando
Write-Host "1. Limpando servicos antigos..." -ForegroundColor Yellow
pm2 kill 2>$null | Out-Null

# Compilar backend
Write-Host "2. Compilando backend..." -ForegroundColor Yellow
Set-Location "backend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro na compilacao do backend!" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Iniciar com PM2
Write-Host ""
Write-Host "3. Iniciando servicos..." -ForegroundColor Yellow
pm2 start ecosystem.config.js

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "SERVICOS INICIADOS!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Acessar:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Magenta
Write-Host "  Backend:   http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "  pm2 logs          - Ver logs" -ForegroundColor White
Write-Host "  pm2 stop all      - Parar todos" -ForegroundColor White
Write-Host "  pm2 restart all   - Reiniciar" -ForegroundColor White
Write-Host "  pm2 monit         - Monitor" -ForegroundColor White
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green

# Mostrar status
Write-Host ""
pm2 list
