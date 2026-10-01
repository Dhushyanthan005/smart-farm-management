# ==============================================================================
# DairyFlow Development Environment Initialization (PowerShell)
# ==============================================================================

Write-Host "Initializing DairyFlow Development Environment..." -ForegroundColor Green

# 1. Check .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env created successfully." -ForegroundColor Green
} else {
    Write-Host ".env already exists." -ForegroundColor Cyan
}

# 2. Check Docker
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "Starting PostgreSQL and Redis containers with Docker Compose..." -ForegroundColor Yellow
    docker compose up -d
    Write-Host "Infrastructure containers are up." -ForegroundColor Green
} else {
    Write-Host "Docker is not available in PATH. Please ensure PostgreSQL and Redis are running locally." -ForegroundColor Red
}

Write-Host "`nSetup complete! You can now start:" -ForegroundColor Green
Write-Host "  1. Backend:  cd backend && mvn spring-boot:run" -ForegroundColor White
Write-Host "  2. Frontend: cd frontend && npm run dev" -ForegroundColor White
