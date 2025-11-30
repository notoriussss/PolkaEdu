/**
 * Almacenamiento en memoria simple para desarrollo
 * Los datos se pierden al reiniciar el servidor
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  walletAddress?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  duration: number;
  price: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lessons?: Lesson[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  enrolledAt: Date;
  completedAt?: Date;
  user?: User;
  course?: Course;
  certificate?: Certificate;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  nftTokenId?: string;
  nftCollectionId?: string;
  transactionHash?: string;
  metadataUrl?: string;
  issuedAt: Date;
}

class MemoryStorage {
  private users: Map<string, User> = new Map();
  private courses: Map<string, Course> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private certificates: Map<string, Certificate> = new Map();

  // Users
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = this.generateId();
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  getUserByWalletAddress(walletAddress: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.walletAddress === walletAddress);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Courses
  createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
    const id = this.generateId();
    const now = new Date();
    const newCourse: Course = {
      ...course,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  getCourseById(id: string): Course | undefined {
    const course = this.courses.get(id);
    if (!course) return undefined;

    // Incluir lecciones
    const lessons = this.getLessonsByCourseId(id);
    return { ...course, lessons };
  }

  getAllCourses(): Course[] {
    return Array.from(this.courses.values()).map(course => {
      const lessons = this.getLessonsByCourseId(course.id);
      return { ...course, lessons };
    });
  }

  updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updated = { ...course, ...updates, updatedAt: new Date() };
    this.courses.set(id, updated);
    return updated;
  }

  deleteCourse(id: string): boolean {
    // Eliminar lecciones relacionadas
    this.getLessonsByCourseId(id).forEach(lesson => {
      this.lessons.delete(lesson.id);
    });
    return this.courses.delete(id);
  }

  // Lessons
  createLesson(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Lesson {
    const id = this.generateId();
    const now = new Date();
    const newLesson: Lesson = {
      ...lesson,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.lessons.set(id, newLesson);
    return newLesson;
  }

  getLessonsByCourseId(courseId: string): Lesson[] {
    return Array.from(this.lessons.values())
      .filter(l => l.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  // Enrollments
  createEnrollment(enrollment: Omit<Enrollment, 'id' | 'enrolledAt'>): Enrollment {
    const id = this.generateId();
    const now = new Date();
    
    // Verificar duplicados
    const existing = Array.from(this.enrollments.values()).find(
      e => e.userId === enrollment.userId && e.courseId === enrollment.courseId
    );
    if (existing) {
      throw new Error('El usuario ya está inscrito en este curso');
    }

    const newEnrollment: Enrollment = {
      ...enrollment,
      id,
      enrolledAt: now
    };
    this.enrollments.set(id, newEnrollment);
    return newEnrollment;
  }

  getEnrollmentById(id: string): Enrollment | undefined {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return undefined;

    // Incluir usuario y curso
    const user = this.users.get(enrollment.userId);
    const course = this.getCourseById(enrollment.courseId);
    return { ...enrollment, user, course };
  }

  getEnrollmentsByUserId(userId: string): Enrollment[] {
    return Array.from(this.enrollments.values())
      .filter(e => e.userId === userId)
      .map(e => {
        const user = this.users.get(e.userId);
        const course = this.getCourseById(e.courseId);
        const certificate = this.getCertificateByEnrollmentId(e.id);
        return { ...e, user, course, certificate };
      })
      .sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime());
  }

  updateEnrollment(id: string, updates: Partial<Enrollment>): Enrollment | undefined {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return undefined;
    
    const updated = { ...enrollment, ...updates };
    this.enrollments.set(id, updated);
    return updated;
  }

  // Certificates
  createCertificate(certificate: Omit<Certificate, 'id' | 'issuedAt'>): Certificate {
    const id = this.generateId();
    const now = new Date();
    const newCertificate: Certificate = {
      ...certificate,
      id,
      issuedAt: now
    };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }

  getCertificateByEnrollmentId(enrollmentId: string): Certificate | undefined {
    return Array.from(this.certificates.values()).find(c => c.enrollmentId === enrollmentId);
  }

  getCertificateById(id: string): Certificate | undefined {
    return this.certificates.get(id);
  }

  getAllCertificates(): Certificate[] {
    return Array.from(this.certificates.values());
  }

  // Utilidades
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Limpiar todo (útil para tests)
  clear(): void {
    this.users.clear();
    this.courses.clear();
    this.lessons.clear();
    this.enrollments.clear();
    this.certificates.clear();
  }
}

// Instancia singleton
export const storage = new MemoryStorage();

