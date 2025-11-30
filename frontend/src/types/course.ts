/**
 * Tipos relacionados con cursos
 */

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

