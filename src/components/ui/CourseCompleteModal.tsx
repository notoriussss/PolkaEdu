'use client';
import { useRouter } from 'next/navigation';

interface CourseCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}

export default function CourseCompleteModal({ 
  isOpen, 
  onClose, 
  courseName = 'Introducción a Polkadot' 
}: CourseCompleteModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleViewCertificate = () => {
    onClose();
    router.push('/my-certificates');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#222222] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#E6007A] mb-4 text-center">
          Course Completed!
        </h2>

        <p className="text-white text-base mb-6 text-center leading-relaxed">
          You have completed the course <span className="font-semibold">"{courseName}"</span>. 
          Your NFT certificate has been issued and is available in your wallet.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleViewCertificate}
            className="px-6 py-2 bg-[#E6007A] text-white rounded-md font-semibold hover:bg-[#990052] transition-colors"
          >
            View Certificate
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#444444] text-white rounded-md font-semibold hover:bg-[#555555] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

