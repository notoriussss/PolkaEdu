/**
 * Hook personalizado para manejar inscripciones en cursos
 */

import { useState } from 'react';
import * as React from 'react';
import { useWallet } from '@/src/contexts/WalletContext';
import { makePayment, getSigner } from '@/src/services/payment.service';
import { enrollmentService } from '@/src/services/enrollment.service';
import { courseService } from '@/src/services/course.service';
import { paymentVerificationService } from '@/src/services/payment-verification.service';
import { Course } from '@/src/types/course';

export type EnrollmentStep = 
  | 'idle'
  | 'checking-wallet'
  | 'checking-enrollment'
  | 'loading-course'
  | 'confirming-payment'
  | 'signing-transaction'
  | 'waiting-confirmation'
  | 'verifying-payment'
  | 'enrolling'
  | 'success'
  | 'error';

export interface EnrollmentState {
  step: EnrollmentStep;
  error: string | null;
  transactionHash: string | null;
  course: Course | null;
  pendingConfirmation: {
    type: 'connect-wallet' | 'payment';
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null;
  showWalletDialog: boolean;
}

export function useEnrollment() {
  const [state, setState] = useState<EnrollmentState>({
    step: 'idle',
    error: null,
    transactionHash: null,
    course: null,
    pendingConfirmation: null,
    showWalletDialog: false,
  });

  // Guardar callbacks y courseId para cuando se conecte la wallet
  const enrollmentCallbacksRef = React.useRef<{
    resolve?: (value: any) => void;
    reject?: (error: any) => void;
    courseId?: string;
  }>({});

  const walletContext = useWallet();
  const { isConnected, account, connectPolkadotJs, connectSubWallet } = walletContext;

  // Función auxiliar para continuar el proceso después de verificar wallet
  const continueEnrollment = async (courseId: string, currentAccount: any) => {
    // Paso 2: Obtener información del curso
    setState(prev => ({ ...prev, step: 'loading-course' }));
    const course = await courseService.getCourseById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    setState(prev => ({ ...prev, course }));

    // Paso 3: Verificar si ya está inscrito (ANTES de hacer el pago)
    setState(prev => ({ ...prev, step: 'checking-enrollment' }));
    const existingEnrollment = await enrollmentService.checkEnrollment(currentAccount.address, course.id);
    
    if (existingEnrollment) {
      throw new Error(`You are already enrolled in the course "${course.title}".`);
    }

    let transactionHash: string | undefined;
    let paymentAmount: number | undefined;

    // Paso 4: Si el curso tiene precio, realizar el pago (solo si no está inscrito)
    if (course.price && course.price > 0) {
      // Mostrar diálogo de confirmación de pago
      return new Promise((resolve, reject) => {
        setState(prev => ({
          ...prev,
          pendingConfirmation: {
            type: 'payment',
            message: `Do you want to pay ${course.price} PAS to enroll in "${course.title}"?`,
            onConfirm: async () => {
              setState(prev => ({ ...prev, pendingConfirmation: null }));
              try {
                // Continuar con el pago
                await processPaymentAndEnrollment(currentAccount, course, courseId);
                resolve({ success: true, course });
              } catch (error: any) {
                reject(error);
              }
            },
            onCancel: () => {
              setState({ step: 'idle', error: null, transactionHash: null, course: null, pendingConfirmation: null, showWalletDialog: false });
              // No rechazar con error, simplemente limpiar y no mostrar nada
              // El estado ya está en 'idle', así que no se mostrará ningún modal
            },
          },
        }));
      });
    }

    // Si no tiene precio, continuar directamente con la inscripción
    await processEnrollment(currentAccount, course, courseId);
    setState(prev => ({ ...prev, step: 'success' }));
    return { success: true, course };
  };

  const enroll = async (courseId: string) => {
    try {
      // Paso 1: Verificar wallet
      setState({ step: 'checking-wallet', error: null, transactionHash: null, course: null, pendingConfirmation: null, showWalletDialog: false });
      
      let currentAccount = account;
      
      if (!isConnected || !currentAccount) {
        // Mostrar diálogo de wallet para conectar
        return new Promise((resolve, reject) => {
          // Guardar callbacks y courseId para cuando se conecte la wallet
          enrollmentCallbacksRef.current = { resolve, reject, courseId };
          setState(prev => ({ ...prev, showWalletDialog: true }));
        });
      }
      
      if (!currentAccount) {
        throw new Error('No hay cuenta conectada');
      }

      // Continuar con el proceso de inscripción
      return await continueEnrollment(courseId, currentAccount);
    } catch (error: any) {
      console.error('Error enrolling:', error);
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error.message || 'Error enrolling in the course',
        pendingConfirmation: null,
        showWalletDialog: false,
      }));
      throw error;
    }
  };

  // Función auxiliar para procesar el pago y la inscripción
  const processPaymentAndEnrollment = async (
    currentAccount: any,
    course: Course,
    courseId: string
  ) => {
    // Paso 5: Obtener el signer
    setState(prev => ({ ...prev, step: 'signing-transaction' }));
    const walletSource = currentAccount.source as 'polkadot-js' | 'subwallet-js';
    const signer = await getSigner(walletSource);

    // Paso 6: Realizar el pago
    setState(prev => ({ ...prev, step: 'waiting-confirmation' }));
    const paymentResult = await makePayment(currentAccount.address, course.price!, signer);

    if (!paymentResult.success) {
      // Si el usuario canceló la transacción, resetear sin mostrar error
      if (paymentResult.error?.toLowerCase().includes('cancelada')) {
        setState({ step: 'idle', error: null, transactionHash: null, course: null, pendingConfirmation: null, showWalletDialog: false });
        return;
      }
      throw new Error(paymentResult.error || 'Error processing payment');
    }

    const transactionHash = paymentResult.transactionHash;
    const paymentAmount = course.price!;

    setState(prev => ({ ...prev, transactionHash: transactionHash || null }));

    // Paso 7: Verificar el pago con el backend
    setState(prev => ({ ...prev, step: 'verifying-payment' }));
    const verification = await paymentVerificationService.verifyPayment({
      transactionHash: transactionHash!,
      amount: paymentAmount,
      senderAddress: currentAccount.address,
    });

    if (!verification.success || !verification.data?.valid) {
      throw new Error(verification.error || 'Error verifying payment');
    }

    // Paso 8: Inscribirse en el curso
    await processEnrollment(currentAccount, course, courseId, transactionHash, paymentAmount);
    setState(prev => ({ ...prev, step: 'success' }));
  };

  // Función auxiliar para procesar la inscripción
  const processEnrollment = async (
    currentAccount: any,
    course: Course,
    courseId: string,
    transactionHash?: string,
    paymentAmount?: number
  ) => {
    setState(prev => ({ ...prev, step: 'enrolling' }));
    await enrollmentService.enrollWithWallet({
      walletAddress: currentAccount.address,
      courseId: course.id,
      transactionHash,
      amount: paymentAmount,
    });
  };


  const reset = () => {
    setState({ 
      step: 'idle', 
      error: null, 
      transactionHash: null, 
      course: null, 
      pendingConfirmation: null,
      showWalletDialog: false,
    });
  };

  const handleConfirm = () => {
    if (state.pendingConfirmation) {
      state.pendingConfirmation.onConfirm();
    }
  };

  const handleCancel = () => {
    if (state.pendingConfirmation) {
      state.pendingConfirmation.onCancel();
    }
  };

  const handleWalletConnected = async (account: any) => {
    // Obtener los callbacks guardados
    const { resolve, reject, courseId } = enrollmentCallbacksRef.current;
    
    if (!account) {
      setState(prev => ({ ...prev, showWalletDialog: false, step: 'error', error: 'No se pudo conectar la wallet' }));
      if (reject) reject(new Error('No se pudo conectar la wallet'));
      enrollmentCallbacksRef.current = {};
      return;
    }

    if (!courseId) {
      setState(prev => ({ ...prev, showWalletDialog: false, step: 'error', error: 'No se encontró el ID del curso' }));
      if (reject) reject(new Error('No se encontró el ID del curso'));
      enrollmentCallbacksRef.current = {};
      return;
    }

    try {
      // Cerrar el diálogo de wallet
      setState(prev => ({ ...prev, showWalletDialog: false }));
      
      // Esperar un momento para que el contexto se actualice
      await new Promise(res => setTimeout(res, 200));
      
      // Obtener el account actualizado del contexto
      // El contexto ya se actualizó cuando se conectó la wallet
      const currentAccount = walletContext.account || account;
      
      // Continuar directamente con el proceso de inscripción (sin volver a verificar wallet)
      const result = await continueEnrollment(courseId, currentAccount);
      if (resolve) resolve(result);
    } catch (error: any) {
      // Actualizar el estado con el error antes de rechazar
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error.message || 'Error enrolling in the course',
        showWalletDialog: false,
      }));
      
      if (reject) reject(error);
    } finally {
      enrollmentCallbacksRef.current = {};
    }
  };

  const handleWalletDialogCancel = () => {
    setState({ step: 'idle', error: null, transactionHash: null, course: null, pendingConfirmation: null, showWalletDialog: false });
    const { reject } = enrollmentCallbacksRef.current;
    // No rechazar con error, simplemente limpiar y no mostrar nada
    // El estado ya está en 'idle', así que no se mostrará ningún modal
    enrollmentCallbacksRef.current = {};
  };

  return {
    enroll,
    reset,
    state,
    handleConfirm,
    handleCancel,
    handleWalletConnected,
    handleWalletDialogCancel,
  };
}

