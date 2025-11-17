# Guía para Crear NFTs Reales (Sin Simulación)

## Problema Actual

El pallet `uniques` no está disponible en las relay chains principales (Polkadot/Kusama). Para crear NFTs reales, necesitas conectarte a una parachain que tenga soporte para NFTs.

## Solución: Usar Statemint/Statemine

**Statemint** (Polkadot) y **Statemine** (Kusama) son parachains oficiales que tienen el pallet `uniques` disponible.

### Configuración

1. **Actualiza tu `.env`:**

```env
# Para Polkadot (Statemint)
POLKADOT_WS_URL=wss://statemint-rpc.polkadot.io

# O para Kusama (Statemine) - más barato para pruebas
POLKADOT_WS_URL=wss://statemine-rpc.polkadot.io
```

2. **Endpoints Alternativos si el principal no funciona:**

**Statemint (Polkadot):**
- `wss://statemint-rpc.polkadot.io` (oficial)
- `wss://statemint-rpc.dotters.network` (alternativo)
- `wss://rpc-statemint.polkadot.io` (alternativo)

**Statemine (Kusama):**
- `wss://statemine-rpc.polkadot.io` (oficial)
- `wss://statemine-rpc.dotters.network` (alternativo)
- `wss://rpc-statemine.polkadot.io` (alternativo)

### Requisitos

1. **Fondos en la red**: Necesitas tener tokens (DOT para Statemint, KSM para Statemine) en tu cuenta para pagar las fees de transacción.

2. **Crear una Colección NFT primero**: Antes de crear NFTs individuales, necesitas crear una colección usando `api.tx.uniques.create()`.

### Código Actualizado

El código en `src/services/nft.service.ts` ya está preparado para:
- ✅ Detectar automáticamente si `api.tx.uniques` está disponible
- ✅ Crear NFTs usando el pallet correcto
- ✅ Lanzar error claro si no hay pallet disponible

### Pasos para Probar

1. **Verifica la conexión:**
```bash
npm run test:polkadot
```

2. **Verifica pallets disponibles:**
```bash
npx tsx scripts/check-available-pallets.ts
```

3. **Prueba el flujo completo:**
```bash
npm run test:flow
```

### Solución de Problemas

**Si la conexión se cuelga:**
- Prueba endpoints alternativos
- Verifica tu conexión a internet
- Usa un endpoint de un proveedor diferente (Dotters Network, etc.)

**Si no detecta el pallet:**
- Asegúrate de estar conectado a Statemint/Statemine, no a la relay chain
- Verifica que la versión de `@polkadot/api` sea compatible (16.5.1)

**Si falla la transacción:**
- Verifica que tengas fondos suficientes
- Asegúrate de que la colección NFT exista antes de crear tokens
- Verifica que la dirección del destinatario sea válida para esa red

## Alternativas

Si Statemint/Statemine no funcionan, puedes usar:

1. **RMRK**: Especializada en NFTs 2.0
2. **Unique Network**: Parachain dedicada a NFTs
3. **Tu propia parachain**: Implementa `pallet-nfts` de Substrate

## Nota Importante

El código actual **NO simula** cuando no hay pallet disponible - lanza un error claro. Esto te obliga a configurar correctamente la red antes de crear NFTs reales.

