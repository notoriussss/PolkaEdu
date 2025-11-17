'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Search from "@/src/components/ui/Search";
import CourseCard from "@/src/components/ui/CourseCard";
import { FunnelIcon } from '@heroicons/react/24/solid';
import Pagination from "@/src/components/ui/Pagination";
import { courseService } from '@/src/services/course.service';
import { Course } from '@/src/types/course';
import { mapCourseToCard } from '@/src/utils/courseMapper';
import { useEnrollment } from '@/src/hooks/useEnrollment';
import EnrollmentModal from '@/src/components/ui/EnrollmentModal';
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';
import WalletConnectDialog from '@/src/components/ui/WalletConnectDialog';

// Datos de prueba para los cursos (fallback)
const mockCourses = [
  {
    id: 1,
    image: "",
    title: "Introducción a Blockchain y Web3",
    category: "Blockchain",
    level: "Principiante" as const,
    enrolled: 50000,
    description: "Aprende los fundamentos de blockchain, criptomonedas y la tecnología Web3 desde cero. Perfecto para principiantes que quieren entender el ecosistema descentralizado.",
    rating: 4.8,
    reviews: 234,
    duration: "8 hours"
  },
  {
    id: 2,
    image: "",
    title: "Desarrollo de Smart Contracts con Solidity",
    category: "Desarrollo",
    level: "Intermedio" as const,
    enrolled: 120000,
    description: "Domina el desarrollo de contratos inteligentes en Ethereum usando Solidity. Aprende a crear DApps seguras y eficientes.",
    rating: 4.9,
    reviews: 156,
    duration: "20 hours"
  },
  {
    id: 3,
    image: "",
    title: "Polkadot: Desarrollo de Parachains",
    category: "Polkadot",
    level: "Avanzado" as const,
    enrolled: 200000,
    description: "Advanced course on parachain development in Polkadot. Learn to build interoperable applications in the Polkadot ecosystem.",
    rating: 4.7,
    reviews: 89,
    duration: "35 hours"
  },
  {
    id: 4,
    image: "",
    title: "NFTs y Mercados Digitales",
    category: "NFTs",
    level: "Intermedio" as const,
    enrolled: 80000,
    description: "Comprende el mundo de los NFTs, cómo crearlos, comercializarlos y construir mercados descentralizados.",
    rating: 4.6,
    reviews: 312,
    duration: "12 hours"
  },
  {
    id: 5,
    image: "",
    title: "DeFi: Finanzas Descentralizadas",
    category: "DeFi",
    level: "Intermedio" as const,
    enrolled: 150000,
    description: "Explora el ecosistema DeFi, aprende sobre lending, staking, yield farming y protocolos descentralizados.",
    rating: 4.8,
    reviews: 198,
    duration: "25 hours"
  },
  {
    id: 6,
    image: "",
    title: "Seguridad en Web3",
    category: "Seguridad",
    level: "Avanzado" as const,
    enrolled: 180000,
    description: "Aprende las mejores prácticas de seguridad en desarrollo Web3, auditoría de contratos inteligentes y prevención de vulnerabilidades.",
    rating: 4.9,
    reviews: 145,
    duration: "30 hours"
  },
  {
    id: 7,
    image: "",
    title: "Ethereum: Fundamentos y Desarrollo",
    category: "Blockchain",
    level: "Intermedio" as const,
    enrolled: 95000,
    description: "Profundiza en la plataforma Ethereum, aprende sobre la máquina virtual EVM y desarrolla aplicaciones descentralizadas.",
    rating: 4.7,
    reviews: 267,
    duration: "18 hours"
  },
  {
    id: 8,
    image: "",
    title: "Substrate: Construyendo Blockchains",
    category: "Polkadot",
    level: "Avanzado" as const,
    enrolled: 75000,
    description: "Aprende a construir blockchains personalizadas usando el framework Substrate de Polkadot.",
    rating: 4.8,
    reviews: 112,
    duration: "40 hours"
  },
  {
    id: 9,
    image: "",
    title: "Tokenomics y Economía de Cripto",
    category: "Blockchain",
    level: "Intermedio" as const,
    enrolled: 110000,
    description: "Comprende la economía detrás de las criptomonedas, diseño de tokens y modelos económicos descentralizados.",
    rating: 4.6,
    reviews: 189,
    duration: "15 hours"
  },
  {
    id: 10,
    image: "",
    title: "IPFS y Almacenamiento Descentralizado",
    category: "Desarrollo",
    level: "Intermedio" as const,
    enrolled: 68000,
    description: "Aprende a usar IPFS para almacenamiento descentralizado y construcción de aplicaciones Web3.",
    rating: 4.5,
    reviews: 143,
    duration: "10 hours"
  },
  {
    id: 11,
    image: "",
    title: "Web3.js y Ethers.js: Interactuando con Blockchain",
    category: "Desarrollo",
    level: "Principiante" as const,
    enrolled: 125000,
    description: "Domina las librerías principales para interactuar con Ethereum desde aplicaciones JavaScript.",
    rating: 4.8,
    reviews: 298,
    duration: "14 hours"
  },
  {
    id: 12,
    image: "",
    title: "DAO: Organizaciones Autónomas Descentralizadas",
    category: "Blockchain",
    level: "Intermedio" as const,
    enrolled: 87000,
    description: "Aprende sobre las DAOs, su funcionamiento, gobernanza y cómo crear tu propia organización descentralizada.",
    rating: 4.7,
    reviews: 176,
    duration: "16 hours"
  },
  {
    id: 13,
    image: "",
    title: "Metamask y Wallets Web3",
    category: "Desarrollo",
    level: "Principiante" as const,
    enrolled: 145000,
    description: "Integra wallets Web3 en tus aplicaciones, aprende sobre Metamask y otras soluciones de billetera.",
    rating: 4.9,
    reviews: 324,
    duration: "6 hours"
  },
  {
    id: 14,
    image: "",
    title: "Layer 2 Solutions: Optimism y Arbitrum",
    category: "Blockchain",
    level: "Avanzado" as const,
    enrolled: 72000,
    description: "Explora las soluciones de capa 2 para escalar Ethereum, aprende sobre rollups y sidechains.",
    rating: 4.6,
    reviews: 98,
    duration: "22 hours"
  },
  {
    id: 15,
    image: "",
    title: "GameFi: Juegos Blockchain",
    category: "NFTs",
    level: "Intermedio" as const,
    enrolled: 135000,
    description: "Descubre el mundo de los juegos blockchain, NFTs en juegos y modelos de economía de juegos.",
    rating: 4.8,
    reviews: 256,
    duration: "20 hours"
  },
  {
    id: 16,
    image: "",
    title: "Cross-Chain Bridges y Interoperabilidad",
    category: "Blockchain",
    level: "Avanzado" as const,
    enrolled: 65000,
    description: "Aprende sobre puentes entre blockchains y cómo lograr interoperabilidad entre diferentes redes.",
    rating: 4.7,
    reviews: 87,
    duration: "28 hours"
  },
  {
    id: 17,
    image: "",
    title: "Hardhat y Truffle: Frameworks de Desarrollo",
    category: "Desarrollo",
    level: "Intermedio" as const,
    enrolled: 118000,
    description: "Domina los frameworks más populares para desarrollo de smart contracts y testing.",
    rating: 4.8,
    reviews: 201,
    duration: "17 hours"
  },
  {
    id: 18,
    image: "",
    title: "Stablecoins y Monedas Estables",
    category: "DeFi",
    level: "Intermedio" as const,
    enrolled: 92000,
    description: "Comprende cómo funcionan las stablecoins, sus mecanismos y uso en el ecosistema DeFi.",
    rating: 4.6,
    reviews: 167,
    duration: "11 hours"
  }
];

