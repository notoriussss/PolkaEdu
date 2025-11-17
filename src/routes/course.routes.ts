import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';

const router = Router();
const courseController = new CourseController();

router.get('/', (req, res) => courseController.getAllCourses(req, res));
router.get('/:id', (req, res) => courseController.getCourseById(req, res));
router.post('/', (req, res) => courseController.createCourse(req, res));
router.put('/:id', (req, res) => courseController.updateCourse(req, res));
router.delete('/:id', (req, res) => courseController.deleteCourse(req, res));

export default router;

