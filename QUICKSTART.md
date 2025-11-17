# 🚀 Guía Rápida de Inicio

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Configurar Polkadot

1. Para desarrollo, puedes usar la testnet de Polkadot (Westend):

```env
POLKADOT_WS_URL=wss://westend-rpc.polkadot.io
```

2. Obtén un mnemonic de una cuenta de prueba (puedes usar Polkadot.js Apps para crear una):

```env
POLKADOT_ACCOUNT_MNEMONIC="tu mnemonic phrase aquí"
```

⚠️ **IMPORTANTE**: Nunca uses una cuenta con fondos reales en desarrollo. Usa solo cuentas de prueba.

## Paso 3: Probar la Conexión

```bash
npx tsx scripts/test-polkadot-connection.ts
```

Deberías ver información sobre la cadena conectada.

## Paso 4: Iniciar el Servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Próximos Pasos

1. **Crear un curso** usando la API (ver `examples/api-usage.md`)
2. **Inscribir usuarios** en cursos
3. **Completar cursos** para generar certificados NFT automáticamente

## ⚠️ Notas Importantes

### Almacenamiento en Memoria

Este proyecto usa almacenamiento en memoria. Los datos se pierden al reiniciar el servidor. Esto es ideal para desarrollo y pruebas, pero para producción deberías considerar usar una base de datos.

## ⚠️ Notas Importantes

### Sobre el Pallet de NFTs

El código actual usa `pallet-uniques` como ejemplo. Dependiendo de tu red:

- **Polkadot/Kusama**: Usa `pallet-uniques` ✅
- **Westend Testnet**: Usa `pallet-uniques` ✅
- **Parachains personalizadas**: Puede variar

Si tu red no tiene `pallet-uniques`, necesitarás ajustar `src/services/nft.service.ts` para usar el pallet correcto.

### Crear una Colección NFT

Antes de emitir certificados, necesitas crear una colección NFT en la blockchain. Puedes hacerlo:

1. Usando Polkadot.js Apps UI
2. O agregando un endpoint en el backend para crear la colección

### IPFS para Metadata

Actualmente el metadata se sube a un placeholder. Para producción, implementa:

- **Pinata**: Servicio popular para IPFS
- **Infura IPFS**: Alternativa gratuita
- **Tu propio nodo IPFS**: Para máximo control

## 🔗 Recursos Útiles

- [Polkadot.js Apps](https://polkadot.js.org/apps/) - Interfaz para interactuar con Polkadot
- [Polkadot.js Docs](https://polkadot.js.org/docs/) - Documentación completa
- [Substrate Docs](https://docs.substrate.io/) - Documentación de Substrate
- [Westend Faucet](https://matrix.to/#/#westend_faucet:matrix.org) - Obtener DOTs de prueba

