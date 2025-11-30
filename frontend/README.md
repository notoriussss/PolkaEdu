# PolkaEdu Frontend

Plataforma educativa descentralizada para el ecosistema Polkadot. Cursos creados por la comunidad, certificados como NFTs en la red y gobernados por una DAO.

## 📚 Descripción

PolkaEdu es una plataforma educativa descentralizada que permite a los usuarios aprender sobre tecnologías del ecosistema Polkadot (Rust, Substrate, Parachains, etc.), obtener certificados NFT al completar cursos y participar en la gobernanza de la plataforma a través de una DAO.

## ✨ Características Principales

- 🎓 **Explorar Cursos**: Descubre y explora cursos sobre tecnologías del ecosistema Polkadot
- 📜 **Certificados NFT**: Obtén certificados NFT al completar cursos exitosamente
- 🎯 **Mi Aprendizaje**: Gestiona tus cursos inscritos y tu progreso
- 👨‍🏫 **Enseñar**: Conviértete en instructor y comparte tu conocimiento
- 🗳️ **Gobernanza DAO**: Participa en la toma de decisiones de la plataforma
- 💼 **Conexión de Wallets**: Conecta tu wallet de Polkadot (Polkadot.js, SubWallet, etc.)
- 💳 **Pagos Blockchain**: Realiza pagos y verificaciones mediante la blockchain de Polkadot

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 16.0.3
- **Lenguaje**: TypeScript 5
- **UI Library**: React 19.2.0
- **Estilos**: Tailwind CSS 4
- **Blockchain**: @polkadot/api 16.5.2
- **Iconos**: @heroicons/react 2.2.0
- **Componentes UI**: PrimeReact 10.9.7
- **Linting**: ESLint 9

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 20 o superior
- **npm**: Versión 9 o superior (o yarn/pnpm)
- **Git**: Para clonar el repositorio

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd PolkaEdu
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Configuración de Polkadot

La aplicación se conecta automáticamente a la red de Polkadot. Asegúrate de tener una extensión de wallet instalada en tu navegador:

- **Polkadot.js Extension**: [Instalar](https://polkadot.js.org/extension/)
- **SubWallet**: [Instalar](https://www.subwallet.app/)

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en modo watch
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción (requiere build previo)
- `npm run lint`: Ejecuta ESLint para verificar el código

## 📁 Estructura del Proyecto

```
PolkaEdu/
├── public/                 # Archivos estáticos (imágenes, SVGs)
├── src/
│   ├── app/               # Páginas y rutas de Next.js
│   │   ├── course-detail/ # Detalle de curso
│   │   ├── explore/       # Explorar cursos
│   │   ├── governance/    # Gobernanza DAO
│   │   ├── my-certificates/ # Mis certificados
│   │   ├── my-learning/   # Mi aprendizaje
│   │   ├── teach/         # Enseñar
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página de inicio
│   ├── components/        # Componentes reutilizables
│   │   ├── icons/         # Iconos personalizados
│   │   ├── misc/          # Componentes varios
│   │   ├── providers/     # Providers de contexto
│   │   └── ui/            # Componentes de UI
│   ├── config/            # Configuraciones
│   │   └── api.ts         # Configuración de API
│   ├── contexts/          # Contextos de React
│   │   └── WalletContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useEnrollment.ts
│   │   └── useWallet.ts
│   ├── services/          # Servicios de API
│   │   ├── course.service.ts
│   │   ├── enrollment.service.ts
│   │   ├── payment.service.ts
│   │   ├── payment-verification.service.ts
│   │   └── user.service.ts
│   ├── types/             # Definiciones de tipos TypeScript
│   │   ├── course.ts
│   │   └── wallet.ts
│   └── utils/             # Utilidades
│       └── courseMapper.ts
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── netlify.toml
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 🎨 Desarrollo

### Agregar una Nueva Página

1. Crea un nuevo directorio en `src/app/` con el nombre de la ruta
2. Crea un archivo `page.tsx` dentro del directorio
3. La ruta estará disponible automáticamente en `/nombre-de-ruta`

### Agregar un Nuevo Componente

1. Crea el componente en `src/components/ui/` o en la carpeta apropiada
2. Exporta el componente como default o named export
3. Importa y usa el componente donde lo necesites

### Conectar con el Backend

Utiliza el cliente API configurado en `src/config/api.ts`:

```typescript
import { apiClient } from '@/src/config/api';

// Ejemplo de uso
const data = await apiClient.get('/endpoint');
```

### Trabajar con Wallets

Utiliza el hook `useWallet` para interactuar con las wallets:

```typescript
import { useWallet } from '@/src/hooks/useWallet';

const { connect, disconnect, account, isConnected } = useWallet();
```

## 🚢 Despliegue

### Netlify

El proyecto está configurado para desplegarse en Netlify. El archivo `netlify.toml` contiene la configuración necesaria.

1. Conecta tu repositorio a Netlify
2. Netlify detectará automáticamente la configuración
3. Asegúrate de configurar las variables de entorno en el dashboard de Netlify:
   - `NEXT_PUBLIC_API_URL`: URL de tu API backend

### Build Manual

Para crear un build de producción:

```bash
npm run build
npm run start
```

## 🧪 Testing

Actualmente, el proyecto no incluye tests automatizados. Se recomienda agregar:

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright o Cypress
- **Component Tests**: Storybook

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto fue creado para el Polkadot Hackathon.

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Polkadot.js](https://polkadot.js.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Polkadot Network](https://polkadot.network/)

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ para el ecosistema Polkadot**

