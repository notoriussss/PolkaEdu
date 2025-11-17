/**
 * Servicio para interactuar con la API de cursos
 */

import { apiClient } from '@/src/config/api';
import { Course } from '@/src/types/course';

export class CourseService {
  /**
   * Obtiene todos los cursos disponibles
   */
  async getAllCourses(): Promise<Course[]> {
    try {
      const courses = await apiClient.get<Course[]>('/api/courses');
      return courses;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un curso por su ID
   */
  async getCourseById(id: string): Promise<Course> {
    try {
      const course = await apiClient.get<Course>(`/api/courses/${id}`);
      return course;
    } catch (error) {
      console.error(`Error al obtener el curso ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo curso (requiere autenticación)
   */
  async createCourse(data: {
    title: string;
    description?: string;
    instructor: string;
    duration: number;
    price?: number;
    imageUrl?: string;
    lessons?: Array<{
      title: string;
      description?: string;
      content: string;
      order: number;
      duration: number;
    }>;
  }): Promise<Course> {
    try {
      const course = await apiClient.post<Course>('/api/courses', data);
      return course;
    } catch (error) {
      console.error('Error al crear el curso:', error);
      throw error;
    }
  }

  /**
   * Actualiza un curso existente (requiere autenticación)
   */
  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    try {
      const course = await apiClient.put<Course>(`/api/courses/${id}`, data);
      return course;
    } catch (error) {
      console.error(`Error al actualizar el curso ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un curso (requiere autenticación)
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/courses/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el curso ${id}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const courseService = new CourseService();

