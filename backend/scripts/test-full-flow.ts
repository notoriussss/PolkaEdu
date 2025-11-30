/**
 * Script completo para probar el flujo de la aplicación
 * 
 * Ejecutar con: npx tsx scripts/test-full-flow.ts
 * 
 * Este script prueba:
 * 1. Conexión con Polkadot
 * 2. Creación de usuario
 * 3. Creación de curso
 * 4. Inscripción de usuario
 * 5. Actualización de progreso
 * 6. Emisión de certificado NFT
 */

import dotenv from 'dotenv';
import { initPolkadot, getApi, disconnectPolkadot, getSignerAccount } from '../src/config/polkadot';
import { NFTService } from '../src/services/nft.service';
import { CourseService } from '../src/services/course.service';
import { EnrollmentService } from '../src/services/enrollment.service';
import { UserService } from '../src/services/user.service';
import { storage } from '../src/storage/memory-storage';

dotenv.config();

async function testFullFlow() {
  console.log('🧪 Iniciando pruebas del flujo completo...\n');

  try {
    // ============================================
    // 1. Probar conexión con Polkadot
    // ============================================
    console.log('📡 Paso 1: Verificando conexión con Polkadot...');
    const api = await initPolkadot();
    const [chain] = await Promise.all([api.rpc.system.chain()]);
    console.log(`✅ Conectado a: ${chain.toString()}\n`);

    // Verificar cuenta firmante
    const signer = getSignerAccount();
    if (!signer) {
      console.log('⚠️  No hay cuenta configurada para firmar transacciones');
      console.log('   (Esto es necesario para crear NFTs, pero puedes continuar con otras pruebas)\n');
    } else {
      console.log(`✅ Cuenta firmante: ${signer.address}\n`);
    }

    // ============================================
    // 2. Limpiar almacenamiento (para pruebas limpias)
    // ============================================
    console.log('🧹 Limpiando almacenamiento...');
    storage.clear();
    console.log('✅ Almacenamiento limpio\n');

    // ============================================
    // 3. Crear un usuario de prueba
    // ============================================
    console.log('👤 Paso 3: Creando usuario de prueba...');
    const userService = new UserService();
    
    // Si hay cuenta firmante, usar esa dirección, sino crear una dummy
    const walletAddress = signer?.address || '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    
    const user = await userService.createUser({
      email: `test-${Date.now()}@example.com`,
      password: 'test123',
      name: 'Usuario de Prueba',
      walletAddress: walletAddress
    });
    console.log(`✅ Usuario creado: ${user.id} (${user.email})`);
    console.log(`   Wallet: ${user.walletAddress}\n`);

    // ============================================
    // 4. Crear un curso de prueba
    // ============================================
    console.log('📚 Paso 4: Creando curso de prueba...');
    const courseService = new CourseService();
    const course = await courseService.createCourse({
      title: 'Curso de Prueba - Introducción a Polkadot',
      description: 'Este es un curso de prueba para verificar el funcionamiento del sistema',
      instructor: 'Instructor de Prueba',
      duration: 10,
      price: 0,
      lessons: [
        {
          title: 'Lección 1: Introducción',
          description: 'Primera lección del curso',
          content: '# Contenido de la lección 1',
          order: 1,
          duration: 30
        },
        {
          title: 'Lección 2: Conceptos Básicos',
          description: 'Segunda lección del curso',
          content: '# Contenido de la lección 2',
          order: 2,
          duration: 45
        }
      ]
    });
    console.log(`✅ Curso creado: ${course.id}`);
    console.log(`   Título: ${course.title}`);
    console.log(`   Lecciones: ${course.lessons?.length || 0}\n`);

    // ============================================
    // 5. Inscribir usuario en el curso
    // ============================================
    console.log('🎓 Paso 5: Inscribiendo usuario en el curso...');
    const enrollmentService = new EnrollmentService();
    const enrollment = await enrollmentService.enrollUser(user.id, course.id);
    console.log(`✅ Usuario inscrito`);
    console.log(`   Enrollment ID: ${enrollment.id}`);
    console.log(`   Progreso: ${enrollment.progress}%\n`);

    // ============================================
    // 6. Actualizar progreso
    // ============================================
    console.log('📊 Paso 6: Actualizando progreso del curso...');
    let updatedEnrollment = await enrollmentService.updateProgress(enrollment.id, 50);
    console.log(`✅ Progreso actualizado: ${updatedEnrollment.progress}%`);

    updatedEnrollment = await enrollmentService.updateProgress(enrollment.id, 100);
    console.log(`✅ Progreso actualizado: ${updatedEnrollment.progress}%`);
    console.log(`   Completado: ${updatedEnrollment.completed}\n`);

    // ============================================
    // 7. Verificar certificado NFT
    // ============================================
    console.log('🎫 Paso 7: Verificando certificado NFT...');
    const certificate = storage.getCertificateByEnrollmentId(enrollment.id);

    if (certificate) {
      console.log(`✅ Certificado creado:`);
      console.log(`   Certificate ID: ${certificate.id}`);
      console.log(`   NFT Token ID: ${certificate.nftTokenId || 'Pendiente'}`);
      console.log(`   Transaction Hash: ${certificate.transactionHash || 'Pendiente'}`);
      
      if (certificate.transactionHash) {
        console.log(`\n🔗 Puedes verificar la transacción en:`);
        const wsUrl = process.env.POLKADOT_WS_URL || 'wss://rpc.polkadot.io';
        console.log(`   https://polkadot.js.org/apps/?rpc=${encodeURIComponent(wsUrl)}#/explorer/query/${certificate.transactionHash}`);
      }
    } else {
      console.log('⚠️  Certificado no encontrado');
      console.log('   Esto puede ser normal si no hay cuenta firmante configurada');
      console.log('   o si la creación del NFT falló\n');
    }

    // ============================================
    // 8. Verificar datos en el almacenamiento
    // ============================================
    console.log('\n📋 Paso 8: Verificando datos en el almacenamiento...');
    const allCourses = await courseService.getAllCourses();
    const userEnrollments = await enrollmentService.getUserEnrollments(user.id);
    
    console.log(`✅ Cursos en almacenamiento: ${allCourses.length}`);
    console.log(`✅ Inscripciones del usuario: ${userEnrollments.length}\n`);

    // ============================================
    // Resumen final
    // ============================================
    console.log('✨ ============================================');
    console.log('✨ PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('✨ ============================================\n');
    console.log('📊 Resumen:');
    console.log(`   ✅ Conexión con Polkadot: OK`);
    console.log(`   ✅ Almacenamiento en memoria: OK`);
    console.log(`   ✅ Usuario creado: ${user.id}`);
    console.log(`   ✅ Curso creado: ${course.id}`);
    console.log(`   ✅ Inscripción: ${enrollment.id}`);
    console.log(`   ✅ Certificado: ${certificate ? 'Creado' : 'No creado (verificar cuenta firmante)'}\n`);

    console.log('💡 Nota: Los datos están en memoria y se perderán al reiniciar el servidor');
    console.log('   Para persistencia, considera usar una base de datos\n');

  } catch (error: any) {
    console.error('\n❌ Error durante las pruebas:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  } finally {
    await disconnectPolkadot();
    console.log('👋 Desconectado de Polkadot');
  }
}

testFullFlow();
