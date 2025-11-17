/**
 * Servicio para interactuar con la API de inscripciones
 */

import { apiClient } from '@/src/config/api';

export interface Certificate {
  id: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  nftTokenId?: string;
  nftCollectionId?: string;
  transactionHash?: string;
  metadataUrl?: string;
  issuedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  duration: number;
  price: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  enrolledAt: string;
  completedAt?: string;
  user?: any;
  course?: Course;
  certificate?: Certificate;
}

export interface EnrollWithWalletRequest {
  walletAddress: string;
  courseId: string;
  transactionHash?: string;
  amount?: number;
}

export class EnrollmentService {
  /**
   * Inscribe un usuario en un curso usando su wallet
   */
  async enrollWithWallet(data: EnrollWithWalletRequest): Promise<Enrollment> {
    try {
      const enrollment = await apiClient.post<Enrollment>('/api/enrollments/wallet', data);
      return enrollment;
    } catch (error) {
      console.error('Error al inscribirse en el curso:', error);
      throw error;
    }
  }

  /**
   * Obtiene las inscripciones de un usuario por su wallet address
   */
  async getEnrollmentsByWallet(walletAddress: string): Promise<Enrollment[]> {
    try {
      const enrollments = await apiClient.get<Enrollment[]>(`/api/enrollments/wallet/${walletAddress}`);
      return enrollments;
    } catch (error) {
      console.error('Error al obtener inscripciones:', error);
      throw error;
    }
  }

  /**
   * Completa un curso
   */
  async completeCourse(enrollmentId: string): Promise<Enrollment> {
    try {
      const enrollment = await apiClient.post<Enrollment>(`/api/enrollments/${enrollmentId}/complete`);
      return enrollment;
    } catch (error) {
      console.error('Error al completar el curso:', error);
      throw error;
    }
  }

  /**
   * Actualiza el progreso de una inscripción
   */
  async updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    try {
      const enrollment = await apiClient.put<Enrollment>(`/api/enrollments/${enrollmentId}/progress`, { progress });
      return enrollment;
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario ya está inscrito en un curso
   */
  async checkEnrollment(walletAddress: string, courseId: string): Promise<Enrollment | null> {
    try {
      const enrollments = await this.getEnrollmentsByWallet(walletAddress);
      const enrollment = enrollments.find(e => e.courseId === courseId);
      return enrollment || null;
    } catch (error) {
      console.error('Error al verificar inscripción:', error);
      return null;
    }
  }
}

// Instancia singleton del servicio
export const enrollmentService = new EnrollmentService();

