#!/usr/bin/env powershell
# JOSIAS - INICIAR FRONTEND
# Mantem o frontend rodando continuamente

$projectRoot = "c:\Users\silva\OneDrive\Desktop\Documentos\JOSIAS\frontend"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "FRONTEND - INIT" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000" -ForegroundColor Green
Write-Host ""

Set-Location $projectRoot
npm run dev
