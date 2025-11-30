import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';

const courseService = new CourseService();

export class CourseController {
  async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await courseService.getAllCourses();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await courseService.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }
      
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCourseLessons(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lessons = await courseService.getCourseLessons(id);
      
      res.json({
        success: true,
        courseId: id,
        count: lessons.length,
        lessons: lessons.map(lesson => ({
          id: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order: lesson.order,
          duration: lesson.duration,
          createdAt: lesson.createdAt instanceof Date ? lesson.createdAt.toISOString() : lesson.createdAt,
          updatedAt: lesson.updatedAt instanceof Date ? lesson.updatedAt.toISOString() : lesson.updatedAt
        }))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCourse(req: Request, res: Response) {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await courseService.updateCourse(id, req.body);
      res.json(course);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await courseService.deleteCourse(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

