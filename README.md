# 🎓 PolkaEdu Backend

Backend API para una plataforma de cursos educativos con certificados NFT en Polkadot. Los estudiantes pueden inscribirse en cursos, completar lecciones y recibir certificados NFT verificables en la blockchain.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Polkadot](https://img.shields.io/badge/Polkadot-16.5.1-purple.svg)](https://polkadot.network/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Características

- 📚 **Gestión de Cursos**: Crear, actualizar y gestionar cursos con lecciones
- 👥 **Sistema de Usuarios**: Gestión de usuarios y asociación con wallets de Polkadot
- 📝 **Inscripciones**: Sistema completo de inscripciones y seguimiento de progreso
- 🎓 **Certificados NFT**: Emisión automática de certificados NFT al completar cursos
- 💰 **Sistema de Pagos**: Verificación de pagos en blockchain con DOT
- 🔍 **Balance y Cuentas**: Consulta de balances y información de cuentas en Polkadot
- 🌐 **API REST**: API RESTful completa y documentada
- ⚡ **Despliegue en Render**: Configurado y listo para producción

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm/yarn
- Cuenta de Polkadot (puedes crear una con un mnemonic)
- Para testnet: Tokens del faucet (gratuitos)
- Para producción: Fondos reales en DOT

### Instalación

1. **Clonar el repositorio:**
```bash
git clone <tu-repositorio>
cd PolkaEdu
```

2. **Instalar dependencias:**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Polkadot Configuration
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
POLKADOT_ACCOUNT_TYPE=sr25519

# NFT Admin Account (cuenta que crea y gestiona los NFTs)
NFT_ADMIN_MNEMONIC=tu_mnemonic_de_12_palabras_aqui
NFT_COLLECTION_ID=1

# JWT
JWT_SECRET=tu_secret_jwt_seguro_aqui

# IPFS (Opcional - para metadata de NFTs)
PINATA_KEY=tu_pinata_key
PINATA_SECRET=tu_pinata_secret
```

4. **Iniciar servidor en desarrollo:**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Estructura del Proyecto

```
PolkaEdu/
├── src/
│   ├── config/          # Configuración (Polkadot, etc.)
│   ├── controllers/     # Controladores de la API
│   ├── routes/          # Rutas de Express
│   ├── services/        # Lógica de negocio
│   ├── storage/         # Almacenamiento en memoria
│   └── utils/           # Utilidades
├── scripts/             # Scripts de utilidad
├── public/              # Archivos estáticos
├── render.yaml          # Configuración de Render
├── Dockerfile           # Configuración de Docker
└── package.json
```

## 🔌 API Endpoints

### Información General

- `GET /` - Información del servicio
- `GET /health` - Health check
- `GET /api` - Lista completa de todos los endpoints disponibles

### Cursos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/courses` | Obtener todos los cursos |
| `GET` | `/api/courses/:id` | Obtener un curso por ID |
| `GET` | `/api/courses/:id/lessons` | Obtener lecciones de un curso |
| `POST` | `/api/courses` | Crear un nuevo curso |
| `PUT` | `/api/courses/:id` | Actualizar un curso |
| `DELETE` | `/api/courses/:id` | Eliminar un curso |

### Inscripciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/enrollments` | Inscribir usuario en curso |
| `POST` | `/api/enrollments/wallet` | Inscribir usando wallet address |
| `GET` | `/api/enrollments/user/:userId` | Obtener inscripciones de un usuario |
| `GET` | `/api/enrollments/wallet/:walletAddress` | Obtener inscripciones por wallet |
| `GET` | `/api/enrollments/:id` | Obtener inscripción por ID |
| `PUT` | `/api/enrollments/:id/progress` | Actualizar progreso (0-100) |
| `POST` | `/api/enrollments/:id/complete` | Completar curso y emitir NFT |

### Certificados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/certificates` | Obtener todos los certificados |
| `GET` | `/api/certificates/user/:userId` | Certificados de un usuario |
| `GET` | `/api/certificates/wallet/:walletAddress` | Certificados por wallet |
| `GET` | `/api/certificates/:id` | Obtener certificado por ID |

### NFTs

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/nfts` | Crear un NFT |
| `POST` | `/api/nfts/validate-address` | Validar dirección de Polkadot |
| `GET` | `/api/nfts/user/:address` | Obtener NFTs de un usuario |
| `GET` | `/api/nfts/:collectionId/:tokenId` | Obtener información de un NFT |

### Balance y Cuentas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/balance/me` | Saldo de la cuenta configurada |
| `GET` | `/api/balance/:address` | Saldo de una dirección |
| `GET` | `/api/balance/:address/info` | Información detallada de cuenta |

### Pagos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/payments/verify` | Verificar un pago en blockchain |
| `GET` | `/api/payments/balance/:address` | Balance de una dirección |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/users` | Obtener todos los usuarios |
| `GET` | `/api/users/:id` | Obtener usuario por ID |
| `POST` | `/api/users` | Crear nuevo usuario |
| `POST` | `/api/users/wallet` | Asociar wallet a usuario |
| `PUT` | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

## 🎓 Flujo de Certificados NFT

1. **Inscripción**: El usuario se inscribe en un curso (con o sin wallet)
2. **Progreso**: El usuario completa lecciones y el progreso se actualiza
3. **Completar Curso**: Cuando el progreso llega al 100%, se puede completar el curso
4. **Emisión NFT**: Al completar, se crea automáticamente:
   - Un NFT en la blockchain de Polkadot
   - Un certificado con metadata (nombre del curso, estudiante, fecha, etc.)
   - El NFT se envía directamente a la billetera del estudiante

### Testnet vs Mainnet

**Testnet (Paseo/Westend):**
- ✅ Transacciones sin costo real
- ✅ Tokens gratuitos del faucet
- ✅ Perfecto para desarrollo y pruebas

**Mainnet:**
- ⚠️ Requiere fondos reales en DOT
- ⚠️ Fees de transacción reales
- ✅ Certificados verificables en producción

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor en modo desarrollo

# Build
npm run build            # Compilar TypeScript
npm start                # Iniciar servidor en producción

# Testing
npm run test:polkadot    # Probar conexión con Polkadot
npm run test:flow        # Probar flujo completo
npm run test:api         # Probar endpoints de la API

# Utilidades
npm run balance          # Verificar balance de la cuenta
npm run nft:create       # Crear NFT manualmente
```

## 🚀 Despliegue en Render

Este proyecto está configurado para desplegarse fácilmente en [Render](https://render.com).

### Configuración Automática

El archivo `render.yaml` ya está configurado con:
- Build command: `yarn install && yarn build`
- Start command: `yarn start`
- Health check: `/health`
- Puerto: `10000`

### Variables de Entorno en Render

Configura estas variables en el dashboard de Render:

**Requeridas:**
- `NODE_ENV=production`
- `PORT=10000`
- `POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network`
- `NFT_ADMIN_MNEMONIC=tu_mnemonic_de_12_palabras`
- `NFT_COLLECTION_ID=1`
- `JWT_SECRET=tu_secret_jwt_seguro`
- `POLKADOT_ACCOUNT_TYPE=sr25519`

**Opcionales:**
- `PINATA_KEY=tu_pinata_key`
- `PINATA_SECRET=tu_pinata_secret`

### Pasos para Desplegar

1. Conecta tu repositorio de GitHub a Render
2. Render detectará automáticamente el `render.yaml`
3. Configura las variables de entorno en el dashboard
4. ¡Despliega!

## 📝 Notas Importantes

### Almacenamiento

Este proyecto usa **almacenamiento en memoria**. Los datos se pierden al reiniciar el servidor. Para producción, considera usar una base de datos (PostgreSQL, MongoDB, etc.).

### Pallet de NFTs

El código usa `pallet-uniques` de Polkadot. Asegúrate de conectarte a una red que soporte este pallet:
- **Paseo Testnet**: `wss://asset-hub-paseo.dotters.network`
- **Statemint**: `wss://statemint-rpc.polkadot.io`
- **Statemine**: `wss://statemine-rpc.polkadot.io`

### IPFS para Metadata

Actualmente el servicio de NFT tiene soporte para subir metadata a IPFS usando Pinata. Para usar esta funcionalidad:
1. Crea una cuenta en [Pinata](https://pinata.cloud)
2. Obtén tu API Key y Secret
3. Configúralas en las variables de entorno

## 🔗 Recursos

- [Polkadot.js Documentation](https://polkadot.js.org/docs/)
- [Polkadot.js API](https://github.com/polkadot-js/api)
- [Substrate Documentation](https://docs.substrate.io/)
- [Polkadot.js Apps](https://polkadot.js.org/apps) - Interfaz para interactuar con Polkadot
- [Render Documentation](https://render.com/docs)

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando Polkadot y TypeScript**
