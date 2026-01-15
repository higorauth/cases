#!/usr/bin/env powershell
# JOSIAS - INICIAR BACKEND
# Mantem o backend rodando continuamente

$projectRoot = "c:\Users\silva\OneDrive\Desktop\Documentos\JOSIAS\backend"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "BACKEND - INIT" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "URL: http://localhost:3001" -ForegroundColor Green
Write-Host ""

Set-Location $projectRoot

# Compilar primeiro
Write-Host "Compilando..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro na compilacao!" -ForegroundColor Red
    exit 1
}

# Rodar
Write-Host ""
Write-Host "Rodando..." -ForegroundColor Green
node dist/main.js
