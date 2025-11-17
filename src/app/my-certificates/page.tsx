"use client"

import { useState, useEffect } from 'react';
import Certificado from "@/src/components/misc/certificado";
import Pagination from '@/src/components/ui/Pagination';
import { enrollmentService, Enrollment } from '@/src/services/enrollment.service';
import { useWallet } from '@/src/contexts/WalletContext';

const COURSES_PER_PAGE = 6;

// Función para determinar el nivel basado en la duración
const getLevelFromDuration = (duration: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (duration >= 40) return 'Advanced';
  if (duration >= 20) return 'Intermediate';
  return 'Beginner';
};

// Función para mapear instructor a categoría
const getCategoryFromInstructor = (instructor: string): string => {
  const categoryMap: Record<string, string> = {
    'Polkadot Academy': 'Blockchain',
    'Substrate Developers': 'Development',
    'NFT Experts': 'NFTs',
  };
  return categoryMap[instructor] || instructor || 'General';
};

export default function MyCertificates() {
  const [currentPage, setCurrentPage] = useState(1);
  const [certificates, setCertificates] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, account } = useWallet();

  useEffect(() => {
    const loadCertificates = async () => {
      if (!isConnected || !account?.address) {
        setLoading(false);
        setCertificates([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const enrollments = await enrollmentService.getEnrollmentsByWallet(account.address);
        
        // Filtrar solo las inscripciones completadas que tengan certificado
        const completedWithCertificates = enrollments.filter(
          enrollment => {
            const hasCertificate = enrollment.certificate !== undefined && enrollment.certificate !== null;
            const isCompleted = enrollment.completed === true;
            const hasCourse = enrollment.course !== undefined && enrollment.course !== null;
            
            return isCompleted && hasCertificate && hasCourse;
          }
        );
        
        setCertificates(completedWithCertificates);
      } catch (err: any) {
        console.error('Error al cargar certificados:', err);
        setError('Error al cargar tus certificados. Por favor, intenta de nuevo.');
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [isConnected, account?.address]);

  const totalPages = Math.ceil(certificates.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const currentCertificates = certificates.slice(startIndex, endIndex);

  // Mapear certificados al formato del componente Certificado
  const certificateCards = currentCertificates.map((enrollment) => {
    const course = enrollment.course;
    const certificate = enrollment.certificate;
    
    if (!course) {
      return null;
    }

    if (!certificate) {
      return null;
    }

    // Usar imágenes por defecto si no hay imageUrl
    const images = ['/polka1.svg', '/polka2.svg', '/polka3.svg', '/polka4.svg', '/polka5.svg', '/polka6.svg'];
    // Calcular índice basado en el hash del ID
    const idHash = (certificate.id || enrollment.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = idHash % images.length;
    const image = course.imageUrl || images[imageIndex];

    const level = getLevelFromDuration(course.duration);
    const category = getCategoryFromInstructor(course.instructor);

    return (
      <Certificado
        key={enrollment.id}
        photoUrl={image}
        cuenta={certificate.nftTokenId || certificate.id || enrollment.id}
        curso={course.title || 'Untitled Course'}
        categoria={category}
        calificacion={4.5} // Valor por defecto, el backend no tiene rating
        link={`/course-detail?courseId=${course.id}`}
        usuarios={0} // El backend no tiene este dato
          descripcion={course.description || `Completion certificate for course ${course.title}`}
        tokenId={certificate.nftTokenId || certificate.id || enrollment.id}
        imageAlt={course.title || 'Certificate'}
        level={level}
        duration={`${course.duration || 0} hours`}
      />
    );
  }).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen flex-col pt-4 px-16 bg-white dark:bg-black">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">My NFT Certificates</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {isConnected 
              ? "NFT certificates you have obtained by completing courses"
              : "Connect your wallet to view your NFT certificates"}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-zinc-600 dark:text-zinc-400 text-lg">Loading certificates...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-red-600 dark:text-red-400 text-lg">{error}</div>
          </div>
        ) : !isConnected ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-zinc-600 dark:text-zinc-400 text-lg">
              Please connect your wallet to view your certificates
            </div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-zinc-600 dark:text-zinc-400 text-lg">
              You don't have any certificates yet. Complete a course to get your first NFT certificate.
            </div>
          </div>
        ) : (
          <div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {certificateCards}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
