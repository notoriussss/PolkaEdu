import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPolkadot, disconnectPolkadot } from './config/polkadot';
import courseRoutes from './routes/course.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import userRoutes from './routes/user.routes';
import balanceRoutes from './routes/balance.routes';
import nftRoutes from './routes/nft.routes';
import paymentRoutes from './routes/payment.routes';
import { CourseService } from './services/course.service';
import { loadCoursesFromJson } from './utils/loadCoursesFromJson';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    service: 'Polkadot Courses Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      users: '/api/users',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
      balance: '/api/balance',
      nfts: '/api/nfts',
      payments: '/api/payments'
    },
    documentation: 'See /health for service status'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Polkadot Courses Backend'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/payments', paymentRoutes);

// Manejo de rutas no encontradas (404)
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      root: '/',
      health: '/health',
      users: '/api/users',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
      balance: '/api/balance',
      nfts: '/api/nfts',
      payments: '/api/payments'
    }
  });
});

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Inicializar cursos de ejemplo
async function initializeSampleCourses() {
  const courseService = new CourseService();
  const courses = await courseService.getAllCourses();
  
  // Solo crear cursos si no hay ninguno
  if (courses.length === 0) {
    console.log('📚 Cargando cursos desde cursos-ejemplo.json...');
    
    try {
      const createdCount = await loadCoursesFromJson(courseService);
      console.log(`✅ ${createdCount} curso(s) cargado(s) exitosamente desde JSON`);
    } catch (error) {
      console.error('❌ Error al cargar cursos desde JSON, usando cursos por defecto...', error);
      
      // Fallback: crear cursos básicos si falla la carga del JSON
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
  } else {
    console.log(`📚 ${courses.length} curso(s) ya existente(s)`);
  }
}

// Inicializar servidor
async function startServer() {
  try {
    // Inicializar conexión con Polkadot
    await initPolkadot();
    
    // Inicializar cursos de ejemplo
    await initializeSampleCourses();
    
    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 API de cursos disponible en http://localhost:${PORT}/api/courses`);
      console.log(`🎓 API de inscripciones disponible en http://localhost:${PORT}/api/enrollments`);
      console.log(`💰 API de balance disponible en http://localhost:${PORT}/api/balance`);
      console.log(`🖼️  API de NFTs disponible en http://localhost:${PORT}/api/nfts`);
      console.log(`💳 API de pagos disponible en http://localhost:${PORT}/api/payments`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await disconnectPolkadot();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await disconnectPolkadot();
  process.exit(0);
});

startServer();

