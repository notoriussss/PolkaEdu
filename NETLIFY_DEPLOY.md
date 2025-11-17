# 🚀 Guía de Despliegue en Netlify - PolkaEdu Backend

Esta guía te ayudará a desplegar el backend de PolkaEdu en Netlify usando Netlify Functions.

## 📋 Prerrequisitos

1. Cuenta en [Netlify](https://netlify.com)
2. Repositorio en GitHub con el código
3. Variables de entorno configuradas

## 🔧 Configuración de Variables de Entorno

Netlify permite configurar variables de entorno fácilmente desde el dashboard. Necesitas las siguientes:

### Variables Requeridas

```env
PORT=3000
POLKADOT_WS_URL=wss://asset-hub-paseo.dotters.network
NFT_ADMIN_MNEMONIC=tu_mnemonic_de_12_palabras_aqui
NFT_COLLECTION_ID=1
JWT_SECRET=tu_secret_jwt_seguro
POLKADOT_ACCOUNT_TYPE=sr25519
```

### Variables Opcionales

```env
PINATA_KEY=tu_pinata_key
PINATA_SECRET=tu_pinata_secret
```

## 📝 Pasos para Desplegar

### Opción 1: Desde GitHub (Recomendado)

1. **Conectar Repositorio:**
   - Ve a [app.netlify.com](https://app.netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `PolkaEdu`
   - Selecciona la rama `backend-app`

2. **Configurar Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (aunque Netlify Functions no lo usa, es requerido)
   - **Functions directory:** `netlify/functions`

3. **Configurar Variables de Entorno:**
   - En el dashboard, ve a "Site settings" → "Environment variables"
   - Click en "Add variable"
   - Agrega cada variable una por una:
     ```
     PORT = 3000
     POLKADOT_WS_URL = wss://asset-hub-paseo.dotters.network
     NFT_ADMIN_MNEMONIC = tu_mnemonic_de_12_palabras
     NFT_COLLECTION_ID = 1
     JWT_SECRET = tu_secret_jwt
     POLKADOT_ACCOUNT_TYPE = sr25519
     ```
   - ⚠️ **IMPORTANTE:** Para el `NFT_ADMIN_MNEMONIC`, pega las 12 palabras separadas por espacios

4. **Desplegar:**
   - Click en "Deploy site"
   - Netlify construirá y desplegará automáticamente
   - Espera a que termine el build (puede tardar unos minutos)

5. **Verificar Despliegue:**
   - Una vez desplegado, obtendrás una URL como: `https://tu-app.netlify.app`
   - Prueba el health check: `https://tu-app.netlify.app/health`
   - Deberías ver: `{"status":"ok","timestamp":"...","service":"Polkadot Courses Backend","platform":"Netlify"}`

### Opción 2: Desde CLI de Netlify

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Inicializar sitio:**
   ```bash
   netlify init
   ```
   - Sigue las instrucciones interactivas
   - Selecciona "Create & configure a new site"

4. **Configurar variables de entorno:**
   ```bash
   netlify env:set PORT 3000
   netlify env:set POLKADOT_WS_URL "wss://asset-hub-paseo.dotters.network"
   netlify env:set NFT_ADMIN_MNEMONIC "tu mnemonic de 12 palabras"
   netlify env:set NFT_COLLECTION_ID 1
   netlify env:set JWT_SECRET "tu_secret_jwt"
   netlify env:set POLKADOT_ACCOUNT_TYPE "sr25519"
   ```

5. **Desplegar:**
   ```bash
   netlify deploy --prod
   ```

## 🔍 Verificar que Funciona

### Health Check
```bash
curl https://tu-app.netlify.app/health
```

### Probar API de Cursos
```bash
curl https://tu-app.netlify.app/api/courses
```

### Probar API de NFTs
```bash
curl https://tu-app.netlify.app/api/nfts
```

## 📝 Estructura de URLs en Netlify

Con la configuración actual, todas las rutas funcionan igual que en desarrollo:

- `https://tu-app.netlify.app/health` → Health check
- `https://tu-app.netlify.app/api/courses` → API de cursos
- `https://tu-app.netlify.app/api/enrollments` → API de inscripciones
- `https://tu-app.netlify.app/api/nfts` → API de NFTs
- `https://tu-app.netlify.app/api/balance` → API de balance
- `https://tu-app.netlify.app/api/payments` → API de pagos
- `https://tu-app.netlify.app/api/users` → API de usuarios

## ⚠️ Limitaciones de Netlify Functions

### Timeout
- **Plan gratuito:** 10 segundos máximo por función
- **Plan Pro:** 26 segundos máximo
- **Plan Business:** 26 segundos máximo

**Solución:** Si tus operaciones de Polkadot toman más tiempo, considera:
- Usar operaciones asíncronas
- Implementar polling desde el frontend
- Usar WebSockets para operaciones largas

### Tamaño de Función
- **Límite:** 50MB comprimido
- Tu aplicación debería estar bien dentro de este límite

### Cold Starts
- La primera request después de inactividad puede tardar más (cold start)
- Las siguientes requests son más rápidas (warm)

## 🔒 Seguridad

### Variables de Entorno
- ✅ **NUNCA** subas tu `.env` al repositorio
- ✅ Usa variables de entorno en Netlify Dashboard
- ✅ Para producción, usa un mnemonic diferente al de desarrollo
- ✅ Rota tus secrets regularmente

### Mnemonic
- ⚠️ El mnemonic es SENSIBLE - úsalo solo en variables de entorno
- ⚠️ No lo compartas ni lo subas al código
- ⚠️ Usa diferentes cuentas para testnet y mainnet

## 🐛 Troubleshooting

### Error: "Function not found"
- Verifica que `netlify/functions/server.ts` existe
- Verifica que el build se completó correctamente
- Revisa los logs en Netlify Dashboard

### Error: "Timeout"
- Las operaciones de Polkadot pueden tardar más de 10 segundos
- Considera optimizar las queries o usar operaciones asíncronas
- Revisa los logs para ver dónde se está demorando

### Error: "Cannot connect to Polkadot"
- Verifica que `POLKADOT_WS_URL` esté correctamente configurada
- Algunos endpoints pueden estar bloqueados por firewall de Netlify
- Prueba con diferentes endpoints:
  - `wss://asset-hub-paseo.dotters.network`
  - `wss://rpc.paseo.polkadot.io`
  - `wss://paseo-rpc.polkadot.io`

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm install` se ejecute durante el build
- Revisa los logs de build en Netlify

### Variables de Entorno no funcionan
- Verifica que las variables estén configuradas en "Environment variables"
- Asegúrate de que no tengan espacios extra
- Para el mnemonic, usa comillas si tiene espacios: `"palabra1 palabra2 ..."`

## 📊 Monitoreo

### Logs en Tiempo Real
- Ve a "Functions" → "server" en el dashboard de Netlify
- Click en "View logs" para ver logs en tiempo real

### Analytics
- Netlify proporciona analytics básicos en el plan gratuito
- Puedes ver número de invocaciones, tiempo de ejecución, etc.

## 🚀 Despliegue Continuo

Netlify despliega automáticamente cuando:
- Haces push a la rama conectada (por defecto `main` o `backend-app`)
- Haces merge de un Pull Request (opcional)

Puedes configurar esto en:
- "Site settings" → "Build & deploy" → "Continuous Deployment"

## 💰 Costos

### Plan Gratuito
- ✅ 100GB de ancho de banda/mes
- ✅ 125,000 invocaciones de funciones/mes
- ✅ 100 horas de tiempo de ejecución/mes
- ✅ Perfecto para desarrollo y proyectos pequeños

### Plan Pro ($19/mes)
- ✅ 1TB de ancho de banda/mes
- ✅ 500,000 invocaciones/mes
- ✅ 500 horas de tiempo de ejecución/mes
- ✅ Timeout de 26 segundos

## 📚 Recursos Adicionales

- [Documentación de Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Serverless HTTP](https://github.com/dougmoscrop/serverless-http)

## ✅ Checklist de Despliegue

- [ ] Repositorio conectado en Netlify
- [ ] Build command configurado: `npm run build`
- [ ] Functions directory configurado: `netlify/functions`
- [ ] Todas las variables de entorno configuradas
- [ ] Build exitoso sin errores
- [ ] Health check funcionando: `/health`
- [ ] API endpoints funcionando: `/api/courses`, `/api/nfts`, etc.
- [ ] Logs revisados para verificar que no hay errores

---

¿Necesitas ayuda? Revisa los logs en Netlify Dashboard o abre un issue en el repositorio.

