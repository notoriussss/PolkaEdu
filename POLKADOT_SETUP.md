# Configuración para NFTs en Polkadot

## Statemint - Parachain Oficial de Polkadot

**Statemint** es la parachain oficial de Polkadot para assets y NFTs. Es parte del ecosistema Polkadot y usa DOT como token nativo.

## Configuración Actual

Tu `.env` está configurado para:
```env
POLKADOT_WS_URL=wss://statemint-rpc.polkadot.io
```

## Pasos para Crear NFTs Reales en Polkadot

### 1. Verificar Conexión

```bash
npm run test:polkadot
```

Deberías ver: `✅ Conectado a: Statemint` o similar

### 2. Verificar que el Pallet está Disponible

```bash
npx tsx scripts/check-available-pallets.ts
```

Deberías ver: `✅ api.tx.uniques está disponible`

### 3. Crear una Colección NFT (Primera vez)

Antes de crear NFTs individuales, necesitas crear una colección:

```bash
npx tsx scripts/create-nft-collection.ts
```

Esto:
- Crea una colección NFT en Statemint
- Te da un `COLLECTION_ID` que debes guardar
- Actualiza tu `.env` con `NFT_COLLECTION_ID=<id>`

**IMPORTANTE**: Necesitas tener DOT en tu cuenta para pagar las fees de transacción.

### 4. Crear NFTs de Certificados

Una vez que tengas la colección creada, el sistema creará NFTs automáticamente cuando un estudiante complete un curso:

```bash
npm run test:flow
```

O usa la API:
```bash
POST /api/enrollments/:id/complete
```

## Endpoints Alternativos de Statemint

Si el endpoint principal no funciona, prueba:

```env
# Opción 1 (oficial)
POLKADOT_WS_URL=wss://statemint-rpc.polkadot.io

# Opción 2 (Dotters Network)
POLKADOT_WS_URL=wss://statemint-rpc.dotters.network

# Opción 3 (alternativo)
POLKADOT_WS_URL=wss://rpc-statemint.polkadot.io
```

## Requisitos

1. ✅ Cuenta de Polkadot con mnemonic configurado
2. ✅ Fondos en DOT (para pagar fees de transacción)
3. ✅ Conexión a Statemint configurada
4. ✅ Colección NFT creada

## Verificar NFTs Creados

Puedes verificar tus NFTs en:
- [Polkadot.js Apps](https://polkadot.js.org/apps) - Conecta a Statemint
- Busca tu dirección en "Accounts" > "Uniques"

## Costos Aproximados

- Crear colección: ~0.1-0.5 DOT
- Crear NFT: ~0.01-0.05 DOT por NFT
- Actualizar metadata: ~0.01-0.02 DOT

*Los costos pueden variar según el tráfico de la red*

## Solución de Problemas

**Error: "No se encontró pallet de NFTs"**
- Verifica que estés conectado a Statemint, no a la relay chain
- Prueba un endpoint alternativo

**Error: "Insufficient balance"**
- Necesitas más DOT en tu cuenta
- Transfiere DOT a tu cuenta desde un exchange o wallet

**Error: "Collection does not exist"**
- Crea la colección primero con `create-nft-collection.ts`
- Verifica que `NFT_COLLECTION_ID` en `.env` sea correcto

**Conexión se cuelga**
- El código ahora tiene timeouts (30 segundos)
- Si se cuelga, prueba un endpoint alternativo
- Verifica tu conexión a internet

