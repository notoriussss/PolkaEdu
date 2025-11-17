import { storage, Enrollment, Certificate } from '../storage/memory-storage';
import { NFTService } from './nft.service';
import { PaymentService } from './payment.service';

const paymentService = new PaymentService();

export class EnrollmentService {
  /**
   * Inscribe un usuario en un curso
   * IMPORTANTE: El pago debe realizarse ANTES de la inscripción, no cuando se recibe el certificado
   */
  async enrollUser(userId: string, courseId: string, paymentVerification?: {
    transactionHash: string;
    amount: number;
    senderAddress: string;
    recipientAddress: string;
  }) {
    // Verificar que el usuario existe
    const user = storage.getUserById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que el curso existe
    const course = storage.getCourseById(courseId);
    if (!course) {
      throw new Error('Curso no encontrado');
    }

    // Si el curso tiene precio, verificar que se haya realizado el pago
    if (course.price && course.price > 0) {
      if (!paymentVerification) {
        throw new Error('El curso requiere pago. Debe proporcionar la verificación de pago antes de inscribirse.');
      }

      // Verificar el pago
      const verification = await paymentService.verifyPayment(
        paymentVerification.transactionHash,
        paymentVerification.recipientAddress,
        paymentVerification.amount,
        paymentVerification.senderAddress
      );

      if (!verification.valid) {
        throw new Error(`Pago no válido: ${verification.error || 'Error desconocido'}`);
      }

      // Verificar que el monto coincida con el precio del curso
      if (parseFloat(verification.amount || '0') < course.price) {
        throw new Error(`El monto pagado (${verification.amount}) es menor al precio del curso (${course.price})`);
      }
    }

    const enrollment = storage.createEnrollment({
      userId,
      courseId,
      progress: 0,
      completed: false
    });

    // Incluir datos relacionados
    return {
      ...enrollment,
      user,
      course
    };
  }

  /**
   * Actualiza el progreso de un usuario en un curso
   */
  async updateProgress(enrollmentId: string, progress: number) {
    const enrollment = storage.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw new Error('Inscripción no encontrada');
    }

    const finalProgress = Math.min(100, Math.max(0, progress));
    const completed = finalProgress >= 100;

    const updated = storage.updateEnrollment(enrollmentId, {
      progress: finalProgress,
      completed,
      completedAt: completed ? new Date() : undefined
    });

    if (!updated) {
      throw new Error('Error al actualizar inscripción');
    }

    // Si el curso está completado, crear el certificado NFT
    if (completed && finalProgress >= 100) {
      await this.issueCertificate(enrollmentId);
    }

