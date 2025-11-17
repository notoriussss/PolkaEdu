# Polkadot Courses Backend

Backend para una aplicación de cursos tipo Platzi con certificados NFT en Polkadot.

## 🚀 Características

- ✅ Gestión de cursos y lecciones
- ✅ Sistema de inscripciones y progreso
- ✅ Emisión automática de certificados NFT al completar cursos
- ✅ Integración con Polkadot usando `@polkadot/api`
- ✅ API REST completa
- ✅ Almacenamiento en memoria (sin base de datos)

## 📋 Prerrequisitos

- Node.js 18+ y npm
- Cuenta de Polkadot (puedes crear una con un mnemonic)
- Para testnet: Obtener tokens del faucet (ver [PASEO_SETUP.md](./PASEO_SETUP.md))
- Para producción: Fondos reales en DOT

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
# Para testnet (Paseo - testnet de Polkadot, transacciones sin costo)
POLKADOT_WS_URL=wss://rpc.paseo.polkadot.io
# Alternativa: Westend testnet
# POLKADOT_WS_URL=wss://westend-rpc.polkadot.io
POLKADOT_ACCOUNT_MNEMONIC=tu_mnemonic_de_12_palabras_aqui
JWT_SECRET=tu_secret_jwt
NFT_COLLECTION_ID=1
```

**📖 Para configuración detallada de Paseo testnet, ver [PASEO_SETUP.md](./PASEO_SETUP.md)**

3. **Iniciar servidor en desarrollo:**

```bash
npm run dev
```

**Nota:** Este proyecto usa almacenamiento en memoria. Los datos se pierden al reiniciar el servidor. Para producción, considera usar una base de datos.

## 📚 Estructura del Proyecto

```
src/
├── config/
│   └── polkadot.ts          # Configuración de conexión con Polkadot
├── storage/
│   └── memory-storage.ts    # Almacenamiento en memoria
├── services/
│   ├── nft.service.ts       # Servicio para crear y gestionar NFTs
│   ├── course.service.ts    # Lógica de negocio de cursos
│   ├── enrollment.service.ts # Lógica de inscripciones y certificados
│   └── user.service.ts      # Lógica de usuarios
├── controllers/
│   ├── course.controller.ts
│   ├── enrollment.controller.ts
│   └── user.controller.ts
├── routes/
│   ├── course.routes.ts
│   ├── enrollment.routes.ts
│   └── user.routes.ts
└── index.ts                 # Punto de entrada del servidor
```

## 🔌 API Endpoints

### Cursos

- `GET /api/courses` - Obtener todos los cursos
- `GET /api/courses/:id` - Obtener un curso por ID
- `POST /api/courses` - Crear un nuevo curso
- `PUT /api/courses/:id` - Actualizar un curso
- `DELETE /api/courses/:id` - Eliminar un curso

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear un nuevo usuario
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

### Inscripciones

- `POST /api/enrollments` - Inscribir usuario en curso
- `GET /api/enrollments/user/:userId` - Obtener inscripciones de un usuario
- `GET /api/enrollments/:id` - Obtener inscripción por ID
- `PUT /api/enrollments/:id/progress` - Actualizar progreso
- `POST /api/enrollments/:id/complete` - Completar curso y emitir certificado NFT

### Balance

- `GET /api/balance/me` - Obtener saldo de DOT de tu cuenta configurada
- `GET /api/balance/:address` - Obtener saldo de una dirección específica
- `GET /api/balance/:address/info` - Obtener información detallada de una cuenta

## 🎓 Flujo de Certificados NFT

1. Usuario se inscribe en un curso (con dirección de wallet configurada)
2. Usuario completa las lecciones (progreso se actualiza)
3. Cuando el progreso llega al 100%, se crea automáticamente:
   - Un NFT en la blockchain de Polkadot (testnet o mainnet)
   - Un registro en la base de datos con el hash de la transacción
   - Metadata del certificado (nombre del curso, estudiante, fecha, etc.)
   - El NFT se envía directamente a la billetera del estudiante

**En testnet (Paseo/Westend):**
- ✅ Transacciones sin costo real
- ✅ Tokens gratuitos del faucet
- ✅ Perfecto para desarrollo y pruebas

## ⚠️ Notas Importantes

### Sobre el Pallet de NFTs

El código actual usa `pallet-uniques` como ejemplo. Dependiendo de tu parachain o red, necesitarás ajustar:

- **Polkadot/Kusama**: Usa `pallet-uniques`
- **Substrate personalizado**: Puede usar `pallet-nfts` o un pallet custom
- **Parachains**: Cada una puede tener su propia implementación

Ajusta `src/services/nft.service.ts` según tu caso específico.

### IPFS para Metadata

Actualmente el servicio de NFT tiene un placeholder para subir metadata a IPFS. Deberás implementar:

- Integración con Pinata, Infura IPFS, o tu propio nodo IPFS
- Subida de imágenes del certificado
- Generación de metadata JSON estándar

### Desarrollo y Testing

Para desarrollo, usa una **testnet** donde las transacciones no tienen costo:

- **Paseo testnet** (recomendado): `wss://rpc.paseo.polkadot.io`
  - Testnet oficial de Polkadot
  - Transacciones prácticamente gratuitas
  - Obtén tokens del faucet
  
- **Westend testnet** (alternativa): `wss://westend-rpc.polkadot.io`
  - Otra testnet de Polkadot
  - Faucet disponible en Polkadot.js Apps

- **Local node**: `ws://127.0.0.1:9944` (si corres un nodo local de Substrate)

**📖 Guía completa de configuración: [PASEO_SETUP.md](./PASEO_SETUP.md)**

## 🔗 Recursos

- [Polkadot.js Documentation](https://polkadot.js.org/docs/)
- [Polkadot.js API](https://github.com/polkadot-js/api)
- [Substrate Documentation](https://docs.substrate.io/)

## 🚀 Inicio Rápido con Paseo Testnet

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar `.env`** (ver ejemplo arriba)

3. **Obtener tokens del faucet:**
   - Ve a [Polkadot.js Apps](https://polkadot.js.org/apps)
   - Conecta a Paseo o Westend
   - Solicita tokens del faucet

4. **Crear colección NFT:**
   ```bash
   npx tsx scripts/create-nft-collection.ts
   ```

5. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

**📖 Para más detalles, ver [PASEO_SETUP.md](./PASEO_SETUP.md)**

## 📝 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Integración real con IPFS para metadata
- [ ] Sistema de pagos con DOT
- [ ] Frontend React/Next.js
- [ ] Tests unitarios e integración
- [ ] Documentación de API con Swagger

## 📄 Licencia

MIT

