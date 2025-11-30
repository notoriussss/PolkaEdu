/**
 * Modal que muestra el progreso de la inscripción
 */

'use client';

import { EnrollmentStep } from '@/src/hooks/useEnrollment';

interface EnrollmentModalProps {
  step: EnrollmentStep;
  error: string | null;
  transactionHash: string | null;
  courseTitle: string | null;
  onClose: () => void;
}

const stepMessages: Record<EnrollmentStep, string> = {
  idle: '',
  'checking-wallet': 'Checking wallet...',
  'checking-enrollment': 'Checking enrollment...',
  'loading-course': 'Loading course information...',
  'confirming-payment': 'Confirming payment...',
  'signing-transaction': 'Signing transaction...',
  'waiting-confirmation': 'Waiting for blockchain confirmation...',
  'verifying-payment': 'Verifying payment...',
  enrolling: 'Enrolling in course...',
  success: 'Enrollment successful!',
  error: 'Enrollment error',
};

export default function EnrollmentModal({
  step,
  error,
  transactionHash,
  courseTitle,
  onClose,
}: EnrollmentModalProps) {
  if (step === 'idle') {
    return null;
  }

  const isLoading = step !== 'success' && step !== 'error';
  const showCloseButton = step === 'success' || step === 'error';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-700">
        <div className="flex flex-col items-center gap-4">
          {isLoading && (
            <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
          )}
          
          {step === 'success' && (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {step === 'error' && (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {stepMessages[step]}
            </h3>
            
            {courseTitle && (
              <p className="text-neutral-400 text-sm mb-2">
                {courseTitle}
              </p>
            )}

            {transactionHash && (
              <p className="text-xs text-neutral-500 font-mono break-all mt-2">
                TX: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </p>
            )}

            {error && (
              <p className="text-red-400 text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-pink-800 hover:bg-pink-700 rounded-lg text-white font-bold transition-colors"
            >
              {step === 'success' ? 'Continue' : 'Close'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

