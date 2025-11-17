'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CourseInfo from "@/src/components/ui/CourseInfo";
import UnitsCarousel from "@/src/components/ui/UnitsCarousel";
import UnitContent from "@/src/components/ui/UnitContent";
import CourseCompleteModal from "@/src/components/ui/CourseCompleteModal";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { courseService } from '@/src/services/course.service';
import { Course, Lesson } from '@/src/types/course';
import { enrollmentService, Enrollment } from '@/src/services/enrollment.service';
import { useWallet } from '@/src/contexts/WalletContext';

interface MaterialApoyo {
  videos?: Array<{
    url: string;
    titulo: string;
    duracion: string;
  }>;
  imagenes?: Array<{
    url: string;
    titulo: string;
    descripcion: string;
  }>;
}

interface Unit {
  orden: number;
  titulo: string;
  texto: string;
  materialApoyo?: MaterialApoyo;
  completed: boolean;
  lessonId?: string; // ID de la lección para actualizar progreso
}

export default function CourseDetail(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const { isConnected, account } = useWallet();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrollment, setEnrollment] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

    // Cargar curso y lecciones
    useEffect(() => {
        const loadCourse = async () => {
        if (!courseId) {
            setError('No course specified');
            setLoading(false);
            return;
        }

            try {
                setLoading(true);
                setError(null);
                
                // Cargar curso del backend
                const fetchedCourse = await courseService.getCourseById(courseId);
                setCourse(fetchedCourse);

                // Convertir lecciones a Units
                let initialUnits: Unit[] = [];
                if (fetchedCourse.lessons && fetchedCourse.lessons.length > 0) {
                    initialUnits = fetchedCourse.lessons.map((lesson: Lesson) => ({
                        orden: lesson.order,
                        titulo: lesson.title,
                        texto: lesson.content,
                        completed: false, // Se actualizará con el progreso
                        lessonId: lesson.id,
                        materialApoyo: undefined // Las lecciones del backend no tienen materialApoyo por ahora
                    }));
                }

                // Cargar inscripción del usuario si está conectado
                if (isConnected && account?.address) {
                    try {
                        const enrollments = await enrollmentService.getEnrollmentsByWallet(account.address);
                        const userEnrollment = enrollments.find(e => e.courseId === courseId);
                        if (userEnrollment) {
                            setEnrollment(userEnrollment);
                            
                            // Si el curso está completado, marcar todas las unidades como completadas
                            // Si no, calcular cuántas están completadas basado en el progreso
                            if (userEnrollment.completed) {
                                initialUnits = initialUnits.map((unit) => ({
                                    ...unit,
                                    completed: true
                                }));
                            } else {
                                const totalLessons = initialUnits.length;
                                const completedLessons = Math.floor((userEnrollment.progress / 100) * totalLessons);
                                
                                initialUnits = initialUnits.map((unit, index) => ({
                                    ...unit,
                                    completed: index < completedLessons
                                }));
                            }
                        }
                    } catch (err) {
                        console.error('Error loading enrollment:', err);
                    }
                }
                
                setUnits(initialUnits);
            } catch (err: any) {
                console.error('Error loading course:', err);
                setError('Error loading the course. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [courseId, isConnected, account?.address]);

    const firstIncompleteUnit = useMemo(() => {
        return units.find(unit => !unit.completed) || units[0];
    }, [units]);

    const [selectedUnitOrden, setSelectedUnitOrden] = useState<number>(1);
    const selectedUnit = units.find(unit => unit.orden === selectedUnitOrden) || null;

    useEffect(() => {
        // Solo cambiar la unidad seleccionada automáticamente si:
        // 1. Hay unidades disponibles
        // 2. No estamos completando el curso
        // 3. El curso no está ya completado
        // 4. Hay una unidad incompleta
        if (firstIncompleteUnit && units.length > 0 && !isCompleting && !enrollment?.completed) {
            setSelectedUnitOrden(firstIncompleteUnit.orden);
        }
    }, [firstIncompleteUnit, units.length, isCompleting, enrollment?.completed]);

    const isFirstUnit = units.length > 0 && selectedUnitOrden === units[0]?.orden;
    const isLastUnit = units.length > 0 && selectedUnitOrden === units[units.length - 1]?.orden;
    
    // Verificar si todas las unidades están completadas
    const allUnitsCompleted = units.length > 0 && units.every(unit => unit.completed);

    const handlePrevious = () => {
        if (!isFirstUnit) {
            const currentIndex = units.findIndex(unit => unit.orden === selectedUnitOrden);
            setSelectedUnitOrden(units[currentIndex - 1].orden);
        }
    };

    const handleNext = async () => {
        // Si estamos en la última unidad, no hacer nada (debe usar handleCompleteCourse)
        if (isLastUnit) {
            return;
        }
        
        // Si el curso está completado, no permitir actualizar progreso
        if (enrollment?.completed) {
            return;
        }
        
        if (enrollment) {
            try {
                setIsUpdatingProgress(true);
                
                // Marcar unidad como completada
                setUnits(prevUnits => 
                    prevUnits.map(unit => 
                        unit.orden === selectedUnitOrden 
                            ? { ...unit, completed: true }
                            : unit
                    )
                );
                
                // Calcular nuevo progreso
                const completedUnits = units.filter(u => u.orden === selectedUnitOrden ? true : u.completed).length;
                const totalUnits = units.length;
                const newProgress = Math.min(100, Math.round((completedUnits / totalUnits) * 100));
                
                // Actualizar progreso en el backend
                await enrollmentService.updateProgress(enrollment.id, newProgress);
                
                // Actualizar enrollment local
                setEnrollment((prev: Enrollment | null) => prev ? { ...prev, progress: newProgress } : null);
                
                // Avanzar a la siguiente unidad
                const currentIndex = units.findIndex(unit => unit.orden === selectedUnitOrden);
                if (currentIndex < units.length - 1) {
                    setSelectedUnitOrden(units[currentIndex + 1].orden);
                }
            } catch (err) {
                console.error('Error updating progress:', err);
                // Revert local change if it fails
                setUnits(prevUnits => 
                    prevUnits.map(unit => 
                        unit.orden === selectedUnitOrden 
                            ? { ...unit, completed: false }
                            : unit
                    )
                );
            } finally {
                setIsUpdatingProgress(false);
            }
        } else {
            // If not enrolled, only advance visually
            const currentIndex = units.findIndex(unit => unit.orden === selectedUnitOrden);
            if (currentIndex < units.length - 1) {
                setSelectedUnitOrden(units[currentIndex + 1].orden);
            }
        }
    };

    const handleCompleteCourse = async () => {
        if (!enrollment) {
            alert('You must be enrolled in the course to complete it.');
            return;
        }

        // Verificar que el curso no esté ya completado
        if (enrollment.completed) {
            // Si ya está completado, solo redirigir
            router.push('/my-certificates');
            return;
        }

        try {
            setIsCompleting(true);
            
            // Asegurar que todas las unidades estén marcadas como completadas localmente
            // Esto incluye la última unidad si aún no está marcada
            setUnits(prevUnits => 
                prevUnits.map(unit => ({ ...unit, completed: true }))
            );
            
            // Completar curso en el backend (esto actualizará el progreso a 100% y emitirá el NFT)
            // NO llamamos a updateProgress antes, completeCourse se encarga de todo
            await enrollmentService.completeCourse(enrollment.id);
            
            // Actualizar enrollment local
            setEnrollment((prev: Enrollment | null) => prev ? { ...prev, completed: true, progress: 100 } : null);
            
            // Redirigir a my-certificates después de un breve delay para mostrar el modal
            setIsModalOpen(true);
            
            // Cerrar el modal y redirigir después de 2 segundos
            setTimeout(() => {
                setIsModalOpen(false);
                router.push('/my-certificates');
            }, 2000);
            
        } catch (err: any) {
            console.error('Error completing course:', err);
            const errorMessage = err.message || 'Unknown error';
            
            // If the error is only about the NFT but the course was completed, don't show error
            // The backend already handles this by creating a pending certificate
            if (errorMessage.includes('WebSocket') || errorMessage.includes('not connected') || 
                errorMessage.includes('blockchain') || errorMessage.includes('NFT')) {
                // Course was completed but NFT failed - this is handled by the backend
                // Show informative message but continue with normal flow
                console.log('NFT could not be issued, but the course was completed successfully');
                
                // Update local enrollment assuming it was completed
                setEnrollment((prev: Enrollment | null) => prev ? { ...prev, completed: true, progress: 100 } : null);
                
                // Show modal and redirect normally
                setIsModalOpen(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/my-certificates');
                }, 2000);
            } else if (errorMessage.includes('already completed') || errorMessage.includes('ya está completado')) {
                // If the course was already completed, simply redirect
                router.push('/my-certificates');
            } else {
                // Real error that prevents completing the course
                alert('Error completing the course: ' + errorMessage);
            }
        } finally {
            setIsCompleting(false);
        }
    };

    const handleBack = () => {
        router.push('/my-learning');
    };

    if (loading) {
        return (
            <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading course...</div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">{error || 'Course not found'}</div>
            </div>
        );
    }

    return (
        <div className="bg-[#1A1A1A] min-h-screen">
            <CourseInfo 
                title={course.title} 
                module={`Module ${selectedUnitOrden}`} 
                onBack={handleBack} 
            />
            <div className="p-10">
                <div className="flex flex-col gap-6">
                    <UnitsCarousel 
                        units={units} 
                        onUnitSelect={setSelectedUnitOrden}
                        initialSelectedUnit={selectedUnitOrden}
                    />
                    <UnitContent unit={selectedUnit} />
                    <div className="w-full border-b border-[#E6007A] my-4"></div>
                    <div className="flex items-center justify-between px-4">
                        <button 
                            onClick={handlePrevious}
                            disabled={isFirstUnit || enrollment?.completed}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-colors
                                ${isFirstUnit || enrollment?.completed
                                    ? 'bg-[#2A2A2A] text-white/40 cursor-not-allowed' 
                                    : 'bg-[#EA007A] text-white cursor-pointer hover:bg-[#990052]'
                                }
                            `}
                        > 
                            <ArrowLeftIcon className="w-5 h-5"/>Previous
                        </button>
                        {isLastUnit ? (
                            enrollment?.completed ? (
                                <div className="flex items-center gap-2 px-6 py-2 rounded-md font-bold text-sm bg-green-700 text-white">
                                    ✓ Course Completed
                                </div>
                            ) : (
                                <button 
                                    onClick={handleCompleteCourse}
                                    disabled={isCompleting || !enrollment}
                                    className="flex items-center gap-2 px-6 py-2 rounded-md font-bold text-sm bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                > 
                                    {isCompleting ? 'Completing...' : 'Complete Course'}
                                </button>
                            )
                        ) : (
                            <button 
                                onClick={handleNext}
                                disabled={isUpdatingProgress || enrollment?.completed}
                                className="flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm bg-[#EA007A] text-white cursor-pointer hover:bg-[#990052] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            > 
                                {isUpdatingProgress ? 'Saving...' : 'Next'} <ArrowRightIcon className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <CourseCompleteModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    if (enrollment?.completed) {
                        router.push('/my-certificates');
                    }
                }}
                courseName={course.title}
            />
        </div>
    );
}
