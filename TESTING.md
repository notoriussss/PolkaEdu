# 🧪 Guía de Pruebas

Esta guía te ayudará a verificar que todo funciona correctamente.

## Prerrequisitos

Antes de probar, asegúrate de tener:

1. ✅ Dependencias instaladas: `npm install`
2. ✅ Variables de entorno configuradas en `.env`
3. ✅ Servidor corriendo (si pruebas endpoints): `npm run dev`

## Opción 1: Prueba Automática Completa (Recomendada)

Este script prueba todo el flujo automáticamente:

```bash
npx tsx scripts/test-full-flow.ts
```

**Qué prueba:**
- ✅ Conexión con Polkadot
- ✅ Almacenamiento en memoria
- ✅ Creación de usuario
- ✅ Creación de curso
- ✅ Inscripción de usuario
- ✅ Actualización de progreso
- ✅ Emisión de certificado NFT

**Salida esperada:**
```
🧪 Iniciando pruebas del flujo completo...
📡 Paso 1: Verificando conexión con Polkadot...
✅ Conectado a: Polkadot
...
✨ PRUEBAS COMPLETADAS EXITOSAMENTE
```

## Opción 2: Pruebas Paso a Paso

### 1. Probar Conexión con Polkadot

```bash
npx tsx scripts/test-polkadot-connection.ts
```

Deberías ver:
- ✅ Nombre de la cadena
- ✅ Versión del nodo
- ✅ Último bloque
- ✅ Disponibilidad del pallet uniques

### 2. Probar Endpoints de la API

#### En Windows (PowerShell):
```powershell
.\scripts\test-api-endpoints.ps1
```

#### En Linux/Mac:
```bash
chmod +x scripts/test-api-endpoints.sh
./scripts/test-api-endpoints.sh
```

O manualmente con curl:

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Crear un curso:**
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Primer Curso",
    "description": "Descripción del curso",
    "instructor": "Juan Pérez",
    "duration": 10,
    "price": 0
  }'
```

**Obtener todos los cursos:**
```bash
curl http://localhost:3000/api/courses
```

### 3. Probar con Postman o Thunder Client

Importa esta colección de ejemplo:

**Health Check:**
- GET `http://localhost:3000/health`

**Cursos:**
- GET `http://localhost:3000/api/courses`
- POST `http://localhost:3000/api/courses`
  ```json
  {
    "title": "Curso de Prueba",
    "description": "Descripción",
    "instructor": "Instructor",
    "duration": 5,
    "price": 0
  }
  ```
- GET `http://localhost:3000/api/courses/:id`
- PUT `http://localhost:3000/api/courses/:id`
- DELETE `http://localhost:3000/api/courses/:id`

**Inscripciones:**
- POST `http://localhost:3000/api/enrollments`
  ```json
  {
    "userId": "user-id-here",
    "courseId": "course-id-here"
  }
  ```
- GET `http://localhost:3000/api/enrollments/user/:userId`
- PUT `http://localhost:3000/api/enrollments/:id/progress`
  ```json
  {
    "progress": 75
  }
  ```
- POST `http://localhost:3000/api/enrollments/:id/complete`

## Opción 3: Prueba Manual del Flujo Completo

### Paso 1: Crear un Usuario (usando Prisma Studio o SQL)

```bash
npx prisma studio
```

O directamente en la base de datos:
```sql
INSERT INTO "User" (id, email, "passwordHash", name, "walletAddress", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'test@example.com',
  '$2a$10$hashedpassword', -- usar bcrypt para hash real
  'Usuario Test',
  '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', -- dirección de prueba
  NOW(),
  NOW()
);
```

### Paso 2: Crear un Curso

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Curso de Blockchain",
    "description": "Aprende sobre blockchain",
    "instructor": "Profesor",
    "duration": 20,
    "price": 0,
    "lessons": [
      {
        "title": "Lección 1",
        "content": "# Contenido",
        "order": 1,
        "duration": 30
      }
    ]
  }'
```

Guarda el `id` del curso creado.

### Paso 3: Inscribir Usuario

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_AQUI",
    "courseId": "COURSE_ID_AQUI"
  }'
```

Guarda el `id` de la inscripción.

### Paso 4: Actualizar Progreso

```bash
curl -X PUT http://localhost:3000/api/enrollments/ENROLLMENT_ID/progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 100
  }'
```

### Paso 5: Verificar Certificado

El certificado debería crearse automáticamente cuando el progreso llega a 100%.

Verifica en la base de datos:
```sql
SELECT * FROM "Certificate" WHERE "enrollmentId" = 'ENROLLMENT_ID';
```

O consulta la inscripción:
```bash
curl http://localhost:3000/api/enrollments/ENROLLMENT_ID
```

## Solución de Problemas

### Error: "Cannot find module '@polkadot/api'"
```bash
npm install
```

### Error: "Usuario no encontrado" o "Curso no encontrado"
- Los datos están en memoria, se pierden al reiniciar el servidor
- Asegúrate de crear los usuarios y cursos antes de usarlos

### Error: "Polkadot API no inicializada"
- Verifica `POLKADOT_WS_URL` en `.env`
- Prueba con: `wss://westend-rpc.polkadot.io` (testnet)

### Error: "No hay cuenta configurada"
- Agrega `POLKADOT_ACCOUNT_MNEMONIC` en `.env`
- Usa solo cuentas de prueba, nunca cuentas con fondos reales

### Certificado NFT no se crea
- Verifica que tengas `POLKADOT_ACCOUNT_MNEMONIC` configurado
- Verifica que la cuenta tenga fondos (en testnet)
- Verifica los logs del servidor para ver errores específicos
- Asegúrate de que el pallet `uniques` esté disponible en tu red

## Verificar NFTs en Polkadot.js Apps

1. Ve a https://polkadot.js.org/apps
2. Conecta a la misma red que configuraste
3. Ve a "Network" > "Explorer"
4. Busca el hash de transacción del certificado
5. O ve a "Developer" > "Chain state" y consulta `uniques.asset`

## Próximos Pasos

Una vez que todo funcione:

1. ✅ Implementa autenticación JWT
2. ✅ Agrega validación de datos con Zod
3. ✅ Implementa subida real a IPFS
4. ✅ Agrega tests unitarios
5. ✅ Crea el frontend

