# Script PowerShell para probar los endpoints de la API
# Asegúrate de que el servidor esté corriendo: npm run dev

$baseUrl = "http://localhost:3000"

Write-Host "🧪 Probando endpoints de la API..." -ForegroundColor Cyan
Write-Host ""

# Health check
Write-Host "1. Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
$health | ConvertTo-Json
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Crear curso
Write-Host "2. Crear curso..." -ForegroundColor Yellow
$courseBody = @{
    title = "Curso de Prueba API"
    description = "Probando la API"
    instructor = "Test Instructor"
    duration = 5
    price = 0
} | ConvertTo-Json

$courseResponse = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Post -Body $courseBody -ContentType "application/json"
$courseResponse | ConvertTo-Json
$courseId = $courseResponse.id
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Obtener todos los cursos
Write-Host "3. Obtener todos los cursos..." -ForegroundColor Yellow
$courses = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Get
$courses | ConvertTo-Json
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Obtener curso por ID
Write-Host "4. Obtener curso por ID..." -ForegroundColor Yellow
$course = Invoke-RestMethod -Uri "$baseUrl/api/courses/$courseId" -Method Get
$course | ConvertTo-Json
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Pruebas completadas" -ForegroundColor Green
Write-Host ""
Write-Host "Nota: Para probar inscripciones, necesitas crear un usuario primero" -ForegroundColor Yellow
Write-Host "      y tener su ID de usuario." -ForegroundColor Yellow