const COURSES_PER_PAGE = 6;

export default function Explore() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { enroll, reset, state: enrollmentState, handleConfirm, handleCancel, handleWalletConnected, handleWalletDialogCancel } = useEnrollment();

  // Cargar cursos del backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCourses = await courseService.getAllCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Could not load courses. Please try again later.');
        // En caso de error, usar datos mock como fallback
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleSearch = (value: string) => {
    console.log('Buscando:', value);
    // Aquí puedes agregar la lógica de búsqueda
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await enroll(courseId);
      // Si fue exitoso, recargar después de un momento
      if (enrollmentState.step === 'success') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      // El error ya está manejado en el hook
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mapear cursos del backend al formato esperado
  const mappedCourses = courses.map(mapCourseToCard);
  
  // Si no hay cursos del backend, usar mockCourses como fallback
  const coursesToDisplay = mappedCourses.length > 0 ? mappedCourses : mockCourses;
  
  const totalPages = Math.ceil(coursesToDisplay.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const currentCourses = coursesToDisplay.slice(startIndex, endIndex);

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      <div className="p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Explore Courses</h1>
          <p className="mt-2 justify-start text-xl text-[#FBFBFB66] font-bold">Selection of technology courses for Web3 developers</p>
        </div>
        <div className="mt-5 w-full h-10 flex justify-between">
          {/*buscador */}
          <Search 
            placeholder="Search courses..." 
            onSearch={handleSearch}
            className="w-2xl"
          />
          {/*filtro */}
          <div className="relative rounded-2xl px-5 py-2 outline outline-1 outline-offset-[-1px] outline-zinc-500 overflow-hidden text-neutral-50/75 flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-neutral-50/50"/>
            <span>Filter by...</span>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="mt-10 text-center">
            <p className="text-neutral-50 text-xl">Loading courses...</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && !loading && (
          <div className="mt-10 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Grid de cursos */}
        {!loading && (
          <>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  image={course.image}
                  title={course.title}
                  category={course.category}
                  level={course.level}
                  enrolled={course.enrolled}
                  description={course.description}
                  rating={course.rating}
                  reviews={course.reviews}
                  duration={course.duration}
                  courseId={String(course.id)}
                  onEnroll={() => handleEnroll(String(course.id))}
                  isEnrolling={enrollmentState.step !== 'idle' && enrollmentState.course?.id === String(course.id)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 justify-center flex w-full">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal de inscripción */}
      <EnrollmentModal
        step={enrollmentState.step}
        error={enrollmentState.error}
        transactionHash={enrollmentState.transactionHash}
        courseTitle={enrollmentState.course?.title || null}
        onClose={() => {
          reset();
          if (enrollmentState.step === 'success') {
            window.location.reload();
          }
        }}
      />
      
      {/* Diálogo de confirmación de pago */}
      {enrollmentState.pendingConfirmation && enrollmentState.pendingConfirmation.type === 'payment' && (
        <ConfirmDialog
          isOpen={true}
          title="Confirm Payment"
          message={enrollmentState.pendingConfirmation.message}
          confirmText="Pay"
          cancelText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      
      {/* Diálogo de conexión de wallet */}
      <WalletConnectDialog
        isOpen={enrollmentState.showWalletDialog}
        onConnected={handleWalletConnected}
        onCancel={handleWalletDialogCancel}
      />
    </div>
  );
}
