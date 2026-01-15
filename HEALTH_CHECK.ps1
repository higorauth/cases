#!/usr/bin/env powershell
# JOSIAS - HEALTH CHECK
# Verifica se todos os servicos estao rodando corretamente

$services = @(
    @{ Name = "Frontend"; Url = "http://localhost:3000"; Port = 3000 },
    @{ Name = "Backend"; Url = "http://localhost:3001"; Port = 3001 },
    @{ Name = "AI Service"; Url = "http://localhost:8000"; Port = 8000 }
)

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "JOSIAS - HEALTH CHECK DOS SERVICOS" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$allHealthy = $true

foreach ($service in $services) {
    Write-Host "Verificando $($service.Name)..." -ForegroundColor Yellow -NoNewline
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port $service.Port -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
    
    if ($portOpen) {
        Write-Host " OK - Rodando em $($service.Url)" -ForegroundColor Green
    }
    else {
        Write-Host " ERRO - NAO ENCONTRADO em $($service.Url)" -ForegroundColor Red
        $allHealthy = $false
    }
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan

if ($allHealthy) {
    Write-Host "OK - TODOS OS SERVICOS ESTAO RODANDO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Acesse:" -ForegroundColor Green
    Write-Host "   Frontend:   http://localhost:3000" -ForegroundColor Magenta
    Write-Host "   Backend:    http://localhost:3001" -ForegroundColor Cyan
    Write-Host "   AI Service: http://localhost:8000" -ForegroundColor Green
}
else {
    Write-Host "ATENCAO - ALGUNS SERVICOS NAO ESTAO RODANDO!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para iniciar todos, execute:" -ForegroundColor Yellow
    Write-Host ".\START_ALL.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
