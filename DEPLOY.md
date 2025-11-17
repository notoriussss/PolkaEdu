# 🚀 Guía de Despliegue - PolkaEdu Backend

Esta guía te ayudará a desplegar el backend de PolkaEdu en diferentes plataformas.

## 📋 Variables de Entorno Requeridas

Antes de desplegar, asegúrate de tener estas variables configuradas:

```env
PORT=3000
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
NFT_ADMIN_MNEMONIC=tu_mnemonic_de_12_palabras
NFT_COLLECTION_ID=1
JWT_SECRET=tu_secret_jwt_seguro
PINATA_KEY=tu_pinata_key (opcional)
PINATA_SECRET=tu_pinata_secret (opcional)
```

## 🎯 Opciones de Despliegue Recomendadas

### 1. 🚂 Railway (Recomendado - Más Fácil)

**Ventajas:**
- ✅ Despliegue automático desde GitHub
- ✅ Plan gratuito generoso ($5 crédito/mes)
- ✅ Configuración de variables de entorno fácil
- ✅ Logs en tiempo real
- ✅ HTTPS automático

**Pasos:**

1. **Crear cuenta en Railway:**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu cuenta de GitHub

2. **Crear nuevo proyecto:**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Elige el repositorio `PolkaEdu` y la rama `backend-app`

3. **Configurar variables de entorno:**
   - En el dashboard, ve a "Variables"
   - Agrega todas las variables de entorno necesarias

4. **Configurar build:**
   - Railway detectará automáticamente que es Node.js
   - El archivo `railway.json` ya está configurado

5. **Desplegar:**
   - Railway desplegará automáticamente
   - Obtendrás una URL como: `https://tu-app.railway.app`

**Costo:** Gratis hasta $5/mes, luego $0.000463 por GB de RAM/hora

---

### 2. 🎨 Render

**Ventajas:**
- ✅ Plan gratuito disponible
- ✅ Despliegue automático desde GitHub
- ✅ SSL automático
- ✅ Fácil configuración

**Pasos:**

