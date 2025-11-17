import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar desde archivos compilados (dist) o desde src si estamos en desarrollo
let initPolkadot: any;
let courseRoutes: any;
let enrollmentRoutes: any;
let userRoutes: any;
let balanceRoutes: any;
let nftRoutes: any;
let paymentRoutes: any;
let CourseService: any;
let loadCoursesFromJson: any;

try {
  // Intentar importar desde dist (producción)
  const polkadotConfig = require('../../dist/config/polkadot');
  initPolkadot = polkadotConfig.initPolkadot;
  
  courseRoutes = require('../../dist/routes/course.routes').default;
  enrollmentRoutes = require('../../dist/routes/enrollment.routes').default;
  userRoutes = require('../../dist/routes/user.routes').default;
  balanceRoutes = require('../../dist/routes/balance.routes').default;
  nftRoutes = require('../../dist/routes/nft.routes').default;
  paymentRoutes = require('../../dist/routes/payment.routes').default;
  
  const courseServiceModule = require('../../dist/services/course.service');
  CourseService = courseServiceModule.CourseService;
  
  const loadCoursesModule = require('../../dist/utils/loadCoursesFromJson');
  loadCoursesFromJson = loadCoursesModule.loadCoursesFromJson;
} catch (error) {
  // Fallback a src si dist no existe (desarrollo local)
  const polkadotConfig = require('../../src/config/polkadot');
  initPolkadot = polkadotConfig.initPolkadot;
  
  courseRoutes = require('../../src/routes/course.routes').default;
  enrollmentRoutes = require('../../src/routes/enrollment.routes').default;
  userRoutes = require('../../src/routes/user.routes').default;
  balanceRoutes = require('../../src/routes/balance.routes').default;
  nftRoutes = require('../../src/routes/nft.routes').default;
  paymentRoutes = require('../../src/routes/payment.routes').default;
  
  const courseServiceModule = require('../../src/services/course.service');
  CourseService = courseServiceModule.CourseService;
  
  const loadCoursesModule = require('../../src/utils/loadCoursesFromJson');
  loadCoursesFromJson = loadCoursesModule.loadCoursesFromJson;
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Polkadot Courses Backend',
    platform: 'Netlify'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/payments', paymentRoutes);

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Inicializar cursos de ejemplo (solo una vez)
let coursesInitialized = false;
let polkadotInitialized = false;

async function initializeServices() {
  if (!polkadotInitialized) {
    try {
      await initPolkadot();
      polkadotInitialized = true;
      console.log('✅ Polkadot inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar Polkadot:', error);
    }
  }

  if (!coursesInitialized) {
    try {
      const courseService = new CourseService();
      const courses = await courseService.getAllCourses();
      
      if (courses.length === 0) {
        console.log('📚 Cargando cursos desde cursos-ejemplo.json...');
        try {
          const createdCount = await loadCoursesFromJson(courseService);
          console.log(`✅ ${createdCount} curso(s) cargado(s) exitosamente`);
        } catch (error) {
          console.error('❌ Error al cargar cursos desde JSON, usando cursos por defecto...', error);
          await courseService.createCourse({
            title: 'Introduction to Polkadot',
            description: 'Learn the fundamental concepts of Polkadot, its architecture and how the ecosystem works.',
            instructor: 'Polkadot Academy',
            duration: 10,
            price: 5.0,
            lessons: [
              {
                title: 'What is Polkadot?',
                description: 'Introduction to the Polkadot ecosystem',
                content: 'Polkadot is a blockchain platform that enables interoperability between different blockchains.',
                order: 1,
                duration: 30
              }
            ]
          });
        }
      }
      coursesInitialized = true;
    } catch (error) {
      console.error('❌ Error al inicializar cursos:', error);
    }
  }
}

// Inicializar servicios antes de la primera request
initializeServices().catch(console.error);

// Exportar handler para Netlify Functions
export const handler = serverless(app, {
  binary: ['image/*', 'application/json']
});

