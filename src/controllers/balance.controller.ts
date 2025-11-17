import { Request, Response } from 'express';
import { BalanceService } from '../services/balance.service';

const balanceService = new BalanceService();

export class BalanceController {
  /**
   * Obtiene el saldo de la cuenta configurada
   */
  async getMyBalance(req: Request, res: Response) {
    try {
      const balance = await balanceService.getMyBalance();
      res.json(balance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtiene el saldo de una cuenta específica
   */
  async getBalance(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const balance = await balanceService.getBalance(address);
      res.json(balance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtiene información detallada de una cuenta
   */
  async getAccountInfo(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const info = await balanceService.getAccountInfo(address);
      res.json(info);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

