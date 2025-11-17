# 📚 Diferencia entre Colección y NFT

## Conceptos Básicos

### 🗂️ **Colección (Collection)**
- Es un **contenedor** que agrupa múltiples NFTs
- Se crea **una sola vez**
- Tiene un **Collection ID** único (ej: `3239253486`)
- El admin de la colección puede crear **múltiples NFTs** dentro de ella
- Es como una "galería" o "serie" de NFTs

### 🖼️ **NFT (Token)**
- Es un **elemento individual** dentro de una colección
- Cada NFT tiene un **Token ID** único dentro de la colección
- Puedes crear **tantos NFTs como quieras** en la misma colección
- Cada NFT puede tener metadata diferente
- Cada NFT puede ser transferido independientemente

## Ejemplo Práctico

```
Colección: "Certificados de PolkaEdu" (ID: 3239253486)
├── NFT #1: Certificado de Juan Pérez (Token ID: 1001)
├── NFT #2: Certificado de María García (Token ID: 1002)
├── NFT #3: Certificado de Pedro López (Token ID: 1003)
└── ... (puedes crear infinitos NFTs)
```

## ¿Puedo crear múltiples NFTs en la misma colección?

### ✅ **SÍ, absolutamente**

Puedes crear tantos NFTs como quieras en la misma colección. Solo necesitas:

1. **Usar el mismo Collection ID** (definido en tu `.env`)
2. **Usar diferentes Token IDs** (se generan automáticamente)

### Ejemplo: Crear 3 NFTs en la misma colección

```javascript
// NFT 1
await fetch('http://localhost:3000/api/nfts', {
  method: 'POST',
  body: JSON.stringify({
    recipientAddress: '13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9',
    metadata: {
      name: 'Certificado de Juan',
      description: 'Curso completado',
      // ...
    }
  })
});
// Resultado: Token ID: 1734567890123

// NFT 2 (misma colección, diferente tokenId)
await fetch('http://localhost:3000/api/nfts', {
  method: 'POST',
  body: JSON.stringify({
    recipientAddress: '13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9',
    metadata: {
      name: 'Certificado de María',
      description: 'Curso completado',
      // ...
    }
  })
});
// Resultado: Token ID: 1734567890456 (diferente)

// NFT 3 (misma colección, otro tokenId)
await fetch('http://localhost:3000/api/nfts', {
  method: 'POST',
  body: JSON.stringify({
    recipientAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    metadata: {
      name: 'Certificado de Pedro',
      description: 'Curso completado',
      // ...
    }
  })
});
// Resultado: Token ID: 1734567890789 (diferente)
```

**Todos estos NFTs estarán en la misma colección (3239253486) pero con diferentes Token IDs.**

## ¿Cómo funciona el Token ID?

El sistema genera automáticamente un Token ID único cada vez que creas un NFT:

- Si defines `NFT_TOKEN_ID` en tu `.env`, usará ese (pero solo una vez)
- Si no lo defines, genera uno automáticamente basado en timestamp + random

**Recomendación**: No definas `NFT_TOKEN_ID` en tu `.env` para que se generen automáticamente.

## Transferir NFTs

### ❌ **NO se transfiere la colección**
- La colección permanece en tu cuenta (eres el admin)
- Solo se transfieren los **NFTs individuales**

### ✅ **SÍ se transfieren los NFTs**
- Cada NFT puede ser transferido a diferentes cuentas
- La colección sigue siendo tuya (eres el admin)
- Puedes seguir creando más NFTs en la misma colección

## Ejemplo de Transferencias

```
Colección: 3239253486 (Admin: Tu cuenta)

NFT #1001 → Transferido a cuenta A
NFT #1002 → Transferido a cuenta B  
NFT #1003 → Sigue en tu cuenta
NFT #1004 → Puedes crear más...
```

## Resumen

| Concepto | ¿Cuántas veces? | ¿Se transfiere? |
|----------|----------------|-----------------|
| **Colección** | Se crea **una vez** | ❌ No (permanece en tu cuenta) |
| **NFT** | Puedes crear **infinitos** | ✅ Sí (cada NFT se transfiere individualmente) |

## Ventajas de usar una sola colección

✅ **Organización**: Todos tus certificados en un solo lugar
✅ **Eficiencia**: No necesitas crear múltiples colecciones
✅ **Gestión**: Más fácil de administrar
✅ **Costos**: Crear una colección tiene un costo, crear NFTs es más barato

## ¿Cuándo crear una nueva colección?

Solo necesitas crear una nueva colección si:
- Quieres separar diferentes tipos de NFTs (ej: certificados vs. diplomas)
- Quieres diferentes permisos o configuraciones
- La colección actual está llena (muy raro, límite es 4,294,967,295 NFTs)

---

**En resumen**: Una colección = un contenedor. Puedes crear tantos NFTs como quieras dentro de ella. 🎉

