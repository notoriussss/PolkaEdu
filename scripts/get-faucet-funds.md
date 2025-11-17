# Obtener Fondos del Faucet para Paseo Testnet

Para que las transacciones no tengan costo en la testnet, necesitas obtener tokens gratuitos del faucet.

## Paseo Testnet

Paseo es la testnet oficial de Polkadot. Para obtener fondos:

### Opción 1: Faucet Web (si está disponible)

1. Visita el faucet de Paseo (si existe)
2. Ingresa tu dirección de Polkadot
3. Solicita tokens de prueba

### Opción 2: Usar Polkadot.js Apps

1. Ve a [Polkadot.js Apps](https://polkadot.js.org/apps)
2. Cambia la red a "Paseo" en el selector de red
3. Ve a la sección "Accounts" o "Faucet"
4. Solicita tokens de prueba para tu cuenta

### Opción 3: Usar Westend (Alternativa)

Si Paseo no tiene faucet disponible, puedes usar **Westend** que es otra testnet de Polkadot:

```env
POLKADOT_WS_URL=wss://westend-rpc.polkadot.io
```

Westend tiene un faucet disponible en:
- [Polkadot.js Apps - Westend Faucet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwestend-rpc.polkadot.io#/accounts)

### Verificar Balance

Después de obtener fondos, verifica tu balance:

```bash
npm run balance
```

O usa el script:

```bash
npx tsx scripts/check-balance.ts
```

## Nota Importante

- Los tokens de testnet NO tienen valor real
- Son solo para pruebas y desarrollo
- Las transacciones en testnet tienen fees mínimas (casi gratuitas)
- Necesitas tener al menos algunos tokens para pagar las fees de transacción