1. **Crear cuenta en Render:**
   - Ve a [render.com](https://render.com)
   - Conecta tu cuenta de GitHub

2. **Crear nuevo Web Service:**
   - Click en "New +" → "Web Service"
   - Conecta el repositorio `PolkaEdu`
   - Selecciona la rama `backend-app`

3. **Configurar:**
   - **Name:** `polkaedu-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (o Starter para mejor rendimiento)

4. **Variables de entorno:**
   - En "Environment Variables", agrega todas las variables necesarias

5. **Desplegar:**
   - Click en "Create Web Service"
   - Render desplegará automáticamente
   - URL: `https://polkaedu-backend.onrender.com`

**Costo:** Gratis (con limitaciones), Starter desde $7/mes

**Nota:** El plan gratuito puede "dormir" después de 15 minutos de inactividad.

---

### 3. ✈️ Fly.io

**Ventajas:**
- ✅ Muy rápido
- ✅ Plan gratuito generoso
- ✅ Global edge network
- ✅ Excelente para aplicaciones Node.js

**Pasos:**

1. **Instalar Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Inicializar proyecto:**
   ```bash
   fly launch
   ```
   - Sigue las instrucciones interactivas
   - Selecciona región cercana

4. **Configurar variables:**
   ```bash
   fly secrets set POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
   fly secrets set NFT_ADMIN_MNEMONIC=tu_mnemonic
   fly secrets set NFT_COLLECTION_ID=1
   fly secrets set JWT_SECRET=tu_secret
   fly secrets set PORT=3000
   ```

5. **Desplegar:**
   ```bash
   fly deploy
   ```

**Costo:** Gratis hasta 3 VMs compartidas, luego desde $1.94/mes

---

### 4. ☁️ DigitalOcean App Platform

**Ventajas:**
- ✅ Muy confiable
- ✅ Buena documentación
- ✅ Integración con GitHub

**Pasos:**

1. **Crear cuenta en DigitalOcean:**
   - Ve a [digitalocean.com](https://digitalocean.com)

2. **Crear App:**
   - Ve a "Apps" → "Create App"
   - Conecta GitHub y selecciona el repositorio

3. **Configurar:**
   - **Type:** Web Service
   - **Build Command:** `npm install && npm run build`
   - **Run Command:** `npm start`
   - **Environment Variables:** Agrega todas las variables

4. **Desplegar:**
   - Click en "Create Resources"
   - DigitalOcean desplegará automáticamente

**Costo:** Desde $5/mes (Basic plan)

---

### 5. 🐳 Docker + VPS (Más Control)

Si prefieres más control, puedes usar Docker en un VPS (DigitalOcean, Linode, etc.)

**Crear Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Desplegar:**
```bash
docker build -t polkaedu-backend .
docker run -d -p 3000:3000 --env-file .env polkaedu-backend
```

---

## 🔒 Seguridad en Producción

### ⚠️ IMPORTANTE: Variables Sensibles

1. **NUNCA** subas tu `.env` al repositorio
2. **NUNCA** uses el mnemonic de producción en desarrollo
3. Usa **diferentes cuentas** para testnet y mainnet
4. Considera usar un **secret manager** (AWS Secrets Manager, HashiCorp Vault)

### Recomendaciones:

- ✅ Usa variables de entorno en la plataforma de despliegue
- ✅ Rota tus secrets regularmente
- ✅ Usa testnet para desarrollo
- ✅ Monitorea los logs regularmente

---

## 🧪 Verificar Despliegue

Después de desplegar, verifica que todo funciona:

```bash
# Health check
curl https://tu-app.railway.app/health

# Debería responder:
# {"status":"ok","timestamp":"...","service":"Polkadot Courses Backend"}
```

---

## 📊 Comparación Rápida

| Plataforma | Plan Gratuito | Facilidad | Mejor Para |
|------------|---------------|-----------|------------|
| **Railway** | ✅ $5/mes crédito | ⭐⭐⭐⭐⭐ | Principiantes |
| **Render** | ✅ Limitado | ⭐⭐⭐⭐ | Proyectos pequeños |
| **Fly.io** | ✅ 3 VMs | ⭐⭐⭐⭐ | Aplicaciones rápidas |
| **DigitalOcean** | ❌ | ⭐⭐⭐ | Producción seria |
| **VPS + Docker** | ❌ | ⭐⭐ | Control total |

---

## 🚀 Recomendación Final

Para un proyecto de hackathon como PolkaEdu, recomiendo:

1. **Railway** - Si quieres lo más fácil y rápido
2. **Render** - Si prefieres una alternativa gratuita simple
3. **Fly.io** - Si necesitas mejor rendimiento y velocidad

---

## 📝 Notas Adicionales

### Puerto Dinámico

La mayoría de plataformas asignan un puerto dinámico. Asegúrate de que tu código use:

```typescript
const PORT = process.env.PORT || 3000;
```

Ya está configurado así en `src/index.ts` ✅

### Build y Start

El proyecto ya tiene los scripts configurados:
- `npm run build` - Compila TypeScript
- `npm start` - Ejecuta el servidor compilado

### Logs

Todas las plataformas ofrecen logs en tiempo real. Úsalos para debuggear problemas.

---

## 🆘 Troubleshooting

### Error: "Cannot find module"
- Verifica que `npm run build` se ejecute correctamente
- Asegúrate de que `package.json` tenga `"main": "dist/index.js"`

### Error: "Connection timeout"
- Verifica que `POLKADOT_WS_URL` sea correcta
- Algunas plataformas pueden tener restricciones de red

### Error: "Port already in use"
- Usa `process.env.PORT` (ya configurado)
- No hardcodees el puerto

---

¿Necesitas ayuda? Abre un issue en el repositorio.

