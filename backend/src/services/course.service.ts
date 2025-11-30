import { storage, Course, Lesson } from '../storage/memory-storage';

export class CourseService {
  /**
   * Obtiene todos los cursos
   */
  async getAllCourses() {
    return storage.getAllCourses();
  }

  /**
   * Obtiene un curso por ID
   */
  async getCourseById(id: string) {
    return storage.getCourseById(id);
  }

  /**
   * Obtiene todas las lecciones de un curso
   */
  async getCourseLessons(courseId: string) {
    return storage.getLessonsByCourseId(courseId);
  }

  /**
   * Crea un nuevo curso
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
  }) {
    const course = storage.createCourse({
      title: data.title,
      description: data.description,
      instructor: data.instructor,
      duration: data.duration,
      price: data.price || 0,
      imageUrl: data.imageUrl
    });

    // Crear lecciones si se proporcionan
    if (data.lessons && data.lessons.length > 0) {
      const lessons = data.lessons.map(lessonData => 
        storage.createLesson({
          courseId: course.id,
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          order: lessonData.order,
          duration: lessonData.duration
        })
      );
      return { ...course, lessons };
    }

    return course;
  }

  /**
   * Actualiza un curso
   */
  async updateCourse(id: string, data: Partial<{
    title: string;
    description: string;
    instructor: string;
    duration: number;
    price: number;
    imageUrl: string;
  }>) {
    return storage.updateCourse(id, data);
  }

  /**
   * Elimina un curso
   */
  async deleteCourse(id: string) {
    const deleted = storage.deleteCourse(id);
    if (!deleted) {
      throw new Error('Curso no encontrado');
    }
    return { success: true };
  }
}
