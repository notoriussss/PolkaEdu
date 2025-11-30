# 🎓 PolkaEdu

Plataforma educativa completa con certificados NFT en Polkadot. Sistema de cursos tipo Platzi con emisión automática de certificados NFT verificables en blockchain.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![Polkadot](https://img.shields.io/badge/Polkadot-16.5-purple.svg)](https://polkadot.network/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📁 Estructura del Proyecto

```
PolkaEdu/
├── backend/          # API REST con Express y TypeScript
│   ├── src/         # Código fuente del backend
│   ├── scripts/     # Scripts de utilidad
│   └── README.md    # Documentación del backend
│
└── frontend/        # Frontend con Next.js y React
    ├── src/        # Código fuente del frontend
    ├── public/     # Archivos estáticos
    └── README.md   # Documentación del frontend
```

## ✨ Características

- 📚 **Gestión de Cursos**: Crear, actualizar y gestionar cursos con lecciones
- 👥 **Sistema de Usuarios**: Gestión de usuarios y asociación con wallets de Polkadot
- 📝 **Inscripciones**: Sistema completo de inscripciones y seguimiento de progreso
- 🎓 **Certificados NFT**: Emisión automática de certificados NFT al completar cursos
- 💰 **Sistema de Pagos**: Verificación de pagos en blockchain con DOT
- 🔍 **Balance y Cuentas**: Consulta de balances y información de cuentas en Polkadot
- 🌐 **API REST**: API RESTful completa y documentada
- ⚡ **Despliegue**: Backend en Render, Frontend en Netlify/Vercel

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

2. **Instalar dependencias del backend:**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend:**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno:**

**Backend** - Crear `backend/.env`:
```env
PORT=3000
NODE_ENV=development
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
POLKADOT_ACCOUNT_TYPE=sr25519
NFT_ADMIN_MNEMONIC=tu_mnemonic_de_12_palabras_aqui
NFT_COLLECTION_ID=1
JWT_SECRET=tu_secret_jwt_seguro_aqui
PINATA_KEY=tu_pinata_key
PINATA_SECRET=tu_pinata_secret
```

**Frontend** - Crear `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

El backend estará en `http://localhost:3000` y el frontend en `http://localhost:3001` (o el puerto que Next.js asigne).

## 📚 Documentación

- [Backend README](./backend/README.md) - Documentación completa del backend
- [Frontend README](./frontend/README.md) - Documentación del frontend

## 🔌 API Endpoints

El backend expone una API REST completa. Ver [Backend README](./backend/README.md) para la documentación completa de endpoints.

### Principales Endpoints:

- `GET /health` - Health check
- `GET /api` - Lista de todos los endpoints
- `GET /api/courses` - Obtener todos los cursos
- `POST /api/enrollments` - Inscribir usuario en curso
- `POST /api/enrollments/:id/complete` - Completar curso y emitir NFT
- `GET /api/nfts/user/:address` - Obtener NFTs de un usuario

## 🎓 Flujo de Certificados NFT

1. **Inscripción**: El usuario se inscribe en un curso (con o sin wallet)
2. **Progreso**: El usuario completa lecciones y el progreso se actualiza
3. **Completar Curso**: Cuando el progreso llega al 100%, se puede completar el curso
4. **Emisión NFT**: Al completar, se crea automáticamente:
   - Un NFT en la blockchain de Polkadot
   - Un certificado con metadata (nombre del curso, estudiante, fecha, etc.)
   - El NFT se envía directamente a la billetera del estudiante

## 🛠️ Scripts Disponibles

### Backend
```bash
cd backend
npm run dev              # Desarrollo
npm run build            # Compilar
npm start                # Producción
npm run test:polkadot    # Probar conexión Polkadot
npm run balance          # Verificar balance
```

### Frontend
```bash
cd frontend
npm run dev              # Desarrollo
npm run build            # Compilar
npm start                # Producción
npm run lint             # Linter
```

## 🚀 Despliegue

### Backend (Render)

El backend está configurado para desplegarse en Render. Ver `backend/render.yaml` y [Backend README](./backend/README.md) para más detalles.

### Frontend (Netlify/Vercel)

El frontend está configurado para desplegarse en Netlify o Vercel. Ver `frontend/netlify.toml` para configuración.

## 📝 Notas Importantes

### Almacenamiento

El backend usa **almacenamiento en memoria**. Los datos se pierden al reiniciar el servidor. Para producción, considera usar una base de datos (PostgreSQL, MongoDB, etc.).

### Pallet de NFTs

El código usa `pallet-uniques` de Polkadot. Asegúrate de conectarte a una red que soporte este pallet:
- **Paseo Testnet**: `wss://asset-hub-paseo.dotters.network`
- **Statemint**: `wss://statemint-rpc.polkadot.io`
- **Statemine**: `wss://statemine-rpc.polkadot.io`

## 🔗 Recursos

- [Polkadot.js Documentation](https://polkadot.js.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Substrate Documentation](https://docs.substrate.io/)
- [Polkadot.js Apps](https://polkadot.js.org/apps) - Interfaz para interactuar con Polkadot
- [Render Documentation](https://render.com/docs)

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando Polkadot, Next.js y TypeScript**
