import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas y servicios directamente desde src
// Netlify compilará TypeScript automáticamente
import { initPolkadot } from '../../src/config/polkadot';
import courseRoutes from '../../src/routes/course.routes';
import enrollmentRoutes from '../../src/routes/enrollment.routes';
import userRoutes from '../../src/routes/user.routes';
import balanceRoutes from '../../src/routes/balance.routes';
import nftRoutes from '../../src/routes/nft.routes';
import paymentRoutes from '../../src/routes/payment.routes';
import { CourseService } from '../../src/services/course.service';
import { loadCoursesFromJson } from '../../src/utils/loadCoursesFromJson';

// Cargar variables de entorno
dotenv.config();

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
