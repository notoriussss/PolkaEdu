/**
 * Servicio para realizar pagos y transacciones en Polkadot
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { apiClient } from '@/src/config/api';

// URL del nodo - debe coincidir con el backend
const NODE_URL = process.env.NEXT_PUBLIC_POLKADOT_WS_URL || "wss://asset-hub-paseo.dotters.network";

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Conecta a la API de Polkadot
 */
async function getApi(): Promise<ApiPromise> {
  const provider = new WsProvider(NODE_URL);
  const api = await ApiPromise.create({ provider });
  await api.isReady;
  return api;
}

/**
 * Obtiene la dirección del admin desde el backend
 */
async function getAdminAddress(): Promise<string> {
  try {
    const response = await apiClient.get<{ success: boolean; data: { address: string } }>('/api/payments/admin-address');
    if (response.success && response.data?.address) {
      return response.data.address;
    }
    throw new Error('No se pudo obtener la dirección del admin');
  } catch (error) {
    console.error('Error al obtener dirección del admin:', error);
    throw new Error('No se pudo obtener la dirección del admin desde el backend');
  }
}

/**
 * Realiza un pago (transferencia) desde una wallet conectada
 */
export async function makePayment(
  fromAddress: string,
  amount: number, // en PAS (se convertirá a planck)
  signer: any // Signer de la extensión de wallet
): Promise<PaymentResult> {
  try {
    const api = await getApi();
    
    // Obtener la dirección del admin desde el backend
    const adminAddress = await getAdminAddress();
    
    // Convertir cantidad a planck (10 decimales para PAS)
    const amountInPlanck = BigInt(Math.floor(amount * 10 ** 10));

    // Crear la transacción de transferencia
    const transfer = api.tx.balances.transferAllowDeath(adminAddress, amountInPlanck);

    // Firmar y enviar la transacción
    return new Promise((resolve) => {
      // Timeout de 5 minutos para evitar que quede cargando indefinidamente
      const timeout = setTimeout(() => {
        resolve({
          success: false,
          error: 'La transacción está tardando demasiado. Por favor, intenta de nuevo.',
        });
      }, 1 * 60 * 1000); // 1 minuto

      let unsubscribe: (() => void) | null = null;
      
      transfer.signAndSend(
        fromAddress,
        { signer },
        async ({ status, txHash, dispatchError }: any) => {
          if (dispatchError) {
            clearTimeout(timeout);
            if (unsubscribe) {
              unsubscribe();
            }
            
            let errorMessage = 'Error desconocido en la transacción';
            
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
            } else {
              errorMessage = dispatchError.toString();
            }

            resolve({
              success: false,
              error: errorMessage,
            });
            return;
          }

          if (status.isInBlock || status.isFinalized) {
            clearTimeout(timeout);
            if (unsubscribe) {
              unsubscribe();
            }
            
            resolve({
              success: true,
              transactionHash: txHash.toString(),
            });
          }
        }
      ).then((unsub: () => void) => {
        unsubscribe = unsub;
      }).catch((error: any) => {
        clearTimeout(timeout);
        if (unsubscribe) {
          unsubscribe();
        }
        
        // Detectar cancelación del usuario
        const errorMessage = error.message || error.toString() || '';
        const isCancelled = 
          errorMessage.toLowerCase().includes('user') && 
          (errorMessage.toLowerCase().includes('reject') || 
           errorMessage.toLowerCase().includes('cancel') ||
           errorMessage.toLowerCase().includes('denied') ||
           errorMessage.toLowerCase().includes('cancelled'));

        resolve({
          success: false,
          error: isCancelled 
            ? 'Transacción cancelada por el usuario' 
            : errorMessage || 'Error al enviar la transacción',
        });
      });
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al conectar con la blockchain',
    };
  }
}

/**
 * Obtiene el signer de la extensión de wallet
 */
export async function getSigner(walletSource: 'polkadot-js' | 'subwallet-js'): Promise<any> {
  if (!window.injectedWeb3) {
    throw new Error('No se encontró ninguna extensión de wallet');
  }

  const extension = window.injectedWeb3[walletSource];
  if (!extension) {
    throw new Error(`Extensión ${walletSource} no encontrada`);
  }

  const provider = await extension.enable('PolkaEdu');
  return provider.signer;
}

// Los tipos de window.injectedWeb3 ya están declarados en useWallet.ts

