# 🔍 Cómo Verificar que Recibiste un NFT

Cuando alguien te transfiere un NFT, puedes verificar que lo recibiste de varias formas:

## Opción 1: Usando la API (Más Fácil) ✅

### Ver todos tus NFTs

```bash
GET http://localhost:3000/api/nfts/user/TU_DIRECCION_AQUI
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/nfts/user/13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "address": "13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9",
    "collectionId": "3239253486",
    "nfts": [
      {
        "collectionId": "3239253486",
        "tokenId": "1734567890123",
        "owner": "13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9",
        "info": {
          "owner": "1KdfwiBDnFpJJyMJyd1yYXrHwVEFELL5yNPaPagM65Gu2BY",
          "approved": null
        }
      }
    ],
    "count": 1
  }
}
```

### Ver un NFT específico

```bash
GET http://localhost:3000/api/nfts/:collectionId/:tokenId
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/nfts/3239253486/1734567890123
```

---

## Opción 2: Usando Polkadot.js Apps (Interfaz Visual) 🌐

### Pasos:

1. **Ve a [Polkadot.js Apps](https://polkadot.js.org/apps)**

2. **Conecta a la red correcta:**
   - Si estás en testnet: Selecciona **Paseo** o **Westend**
   - Si estás en mainnet: Selecciona **Statemint** o **Polkadot**

3. **Conecta tu wallet:**
   - Ve a "Accounts" → "Add account"
   - Importa tu cuenta usando el mnemonic o archivo JSON

4. **Ver tus NFTs:**
   - Ve a la sección **"Uniques"** o **"NFTs"** en el menú lateral
   - Busca tu colección por ID
   - Verás todos los NFTs que posees

5. **Ver detalles de un NFT:**
   - Haz clic en el NFT
   - Verás toda la información: metadata, owner, etc.

---

## Opción 3: Usando JavaScript/TypeScript 💻

```javascript
// Ver todos tus NFTs
async function verMisNFTs(miDireccion) {
  const response = await fetch(
    `http://localhost:3000/api/nfts/user/${miDireccion}`
  );
  const data = await response.json();
  
  if (data.success) {
    console.log(`Tienes ${data.data.count} NFTs`);
    data.data.nfts.forEach(nft => {
      console.log(`NFT #${nft.tokenId} en colección ${nft.collectionId}`);
    });
  }
}

// Ver un NFT específico
async function verNFT(collectionId, tokenId) {
  const response = await fetch(
    `http://localhost:3000/api/nfts/${collectionId}/${tokenId}`
  );
  const data = await response.json();
  console.log(data);
}

// Ejemplo de uso
verMisNFTs('13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9');
```

---

## Opción 4: Verificar en la Blockchain Directamente 🔗

### Usando el Transaction Hash

Cuando se crea un NFT, recibes un `transactionHash`. Puedes verificar la transacción:

1. **Ve a [Polkadot.js Apps](https://polkadot.js.org/apps)**
2. **Ve a "Network" → "Explorer"**
3. **Pega el transaction hash** en el buscador
4. **Verás todos los eventos** de la transacción, incluyendo:
   - `uniques.Created` o `uniques.Minted`
   - La dirección del destinatario
   - El token ID

### Ejemplo de Transaction Hash:
```
0x2947feae6b12802a61f7a972eaaff5a217de0e4d2cd7295f44dc5158eee47052
```

---

## ¿Qué información puedo ver?

Cuando verificas un NFT, puedes ver:

- ✅ **Token ID**: El ID único del NFT
- ✅ **Collection ID**: El ID de la colección
- ✅ **Owner**: La dirección que posee el NFT (debería ser tu dirección)
- ✅ **Metadata**: Información del NFT (nombre, descripción, atributos, etc.)
- ✅ **Transaction Hash**: El hash de la transacción que creó/transfirió el NFT
- ✅ **Block Number**: El bloque donde se creó el NFT

---

## Verificar que Eres el Owner

Para verificar que realmente eres el owner:

1. **Usa el endpoint de la API:**
   ```bash
   GET /api/nfts/user/TU_DIRECCION
   ```

2. **Verifica que tu dirección aparece en el campo `owner`** de cada NFT

3. **Compara direcciones usando bytes** (el sistema lo hace automáticamente):
   - Si las direcciones coinciden en bytes, eres el owner
   - No importa si están en diferentes formatos SS58

---

## Ejemplo Completo

```javascript
// 1. Alguien te envía un NFT
const response = await fetch('http://localhost:3000/api/nfts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientAddress: '13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9', // Tu dirección
    metadata: {
      name: 'Mi Certificado',
      description: 'Certificado de curso',
      // ...
    }
  })
});

const result = await response.json();
console.log('NFT creado:', result.data.tokenId);

// 2. Verificar que lo recibiste
const verifyResponse = await fetch(
  `http://localhost:3000/api/nfts/user/13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9`
);
const verifyData = await verifyResponse.json();

console.log('Mis NFTs:', verifyData.data.nfts);
// Deberías ver el NFT que acabas de recibir
```

---

## Troubleshooting

### ❌ "No se encontraron NFTs"

**Posibles causas:**
- El NFT aún no se ha procesado (espera unos segundos)
- Estás usando una dirección incorrecta
- El NFT está en una colección diferente

**Solución:**
- Espera 10-30 segundos y vuelve a intentar
- Verifica que la dirección sea correcta
- Especifica el `collectionId` en la query: `?collectionId=3239253486`

### ❌ "Error al consultar account.entries"

**Posibles causas:**
- Problema de conexión con la blockchain
- El pallet uniques no está disponible en esta red

**Solución:**
- Verifica tu conexión a Polkadot
- Asegúrate de estar conectado a una red que soporte NFTs (Paseo, Statemint, etc.)

---

## 📚 Endpoints Disponibles

- `GET /api/nfts/user/:address` - Ver todos los NFTs de una cuenta
- `GET /api/nfts/:collectionId/:tokenId` - Ver información de un NFT específico
- `POST /api/nfts/validate-address` - Validar una dirección de Polkadot

---

¿Tienes más preguntas? Revisa los logs del servidor para más detalles.

