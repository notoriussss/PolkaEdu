#!/bin/bash

# Script para probar los endpoints de la API
# Asegúrate de que el servidor esté corriendo: npm run dev

BASE_URL="http://localhost:3000"

echo "🧪 Probando endpoints de la API..."
echo ""

# Health check
echo "1. Health Check..."
curl -s "$BASE_URL/health" | jq .
echo ""
echo "---"
echo ""

# Crear curso
echo "2. Crear curso..."
COURSE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/courses" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Curso de Prueba API",
    "description": "Probando la API",
    "instructor": "Test Instructor",
    "duration": 5,
    "price": 0
  }')

echo "$COURSE_RESPONSE" | jq .
COURSE_ID=$(echo "$COURSE_RESPONSE" | jq -r '.id')
echo ""
echo "---"
echo ""

# Obtener todos los cursos
echo "3. Obtener todos los cursos..."
curl -s "$BASE_URL/api/courses" | jq .
echo ""
echo "---"
echo ""

# Obtener curso por ID
echo "4. Obtener curso por ID..."
curl -s "$BASE_URL/api/courses/$COURSE_ID" | jq .
echo ""
echo "---"
echo ""

echo "✅ Pruebas completadas"
echo ""
echo "Nota: Para probar inscripciones, necesitas crear un usuario primero"
echo "      y tener su ID de usuario."

