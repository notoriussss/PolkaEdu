# Cambios en Variables de Entorno (.env)

## Resumen de Cambios

El sistema ahora usa una **colección NFT única compartida** administrada por una cuenta admin fija. Los usuarios ya **NO necesitan** tener su mnemonic en el `.env` - se conectan directamente desde sus wallets en la UI.

## Variables Requeridas

### Variables Nuevas/Modificadas

```env
# Cuenta admin que administra la colección NFT compartida
# Esta es la cuenta que crea y gestiona todos los NFTs de certificados
NFT_ADMIN_MNEMONIC=gap onion furnace despair retire tip jeans code mother girl moon element

# Dirección de la cuenta admin (para referencia)
NFT_ADMIN_ADDRESS=13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9

# ID de la colección NFT compartida (se crea automáticamente si no existe)
NFT_COLLECTION_ID=1

# URL de conexión a Polkadot (Paseo testnet)
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
# Alternativa: wss://rpc.ibp.network/paseo

# Tipo de cuenta (sr25519 es el predeterminado)
POLKADOT_ACCOUNT_TYPE=sr25519

# Pinata para subir metadata de NFTs a IPFS
PINATA_KEY=tu_pinata_api_key
PINATA_SECRET=tu_pinata_secret_key

# Puerto del servidor
PORT=3000
```

## Variables Eliminadas/Deprecadas

### ❌ Ya NO se necesita:
```env
# POLKADOT_ACCOUNT_MNEMONIC - Ya no se usa para usuarios
# Los usuarios se conectan desde la UI con sus wallets
```

## Ejemplo de .env Completo

```env
# ============================================
# Configuración de Polkadot
# ============================================
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
POLKADOT_ACCOUNT_TYPE=sr25519

# ============================================
# Cuenta Admin para NFTs
# ============================================
# Esta cuenta administra la colección NFT compartida
# Todos los certificados NFT son creados por esta cuenta
NFT_ADMIN_MNEMONIC=gap onion furnace despair retire tip jeans code mother girl moon element
NFT_ADMIN_ADDRESS=13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9

# ============================================
# Configuración de NFTs
# ============================================
# ID de la colección NFT compartida
# Se crea automáticamente si no existe
NFT_COLLECTION_ID=1

# ============================================
# Pinata (IPFS)
# ============================================
# Obtén tus credenciales en https://pinata.cloud
PINATA_KEY=tu_pinata_api_key_aqui
PINATA_SECRET=tu_pinata_secret_key_aqui

# ============================================
# Servidor
# ============================================
PORT=3000
```

## Notas Importantes

1. **NFT_ADMIN_MNEMONIC**: Esta es la cuenta que administra TODOS los NFTs. Debe tener fondos suficientes para crear la colección y emitir certificados.

2. **NFT_COLLECTION_ID**: Si no existe una colección con este ID, el sistema creará una automáticamente. Si ya existe pero no eres admin, creará una nueva.

3. **Usuarios**: Los usuarios ya NO necesitan tener su mnemonic en el `.env`. Se conectan directamente desde la UI usando Polkadot.js o SubWallet.

4. **Seguridad**: 
   - El mnemonic del admin debe mantenerse seguro
   - Los usuarios solo necesitan su wallet para conectarse
   - Los pagos se realizan directamente desde la wallet del usuario

## Verificación

Para verificar que todo está configurado correctamente:

1. Inicia el servidor: `npm run dev`
2. Deberías ver: `✅ Cuenta admin cargada: 13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9`
3. Abre la UI en: `http://localhost:3000`
4. Conecta tu wallet desde la UI

## Migración desde Versión Anterior

Si tenías un `.env` anterior con `POLKADOT_ACCOUNT_MNEMONIC`:

1. **Renombra** `POLKADOT_ACCOUNT_MNEMONIC` a `NFT_ADMIN_MNEMONIC`
2. O usa el mnemonic del admin proporcionado: `gap onion furnace despair retire tip jeans code mother girl moon element`
3. Asegúrate de que la cuenta admin tenga fondos suficientes
4. Los usuarios ya no necesitan configurar su mnemonic

