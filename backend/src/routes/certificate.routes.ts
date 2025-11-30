import { Router } from 'express';
import { CertificateController } from '../controllers/certificate.controller';

const router = Router();
const certificateController = new CertificateController();

router.get('/', (req, res) => certificateController.getAllCertificates(req, res));
router.get('/user/:userId', (req, res) => certificateController.getUserCertificates(req, res));
router.get('/wallet/:walletAddress', (req, res) => certificateController.getCertificatesByWallet(req, res));
router.get('/:id', (req, res) => certificateController.getCertificateById(req, res));

export default router;

