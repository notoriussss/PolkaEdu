import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';

const router = Router();
const enrollmentController = new EnrollmentController();

router.post('/', (req, res) => enrollmentController.enrollUser(req, res));
router.post('/wallet', (req, res) => enrollmentController.enrollWithWallet(req, res));
router.get('/wallet/:walletAddress', (req, res) => enrollmentController.getEnrollmentsByWallet(req, res));
router.get('/user/:userId', (req, res) => enrollmentController.getUserEnrollments(req, res));
router.get('/:id', (req, res) => enrollmentController.getEnrollmentById(req, res));
router.put('/:id/progress', (req, res) => enrollmentController.updateProgress(req, res));
router.post('/:id/complete', (req, res) => enrollmentController.completeCourse(req, res));

export default router;