    // Incluir datos relacionados
    const user = storage.getUserById(updated.userId);
    const course = storage.getCourseById(updated.courseId);
    return { ...updated, user, course };
  }

  /**
   * Marca un curso como completado y emite el certificado NFT
   */
  async completeCourse(enrollmentId: string) {
    const enrollment = storage.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw new Error('Inscripción no encontrada');
    }

    if (enrollment.completed) {
      // Si ya está completado, verificar si tiene certificado y retornar
      const certificate = storage.getCertificateByEnrollmentId(enrollmentId);
      const user = storage.getUserById(enrollment.userId);
      const course = storage.getCourseById(enrollment.courseId);
      return { ...enrollment, user, course, certificate };
    }

    // Actualizar inscripción como completada PRIMERO
    // Esto asegura que el curso se marque como completado incluso si falla el NFT
    const updated = storage.updateEnrollment(enrollmentId, {
      progress: 100,
      completed: true,
      completedAt: new Date()
    });

    if (!updated) {
      throw new Error('Error al actualizar inscripción');
    }

    // Intentar emitir certificado NFT
    // Si falla, el curso ya está marcado como completado
    let certificate = null;
    try {
      certificate = await this.issueCertificate(enrollmentId);
      console.log(`✅ Certificado NFT emitido exitosamente para enrollment ${enrollmentId}`);
    } catch (error: any) {
      console.error(`⚠️ Error al emitir certificado NFT para enrollment ${enrollmentId}:`, error.message);
      
      // Crear certificado pendiente (sin NFT) para que el usuario sepa que completó el curso
      // Esto permite que el certificado se pueda emitir más tarde cuando se solucione el problema de conexión
      try {
        const existingCertificate = storage.getCertificateByEnrollmentId(enrollmentId);
        if (!existingCertificate) {
          certificate = storage.createCertificate({
            enrollmentId,
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            nftTokenId: undefined, // Pendiente
            nftCollectionId: process.env.NFT_COLLECTION_ID || '1',
            transactionHash: undefined, // Pendiente
            metadataUrl: undefined // Pendiente
          });
          console.log(`📝 Certificado pendiente creado (sin NFT) para enrollment ${enrollmentId}`);
        } else {
          certificate = existingCertificate;
        }
      } catch (certError) {
        console.error('Error al crear certificado pendiente:', certError);
        // Continuar de todas formas, el curso ya está completado
      }
      
      // No lanzar el error, el curso ya está completado
      // El error se registra pero no impide que el curso se marque como completado
    }

    // Incluir datos relacionados
    const user = storage.getUserById(updated.userId);
    const course = storage.getCourseById(updated.courseId);
    return { ...updated, user, course, certificate };
  }

  /**
   * Emite un certificado NFT para un curso completado
   * IMPORTANTE: NO se realiza ningún cobro al emitir el certificado.
   * El pago se realiza únicamente en el momento de la inscripción.
   */
  private async issueCertificate(enrollmentId: string) {
    const enrollment = storage.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw new Error('Inscripción no encontrada');
    }

    if (!enrollment.user) {
      throw new Error('Usuario no encontrado');
    }

    if (!enrollment.course) {
      throw new Error('Curso no encontrado');
    }

    if (!enrollment.user.walletAddress) {
      throw new Error('El usuario no tiene una dirección de wallet configurada');
    }

    // Verificar que no exista ya un certificado
    const existingCertificate = storage.getCertificateByEnrollmentId(enrollmentId);
    if (existingCertificate) {
      console.log('El certificado ya existe para esta inscripción');
      return existingCertificate;
    }

    // Crear metadata del NFT
    const metadata = {
      name: `Certificado: ${enrollment.course.title}`,
      description: `Certificado de finalización del curso ${enrollment.course.title}`,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      studentName: enrollment.user.name || enrollment.user.email,
      issuedAt: new Date().toISOString(),
      attributes: [
        {
          trait_type: 'Curso',
          value: enrollment.course.title
        },
        {
          trait_type: 'Instructor',
          value: enrollment.course.instructor
        },
        {
          trait_type: 'Duración',
          value: `${enrollment.course.duration} horas`
        }
      ]
    };

    try {
      // Crear el NFT en la blockchain (instanciar servicio solo cuando se necesite)
      const nftService = new NFTService();
      const nftResult = await nftService.createCertificateNFT(
        enrollment.user.walletAddress,
        metadata
      );

      // Guardar el certificado
      const certificate = storage.createCertificate({
        enrollmentId,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        nftTokenId: nftResult.tokenId,
        nftCollectionId: process.env.NFT_COLLECTION_ID || '1',
        transactionHash: nftResult.transactionHash,
        metadataUrl: metadata.issuedAt // TODO: Reemplazar con URL real de IPFS
      });

      console.log(`✅ Certificado NFT creado: ${certificate.id}`);
      return certificate;
    } catch (error: any) {
      console.error('Error al crear certificado NFT:', error);
      
      // NO lanzar el error, crear un certificado pendiente en su lugar
      // Esto permite que el curso se complete aunque falle la conexión a la blockchain
      const pendingCertificate = storage.createCertificate({
        enrollmentId,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        nftTokenId: undefined, // Pendiente - se puede emitir más tarde
        nftCollectionId: process.env.NFT_COLLECTION_ID || '1',
        transactionHash: undefined, // Pendiente
        metadataUrl: metadata.issuedAt
      });
      
      console.log(`📝 Certificado pendiente creado (sin NFT) para enrollment ${enrollmentId}. Error: ${error.message}`);
      return pendingCertificate;
    }
  }

  /**
   * Obtiene las inscripciones de un usuario
   */
  async getUserEnrollments(userId: string) {
    return storage.getEnrollmentsByUserId(userId);
  }

  /**
   * Obtiene una inscripción por ID
   */
  async getEnrollmentById(id: string) {
    return storage.getEnrollmentById(id);
  }
}
