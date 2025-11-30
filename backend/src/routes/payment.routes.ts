import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

router.post('/verify', (req, res) => paymentController.verifyPayment(req, res));
router.get('/balance/:address', (req, res) => paymentController.getBalance(req, res));
router.get('/admin-address', (req, res) => paymentController.getAdminAddress(req, res));

export default router;

