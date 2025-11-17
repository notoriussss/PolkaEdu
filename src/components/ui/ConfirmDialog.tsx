/**
 * Componente de diálogo de confirmación
 */

'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-700">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-neutral-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-bold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-800 hover:bg-pink-700 rounded-lg text-white font-bold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

