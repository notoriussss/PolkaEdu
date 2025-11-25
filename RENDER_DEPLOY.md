# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar el backend de PolkaEdu en Render.

## 📋 Prerrequisitos

1. Cuenta en [Render](https://render.com)
2. Repositorio en GitHub con el código
3. Variables de entorno configuradas

## 🔧 Configuración en Render

### Opción 1: Usando render.yaml (Recomendado)

1. **Conectar Repositorio:**
   - Ve a [dashboard.render.com](https://dashboard.render.com)
   - Click en "New +" → "Web Service"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `PolkaEdu`
   - Selecciona la rama `backendv2` (o la rama que uses)

2. **Render detectará automáticamente el `render.yaml`:**
   - El archivo `render.yaml` ya está configurado con:
     - Build Command: `yarn install && yarn build`
     - Start Command: `yarn start`
     - Health Check: `/health`
     - Puerto: `10000`

3. **Configurar Variables de Entorno:**
   - En el dashboard de Render, ve a "Environment"
   - Agrega las siguientes variables:

#### Variables Requeridas:

```env
NODE_ENV=production
PORT=10000
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
NFT_ADMIN_MNEMONIC=tu_mnemonic_de_12_palabras_aqui
NFT_COLLECTION_ID=1
JWT_SECRET=tu_secret_jwt_seguro
POLKADOT_ACCOUNT_TYPE=sr25519
```

#### Variables Opcionales:

```env
PINATA_KEY=tu_pinata_key
PINATA_SECRET=tu_pinata_secret
```

⚠️ **IMPORTANTE:** 
- Para `NFT_ADMIN_MNEMONIC`, pega las 12 palabras separadas por espacios
- Para `JWT_SECRET`, usa una cadena aleatoria segura (puedes generar una con: `openssl rand -base64 32`)
- Nunca compartas estas variables públicamente

### Opción 2: Configuración Manual

Si prefieres configurar manualmente:

1. **Build Command:**
   ```
   yarn install && yarn build
   ```

2. **Start Command:**
   ```
   yarn start
   ```

3. **Health Check Path:**
   ```
   /health
   ```

4. **Environment:**
   - Node: 18.x (o superior)

## 🔍 Verificar el Despliegue

Después de desplegar, verifica que todo funciona:

```bash
# Health check
curl https://tu-app.onrender.com/health

# Debería responder:
# {"status":"ok","timestamp":"...","service":"Polkadot Courses Backend"}
```

## 📝 Notas Importantes

1. **Primer Deploy:**
   - El primer deploy puede tardar varios minutos
   - Render compilará el código TypeScript a JavaScript
   - Verifica los logs para asegurarte de que no hay errores

2. **Variables de Entorno:**
   - Todas las variables sensibles deben configurarse en el dashboard de Render
   - No subas el archivo `.env` al repositorio

3. **Logs:**
   - Puedes ver los logs en tiempo real en el dashboard de Render
   - Los logs te ayudarán a diagnosticar problemas

4. **Auto-Deploy:**
   - Por defecto, Render desplegará automáticamente cuando hagas push a la rama configurada
   - Puedes desactivar esto en la configuración del servicio

## 🐛 Solución de Problemas

### Error: "Cannot find module '/opt/render/project/src/dist/index.js'"

**Solución:** Asegúrate de que el build command incluya `yarn build`:
```
yarn install && yarn build
```

### Error: "Build failed"

**Solución:** 
- Verifica los logs de build en Render
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que no haya errores de TypeScript ejecutando `yarn build` localmente

### Error: "Port already in use"

**Solución:** 
- Render asigna el puerto automáticamente a través de la variable `PORT`
- Asegúrate de usar `process.env.PORT` en tu código (ya está configurado)

### El servicio se detiene después de unos minutos

**Solución:**
- Render suspende servicios gratuitos después de 15 minutos de inactividad
- Considera usar un servicio de "ping" para mantener el servicio activo
- O actualiza a un plan de pago

## 🔗 Enlaces Útiles

- [Documentación de Render](https://render.com/docs)
- [Guía de Node.js en Render](https://render.com/docs/node-version)
- [Variables de Entorno en Render](https://render.com/docs/environment-variables)

