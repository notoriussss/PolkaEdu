# 🚀 Guía: Cómo Ejecutar y Crear un NFT

## Paso 1: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto si no existe:

```env
PORT=3000

# URL de conexión a Polkadot (testnet recomendado)
POLKADOT_WS_URL=wss://rpc.paseo.polkadot.io

# Tu mnemonic de 12 palabras (NUNCA compartas esto)
POLKADOT_ACCOUNT_MNEMONIC=tu mnemonic de 12 palabras aquí

# ID de la colección NFT (se obtiene al crear la colección)
NFT_COLLECTION_ID=1

# Secret para JWT
JWT_SECRET=tu_secret_jwt_aqui

# Opcional: Pinata para subir metadata a IPFS
PINATA_KEY=tu_pinata_key
PINATA_SECRET=tu_pinata_secret
```

## Paso 2: Instalar Dependencias (si no lo has hecho)

```bash
npm install
```

## Paso 3: Verificar Configuración

### Verificar conexión a Polkadot:
```bash
npm run test:polkadot
```

### Verificar balance de tu cuenta:
```bash
npm run balance
```

## Paso 4: Crear la Colección NFT (Solo la Primera Vez)

Antes de crear NFTs, necesitas crear una colección:

```bash
npx tsx scripts/create-nft-collection.ts
```

**IMPORTANTE**: Guarda el Collection ID que te muestre y actualiza tu `.env`:
```env
NFT_COLLECTION_ID=123  # Reemplaza con el ID que obtuviste
```

## Paso 5: Iniciar el Servidor

```bash
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
🖼️  API de NFTs disponible en http://localhost:3000/api/nfts
```

## Paso 6: Crear un NFT

Tienes varias opciones:

### Opción A: Usando el Script de Ejemplo (Más Fácil)

1. Edita `examples/crear-nft-ejemplo.js` y cambia la dirección del destinatario
2. Ejecuta:
```bash
node examples/crear-nft-ejemplo.js
```

### Opción B: Usando cURL (Terminal)

```bash
curl -X POST http://localhost:3000/api/nfts \
  -H "Content-Type: application/json" \
  -d "{
    \"recipientAddress\": \"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY\",
    \"metadata\": {
      \"name\": \"Certificado de Curso de Polkadot\",
      \"description\": \"Certificado por completar el curso\",
      \"courseId\": \"curso-123\",
      \"courseTitle\": \"Introducción a Polkadot\",
      \"studentName\": \"Juan Pérez\",
      \"issuedAt\": \"2024-01-15T10:30:00Z\",
      \"attributes\": [
        {
          \"trait_type\": \"Nivel\",
          \"value\": \"Principiante\"
        }
      ]
    }
  }"
```

### Opción C: Usando JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/api/nfts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    recipientAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    metadata: {
      name: 'Certificado de Curso de Polkadot',
      description: 'Certificado por completar el curso',
      courseId: 'curso-123',
      courseTitle: 'Introducción a Polkadot',
      studentName: 'Juan Pérez',
      issuedAt: new Date().toISOString(),
      attributes: [
        {
          trait_type: 'Nivel',
          value: 'Principiante'
        }
      ]
    }
  })
});

const result = await response.json();
console.log(result);
```

### Opción D: Usando Postman o Insomnia

1. **Método**: `POST`
2. **URL**: `http://localhost:3000/api/nfts`
3. **Headers**: 
   ```
   Content-Type: application/json
   ```
4. **Body** (JSON):
```json
{
  "recipientAddress": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "metadata": {
    "name": "Certificado de Curso de Polkadot",
    "description": "Certificado por completar el curso",
    "courseId": "curso-123",
    "courseTitle": "Introducción a Polkadot",
    "studentName": "Juan Pérez",
    "issuedAt": "2024-01-15T10:30:00Z",
    "attributes": [
      {
        "trait_type": "Nivel",
        "value": "Principiante"
      }
    ]
  }
}
```

## Paso 7: Verificar que el NFT se Creó

### Ver información del NFT:
```bash
curl http://localhost:3000/api/nfts/1/1705321800000
```
(Reemplaza `1` con tu collectionId y `1705321800000` con el tokenId que recibiste)

### Ver NFTs de una cuenta:
```bash
curl http://localhost:3000/api/nfts/user/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

## Respuesta Exitosa

Si todo sale bien, recibirás:

```json
{
  "success": true,
  "message": "NFT creado exitosamente",
  "data": {
    "tokenId": "1705321800000",
    "transactionHash": "0x1234abcd5678efgh...",
    "recipientAddress": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "collectionId": "1"
  }
}
```

## Errores Comunes

### ❌ "No hay cuenta configurada"
**Solución**: Verifica que `POLKADOT_ACCOUNT_MNEMONIC` esté en tu `.env`

### ❌ "Dirección de Polkadot inválida"
**Solución**: Valida la dirección con:
```bash
curl -X POST http://localhost:3000/api/nfts/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address": "tu_direccion_aqui"}'
```

### ❌ "ExtrinsicFailed" o "Fondos insuficientes"
**Solución**: 
- Verifica tu balance: `npm run balance`
- Si estás en testnet, obtén tokens del faucet

### ❌ "Collection not found"
**Solución**: Crea la colección primero:
```bash
npx tsx scripts/create-nft-collection.ts
```

## 📚 Endpoints Disponibles

- `POST /api/nfts` - Crear NFT y asociarlo a una cuenta
- `POST /api/nfts/validate-address` - Validar dirección de Polkadot
- `GET /api/nfts/:collectionId/:tokenId` - Obtener información de un NFT
- `GET /api/nfts/user/:address` - Obtener todos los NFTs de una cuenta

## 🎯 Resumen Rápido

```bash
# 1. Configurar .env
# 2. Instalar dependencias
npm install

# 3. Verificar conexión
npm run test:polkadot

# 4. Crear colección (solo primera vez)
npx tsx scripts/create-nft-collection.ts

# 5. Iniciar servidor
npm run dev

# 6. Crear NFT (en otra terminal o con Postman)
node examples/crear-nft-ejemplo.js
```

¡Listo! 🎉

