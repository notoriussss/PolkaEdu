'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MetricsCard from "@/src/components/ui/MetricsCard";
import CourseStatusCard from "@/src/components/ui/CourseStatusCard";
import { enrollmentService, Enrollment } from '@/src/services/enrollment.service';
import { useWallet } from '@/src/contexts/WalletContext';
import { courseService } from '@/src/services/course.service';

export default function MyLearning() {
  const router = useRouter();
  const { isConnected, account } = useWallet();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!isConnected || !account?.address) {
        setLoading(false);
        setEnrollments([]);
        setAllEnrollments([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userEnrollments = await enrollmentService.getEnrollmentsByWallet(account.address);
        
        // Guardar todos los enrollments para calcular métricas
        setAllEnrollments(userEnrollments);
        
        // Filtrar solo cursos en progreso (no completados) para mostrar en la lista
        const inProgressEnrollments = userEnrollments.filter(e => !e.completed);
        setEnrollments(inProgressEnrollments);
      } catch (err: any) {
        console.error('Error al cargar inscripciones:', err);
        setError('Error loading your courses. Please try again.');
        setEnrollments([]);
        setAllEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, [isConnected, account?.address]);

  // Calcular métricas usando TODOS los enrollments (completados y en progreso)
  const completedCount = allEnrollments.filter(e => e.completed && e.certificate).length;
  const totalHours = allEnrollments.reduce((acc, e) => {
    const courseHours = e.course?.duration || 0;
    if (e.completed) {
      // Si está completado, contar todas las horas del curso
      return acc + courseHours;
    } else {
      // Si está en progreso, contar solo las horas completadas según el progreso
      const progressHours = Math.round((courseHours * (e.progress || 0)) / 100);
      return acc + progressHours;
    }
  }, 0);
  const inProgressCount = allEnrollments.filter(e => !e.completed).length;

  const handleResume = (enrollment: Enrollment) => {
    if (enrollment.courseId) {
      router.push(`/course-detail?courseId=${enrollment.courseId}`);
    }
  };

  const handleDelete = async (enrollment: Enrollment) => {
    if (confirm('Are you sure you want to remove this course from your list?')) {
      // Por ahora solo removemos de la lista local
      // En el futuro se podría agregar un endpoint para eliminar inscripciones
      setEnrollments(prev => prev.filter(e => e.id !== enrollment.id));
    }
  };

  const getNextModule = (enrollment: Enrollment): string => {
    if (!enrollment.course?.lessons || enrollment.course.lessons.length === 0) {
      return 'Module 1';
    }
    
    const totalLessons = enrollment.course.lessons.length;
    const completedLessons = Math.floor((enrollment.progress / 100) * totalLessons);
    const nextLessonIndex = completedLessons;
    
    if (nextLessonIndex >= totalLessons) {
      return 'Course completed';
    }
    
    const nextLesson = enrollment.course.lessons[nextLessonIndex];
    return `Module ${nextLesson.order}: ${nextLesson.title}`;
  };

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      <div className="p-10">
        <div>
          <h1 className="text-4xl font-bold">My 
          <span className="text-[#E6007A]"> Learning</span></h1>
          <p className="mt-2 justify-start text-xl text-[#FBFBFB66] font-bold">
          Resume your progress, complete modules and get your NFT certificates. The decentralized future awaits you!
          </p>
        </div>
        
        {!isConnected ? (
          <div className="mt-10 text-center py-20">
            <p className="text-[#FBFBFB66] text-xl">
              Please connect your wallet to view your courses
            </p>
          </div>
        ) : loading ? (
          <div className="mt-10 text-center py-20">
            <p className="text-[#FBFBFB66] text-xl">Loading your courses...</p>
          </div>
        ) : error ? (
          <div className="mt-10 text-center py-20">
            <p className="text-red-400 text-xl">{error}</p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex gap-10 justify-center">
              <MetricsCard text="Certificates Obtained" value={String(completedCount)}/>
              <MetricsCard text="Total Hours" value={String(totalHours)}/>
              <MetricsCard text="Courses in Progress" value={String(inProgressCount)}/>
            </div>
            <div className="mt-10">
              <h2 className="text-2xl font-bold">Active Courses</h2>
              {enrollments.length === 0 ? (
                <div className="mt-7 text-center py-10">
                  <p className="text-[#FBFBFB66] text-lg">
                    You don't have any courses in progress. Explore our courses to get started!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 mt-7">
                  {enrollments.map((enrollment) => (
                    <CourseStatusCard 
                      key={enrollment.id}
                      title={enrollment.course?.title || 'Untitled Course'} 
                      nextModule={getNextModule(enrollment)}
                      status={enrollment.completed ? "Completed" : "In Progress"} 
                      progress={enrollment.progress || 0} 
                      duration={`${enrollment.course?.duration || 0} Hours`}
                      onResume={() => handleResume(enrollment)}
                      onDelete={() => handleDelete(enrollment)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
