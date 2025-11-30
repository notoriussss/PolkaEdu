/**
 * Componente de diálogo de alerta/información
 */

'use client';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  type?: 'info' | 'success' | 'error' | 'warning';
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  buttonText = 'Accept',
  onClose,
  type = 'info',
}: AlertDialogProps) {
  if (!isOpen) return null;

  const typeColors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  const iconColors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-700">
        <div className="flex items-start gap-4 mb-4">
          {type === 'success' && (
            <div className={`w-12 h-12 ${typeColors[type]} rounded-full flex items-center justify-center flex-shrink-0`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {type === 'error' && (
            <div className={`w-12 h-12 ${typeColors[type]} rounded-full flex items-center justify-center flex-shrink-0`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          {(type === 'info' || type === 'warning') && (
            <div className={`w-12 h-12 ${typeColors[type]} rounded-full flex items-center justify-center flex-shrink-0`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-neutral-300">{message}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-800 hover:bg-pink-700 rounded-lg text-white font-bold transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

