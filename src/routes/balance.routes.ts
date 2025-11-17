import { Router } from 'express';
import { BalanceController } from '../controllers/balance.controller';

const router = Router();
const balanceController = new BalanceController();

router.get('/me', (req, res) => balanceController.getMyBalance(req, res));
router.get('/:address', (req, res) => balanceController.getBalance(req, res));
router.get('/:address/info', (req, res) => balanceController.getAccountInfo(req, res));

export default router;

