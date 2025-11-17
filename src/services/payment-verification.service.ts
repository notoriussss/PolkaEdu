/**
 * Servicio para verificar pagos con el backend
 */

import { apiClient } from '@/src/config/api';

export interface VerifyPaymentRequest {
  transactionHash: string;
  amount: number;
  senderAddress: string;
  // recipientAddress ya no es necesario, el backend lo obtiene de su configuración
}

export interface VerifyPaymentResponse {
  success: boolean;
  data?: {
    valid: boolean;
    transactionHash: string;
    amount: number;
    senderAddress: string;
    recipientAddress: string;
    blockNumber?: number;
    error?: string;
  };
  error?: string;
}

export class PaymentVerificationService {
  /**
   * Verifica un pago con el backend
   */
  async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await apiClient.post<VerifyPaymentResponse>('/api/payments/verify', data);
      return response;
    } catch (error: any) {
      console.error('Error al verificar pago:', error);
      return {
        success: false,
        error: error.message || 'Error al verificar el pago',
      };
    }
  }
}

// Instancia singleton del servicio
export const paymentVerificationService = new PaymentVerificationService();

