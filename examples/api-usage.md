# Ejemplos de Uso de la API

## Crear un Curso

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introducción a Polkadot",
    "description": "Aprende los fundamentos de Polkadot y Substrate",
    "instructor": "Juan Pérez",
    "duration": 20,
    "price": 0,
    "lessons": [
      {
        "title": "¿Qué es Polkadot?",
        "description": "Introducción a la tecnología",
        "content": "# Contenido de la lección...",
        "order": 1,
        "duration": 30
      },
      {
        "title": "Parachains y Relay Chain",
        "description": "Arquitectura de Polkadot",
        "content": "# Contenido...",
        "order": 2,
        "duration": 45
      }
    ]
  }'
```

## Inscribir Usuario en Curso

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "courseId": "course-uuid-here"
  }'
```

## Actualizar Progreso

```bash
curl -X PUT http://localhost:3000/api/enrollments/enrollment-id/progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 75
  }'
```

## Completar Curso (emite certificado NFT)

```bash
curl -X POST http://localhost:3000/api/enrollments/enrollment-id/complete \
  -H "Content-Type: application/json"
```

## Obtener Certificados de un Usuario

```bash
curl http://localhost:3000/api/enrollments/user/user-id
```

