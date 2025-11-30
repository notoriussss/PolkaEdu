import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export class PaymentController {
  /**
   * Verifica un pago de curso
   * POST /api/payments/verify
   */
  async verifyPayment(req: Request, res: Response) {
    try {
      const { transactionHash, amount, senderAddress } = req.body;

      if (!transactionHash || amount === undefined) {
        return res.status(400).json({
          error: 'transactionHash y amount son requeridos'
        });
      }

      // Obtener la dirección del admin desde la configuración del backend
      const adminAddress = process.env.NFT_ADMIN_ADDRESS || "13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9";

      const verification = await paymentService.verifyPayment(
        transactionHash,
        adminAddress, // Usar la dirección del admin del backend
        parseFloat(amount),
        senderAddress
      );

      if (verification.valid) {
        res.json({
          success: true,
          data: verification
        });
      } else {
        res.status(400).json({
          success: false,
          error: verification.error,
          data: verification
        });
      }
    } catch (error: any) {
      console.error('Error al verificar pago:', error);
      res.status(500).json({
        error: error.message || 'Error al verificar el pago'
      });
    }
  }

  /**
   * Obtiene el balance de una cuenta
   * GET /api/payments/balance/:address
   */
  async getBalance(req: Request, res: Response) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json({
          error: 'address es requerido'
        });
      }

      const balance = await paymentService.getBalance(address);

      res.json({
        success: true,
        data: balance
      });
    } catch (error: any) {
      console.error('Error al obtener balance:', error);
      res.status(500).json({
        error: error.message || 'Error al obtener el balance'
      });
    }
  }

  /**
   * Obtiene la dirección del admin (destinatario de pagos)
   * GET /api/payments/admin-address
   */
  async getAdminAddress(req: Request, res: Response) {
    try {
      const adminAddress = process.env.NFT_ADMIN_ADDRESS || "13Mby3KmWFu5w16j3YDN1zD6WzVpjb7WzgC1apze9N3dJYy9";
      
      res.json({
        success: true,
        data: {
          address: adminAddress
        }
      });
    } catch (error: any) {
      console.error('Error al obtener dirección del admin:', error);
      res.status(500).json({
        error: error.message || 'Error al obtener la dirección del admin'
      });
    }
  }
}

