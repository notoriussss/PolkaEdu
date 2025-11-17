'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/src/components/ui/CourseCard";
import FeatureCard from "@/src/components/ui/FeatureCard";
import EducationIcon from "@/src/components/icons/education";
import CodeIcon from "@/src/components/icons/code";
import UsersIcon from "@/src/components/icons/users";
import CertificateIcon from "@/src/components/icons/certificate";
import GovernanceIcon from "@/src/components/icons/governance";
import { courseService } from '@/src/services/course.service';
import { Course } from '@/src/types/course';
import { mapCourseToHomeCard } from '@/src/utils/courseMapper';
import { useEnrollment } from '@/src/hooks/useEnrollment';
import EnrollmentModal from '@/src/components/ui/EnrollmentModal';
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';
import WalletConnectDialog from '@/src/components/ui/WalletConnectDialog';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const visibleBlocks = 3;
  const router = useRouter();
  
  const { enroll, reset, state: enrollmentState, handleConfirm, handleCancel, handleWalletConnected, handleWalletDialogCancel } = useEnrollment();
  
  // Cargar cursos del backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await courseService.getAllCourses();
        // Tomar los primeros 6 cursos como destacados
        setCourses(fetchedCourses.slice(0, 6));
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        // En caso de error, usar cursos vacíos (no mostrar nada)
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Cursos de fallback (solo se usan si no hay cursos del backend)
  const fallbackCourses = [
    {
      title: "Introducción a Polkadot",
      image: "/polka1.svg",
      imageAlt: "Introduccion a Polkadot",
      users: 1250,
      rating: 4.8,
      categoryTag: { name: "Fundamentos" },
      levelTag: { name: "Beginner", color: "green" as const },
    },
    {
      title: "Desarrollo en substrate",
      image: "/polka2.svg",
      imageAlt: "Desarrollo en substrate",
      users: 890,
      rating: 4.9,
      categoryTag: { name: "Blockchain" },
      levelTag: { name: "Intermediate", color: "yellow" as const },
    },
    {
      title: "Smart Contracts con Ink!",
      image: "/polka3.svg",
      imageAlt: "Smart Contracts con Ink!",
      users: 645,
      rating: 4.8,
      categoryTag: { name: "Programación" },
      levelTag: { name: "Advanced", color: "red" as const },
    },
    {
      title: "Introducción a la Gobernanza Descentralizada (DAO)",
      image: "/polka4.svg",
      imageAlt: "Introducción a la Gobernanza Descentralizada (DAO)",
      users: 1150,
      rating: 4.5,
      categoryTag: { name: "Gobernanza" },
      levelTag: { name: "Beginner", color: "green" as const },
    },
    {
      title: "Integración dApps con Polkadot.js API y React",
      image: "/polka5.svg",
      imageAlt: "Integración dApps con Polkadot.js API y React",
      users: 885,
      rating: 4.9,
      categoryTag: { name: "Programación" },
      levelTag: { name: "Intermediate", color: "yellow" as const },
    },
    {
      title: "Creando NFTs Coleccionables en la red",
      image: "/polka6.svg",
      imageAlt: "Creando NFTs Coleccionables en la red",
      users: 741,
      rating: 4.7,
      categoryTag: { name: "DeFi & NFTs" },
      levelTag: { name: "Intermediate", color: "yellow" as const },
    },
  ];

  // Usar cursos del backend si están disponibles, sino usar fallback
  const coursesToDisplay = courses.length > 0 
    ? courses.map((course, index) => mapCourseToHomeCard(course, index))
    : fallbackCourses;
  
  const totalBlocks = coursesToDisplay.length;
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (totalBlocks - visibleBlocks + 1));
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (totalBlocks - visibleBlocks + 1)) % (totalBlocks - visibleBlocks + 1));
  };
  
  const blockWidth = `calc((100% - 2 * 3rem) / ${visibleBlocks})`;
  
  const handleEnroll = async (courseId: string) => {
    try {
      await enroll(courseId);
      // Si fue exitoso, recargar cursos después de un momento
      if (enrollmentState.step === 'success') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      // El error ya está manejado en el hook
    }
  };

  const blocks = coursesToDisplay.map((course, index) => {
    // Buscar el curso real para obtener el ID
    const realCourse = courses.find(c => c.title === course.title);
    const courseId = realCourse?.id;
    
    return (
      <CourseCard
        key={course.title || index}
        {...course}
        width={blockWidth}
        courseId={courseId}
        onEnroll={courseId ? () => handleEnroll(courseId) : undefined}
        isEnrolling={enrollmentState.step !== 'idle' && enrollmentState.course?.id === courseId}
      />
    );
  });
  return (
    <div className="min-h-screen relative">
      <div className="w-full inline-flex flex-col justify-start items-start overflow-hidden">

        {/* Imagen de Inicio */}
        <div className="self-stretch min-h-screen relative px-[5%] py-48 flex flex-col justify-start items-center gap-2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/home.svg')" }}>
          <h1 className="text-center justify-start text-neutral-50 text-6xl font-bold">Learn, Certify and Govern!</h1>
          <h2 className="text-center justify-start text-pink-600 text-4xl font-bold">The Decentralized Educational Platform of the Polkadot Ecosystem.</h2>
          <div className="w-[60%] text-center justify-start text-neutral-50 text-xl font-bold">Technology courses created by the community, certified as NFTs on the network and governed by a DAO. Built for the Polkadot hackathon.</div>
          <div className="inline-flex justify-start items-center gap-20">
            <Link href="/explore" className="h-[40%] px-12 py-[4%] bg-pink-800 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-pink-700 transition-colors cursor-pointer">
              <h2 className="text-center text-neutral-50 text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Explore Courses</h2>
            </Link>
            <Link href="/governance" className="h-[40%] px-12 py-[4%] bg-neutral-200 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-neutral-50 transition-colors cursor-pointer">
              <h2 className="text-center text-pink-800 text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Participate in the DAO</h2>
            </Link>
          </div>
        </div>

        {/* Datos */}
        <div className="self-stretch px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 relative bg-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25)]">
          <div className="w-full sm:w-[20%] inline-flex flex-col justify-between items-center">
            <h2 className="text-center text-pink-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">15.000+</h2>
            <div className="text-center text-neutral-50 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold">Active Students</div>
          </div>
          <div className="w-full sm:w-[20%] inline-flex flex-col justify-between items-center">
            <h2 className="text-center text-pink-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">120+</h2>
            <div className="text-center text-neutral-50 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold">Available Courses</div>
          </div>
          <div className="w-full sm:w-[20%] inline-flex flex-col justify-between items-center">
            <h2 className="text-center text-pink-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">480+</h2>
            <div className="text-center text-neutral-50 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold">Verified Instructors</div>
          </div>
          <div className="w-full sm:w-[20%] inline-flex flex-col justify-between items-center">
            <h2 className="text-center text-pink-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">45.000+</h2>
            <div className="text-center text-neutral-50 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold">Certificates Issued</div>
          </div>
        </div>

        {/* Cursos */}
        <div className="self-stretch py-8 sm:py-12 md:py-16 flex flex-col justify-between items-center overflow-hidden">
          <div className="w-[93%] flex flex-col justify-start items-start px-4">
            <h1 className="self-stretch justify-start text-neutral-50 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">Featured Courses</h1>
            <div className="self-stretch justify-start text-neutral-50/40 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl font-bold">Selection of technology courses for Web3 developers</div>
          </div>
          <div className="self-stretch min-h-[400px] mt-12 mb-12 px-2 sm:px-4 md:px-[3%] lg:px-[5%] relative flex items-center gap-2 sm:gap-4">
            {/* Boton Derecha */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="z-10 w-12 h-12 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shrink-0"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex-1 overflow-hidden min-h-[400px]">
              <div 
                className="flex gap-12 min-h-[400px] transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(calc(-${currentIndex} * ((100% - 2 * 3rem) / ${visibleBlocks} + 3rem)))` 
                }}
              >
                {blocks}
              </div>
            </div>

            {/* Boton Izquierda */}
            <button
              onClick={nextSlide}
              disabled={currentIndex === totalBlocks - visibleBlocks}
              className="z-10 w-12 h-12 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shrink-0"
              aria-label="Next"
            >
              <svg className="w-6 h-6 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <Link href="/explore"className="h-12 sm:h-16 md:h-20 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-pink-800 hover:bg-pink-700 rounded-3xl inline-flex justify-center items-center gap-2.5 transition-colors cursor-pointer">
            <h2 className="text-center justify-start text-neutral-50 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">View All Courses</h2>
          </Link>
        </div>

        {/* Por qué elegir PolkaEdu? */}
        <div className="self-stretch py-4 sm:py-6 md:py-8 lg:py-12 bg-neutral-900 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14 overflow-hidden">
          <div className="w-full py-8 relative px-4">
            <h1 className="left-1/2 transform -translate-x-1/2 top-0 absolute text-center flex flex-nowrap items-center justify-center gap-1 sm:gap-2 whitespace-nowrap">
              <span className="text-neutral-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-bold" style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>Why choose </span>
              <EducationIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 2xl:w-30 2xl:h-30 text-pink-600 ml-1 sm:ml-2 md:ml-3 lg:ml-4 xl:ml-5 shrink-0" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))' }} />
              <span className="text-neutral-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-bold" style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>Polka<span className="text-pink-600" style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>Edu</span></span>
              <span className="text-neutral-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-bold" style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>?</span></h1>
          </div>
          <div className="w-[93%] grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4">
            <FeatureCard
              icon={CodeIcon}
              title="Updated Content"
              description="Courses created by experts from the Polkadot community, always up to date with the latest technologies."
            />
            <FeatureCard
              icon={UsersIcon}
              title="Global Community"
              description="Get unique certificates as NFTs on the blockchain, verifiable and permanent on the Polkadot network."
            />
            <FeatureCard
              icon={CertificateIcon}
              title="NFT Certificates"
              description="Receive verifiable blockchain certificates that demonstrate your achievements."
            />
            <FeatureCard
              icon={GovernanceIcon}
              title="DAO Governance"
              description="Participate in platform decisions through our decentralized governance system."
            />
          </div>
        </div>


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
