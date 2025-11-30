import { Request, Response } from 'express';
import { EnrollmentService } from '../services/enrollment.service';
import { UserService } from '../services/user.service';

const enrollmentService = new EnrollmentService();
const userService = new UserService();

export class EnrollmentController {
  async enrollUser(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.body;
      const enrollment = await enrollmentService.enrollUser(userId, courseId);
      return res.status(201).json(enrollment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateProgress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const enrollment = await enrollmentService.updateProgress(id, progress);
      return res.json(enrollment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async completeCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const enrollment = await enrollmentService.completeCourse(id);
      return res.json(enrollment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getUserEnrollments(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const enrollments = await enrollmentService.getUserEnrollments(userId);
      return res.json(enrollments);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getEnrollmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const enrollment = await enrollmentService.getEnrollmentById(id);
      
      if (!enrollment) {
        return res.status(404).json({ error: 'Inscripción no encontrada' });
      }
      
      return res.json(enrollment);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Inscribe un usuario usando su wallet address
   * POST /api/enrollments/wallet
   * IMPORTANTE: El pago debe realizarse ANTES de la inscripción
   */
  async enrollWithWallet(req: Request, res: Response) {
    try {
      const { walletAddress, courseId, transactionHash, amount } = req.body;

      if (!walletAddress || !courseId) {
        return res.status(400).json({ 
          error: 'walletAddress y courseId son requeridos' 
        });
      }

      // Obtener o crear usuario basado en wallet
      let user = await userService.getUserByWalletAddress(walletAddress);
      if (!user) {
        user = await userService.createUserFromWallet(walletAddress);
      }

      // Obtener el curso para verificar el precio
      const { storage } = await import('../storage/memory-storage');
      const course = storage.getCourseById(courseId);
      if (!course) {
        return res.status(400).json({ error: 'Curso no encontrado' });
      }

      // Verificar si el usuario ya está inscrito (ANTES de procesar el pago)
      if (user) {
        const existingEnrollments = await enrollmentService.getUserEnrollments(user.id);
        const existingEnrollment = existingEnrollments.find(e => e.courseId === courseId);
        if (existingEnrollment) {
          return res.status(400).json({ 
            error: 'Ya estás inscrito en este curso. No se realizará ningún cobro.' 
          });
        }
      }

      // Dirección del admin (destinatario de pagos)
      const ADMIN_ADDRESS = process.env.NFT_ADMIN_ADDRESS || "13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9";

      // Si el curso tiene precio, validar el pago
      let paymentVerification = undefined;
      if (course.price && course.price > 0) {
        if (!transactionHash || amount === undefined) {
          return res.status(400).json({ 
            error: 'El curso requiere pago. Debe proporcionar transactionHash y amount antes de inscribirse.' 
          });
        }

        paymentVerification = {
          transactionHash,
          amount: parseFloat(amount),
          senderAddress: walletAddress,
          recipientAddress: ADMIN_ADDRESS
        };
      }

      // Inscribir al curso (con validación de pago si es necesario)
      const enrollment = await enrollmentService.enrollUser(user.id, courseId, paymentVerification);
      return res.status(201).json(enrollment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtiene inscripciones por wallet address
   * GET /api/enrollments/wallet/:walletAddress
   */
  async getEnrollmentsByWallet(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;

      if (!walletAddress) {
        return res.status(400).json({ error: 'walletAddress es requerido' });
      }

      // Obtener usuario por wallet
      const user = await userService.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.json([]); // Retornar array vacío si no existe usuario
      }

      const enrollments = await enrollmentService.getUserEnrollments(user.id);
      
      // Serializar correctamente los enrollments para JSON
      const serializedEnrollments = enrollments.map(enrollment => ({
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        completed: enrollment.completed,
        enrolledAt: enrollment.enrolledAt instanceof Date ? enrollment.enrolledAt.toISOString() : enrollment.enrolledAt,
        completedAt: enrollment.completedAt instanceof Date ? enrollment.completedAt.toISOString() : enrollment.completedAt,
        user: enrollment.user ? {
          id: enrollment.user.id,
          name: enrollment.user.name,
          email: enrollment.user.email,
          walletAddress: enrollment.user.walletAddress,
          createdAt: enrollment.user.createdAt instanceof Date ? enrollment.user.createdAt.toISOString() : enrollment.user.createdAt,
          updatedAt: enrollment.user.updatedAt instanceof Date ? enrollment.user.updatedAt.toISOString() : enrollment.user.updatedAt
        } : undefined,
        course: enrollment.course ? {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          instructor: enrollment.course.instructor,
          duration: enrollment.course.duration,
          price: enrollment.course.price,
          imageUrl: enrollment.course.imageUrl,
          createdAt: enrollment.course.createdAt instanceof Date ? enrollment.course.createdAt.toISOString() : enrollment.course.createdAt,
          updatedAt: enrollment.course.updatedAt instanceof Date ? enrollment.course.updatedAt.toISOString() : enrollment.course.updatedAt
        } : undefined,
        certificate: enrollment.certificate ? {
          id: enrollment.certificate.id,
          enrollmentId: enrollment.certificate.enrollmentId,
          userId: enrollment.certificate.userId,
          courseId: enrollment.certificate.courseId,
          nftTokenId: enrollment.certificate.nftTokenId,
          nftCollectionId: enrollment.certificate.nftCollectionId,
          transactionHash: enrollment.certificate.transactionHash,
          metadataUrl: enrollment.certificate.metadataUrl,
          issuedAt: enrollment.certificate.issuedAt instanceof Date ? enrollment.certificate.issuedAt.toISOString() : enrollment.certificate.issuedAt
        } : undefined
      }));
      
      return res.json(serializedEnrollments);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

