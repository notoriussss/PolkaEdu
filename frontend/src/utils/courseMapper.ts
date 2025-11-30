/**
 * Utilidades para mapear cursos del backend al formato de la UI
 */

import { Course } from '@/src/types/course';

/**
 * Determina el nivel del curso basado en su duración
 */
const getLevelFromDuration = (duration: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (duration >= 30) {
    return 'Advanced';
  } else if (duration >= 15) {
    return 'Intermediate';
  }
  return 'Beginner';
};

/**
 * Mapea un curso del backend al formato esperado por CourseCard en la página de exploración
 */
export const mapCourseToCard = (course: Course) => {
  const level = getLevelFromDuration(course.duration);
  const category = course.instructor || 'General';

  return {
    id: course.id,
    image: course.imageUrl || '/polka1.svg',
    title: course.title,
    category,
    level,
    enrolled: 0, // El backend no tiene este dato por ahora
    description: course.description,
    rating: 4.5, // Valor por defecto, el backend no tiene rating por ahora
    reviews: 0,
    duration: `${course.duration} hours`,
    price: course.price,
  };
};

/**
 * Mapea un curso del backend al formato esperado por CourseCard en la página principal (home)
 */
export const mapCourseToHomeCard = (course: Course, imageIndex?: number) => {
  const level = getLevelFromDuration(course.duration);
  
  // Usar imágenes rotativas si no hay imageUrl
  const images = ['/polka1.svg', '/polka2.svg', '/polka3.svg', '/polka4.svg', '/polka5.svg', '/polka6.svg'];
  const imageIndexToUse = imageIndex !== undefined ? imageIndex % images.length : Math.floor(Math.random() * images.length);
  const image = course.imageUrl || images[imageIndexToUse];

  // Mapear instructor a categoría
  const categoryMap: Record<string, string> = {
    'Polkadot Academy': 'Fundamentals',
    'Substrate Developers': 'Blockchain',
    'NFT Experts': 'DeFi & NFTs',
  };
  const category = categoryMap[course.instructor] || course.instructor || 'General';

  return {
    title: course.title,
    image,
    imageAlt: course.title,
    users: 0, // El backend no tiene este dato por ahora
    rating: 4.5, // Valor por defecto
    categoryTag: { name: category },
    levelTag: { 
      name: level, 
      color: level === 'Advanced' ? 'red' as const : level === 'Intermediate' ? 'yellow' as const : 'green' as const 
    },
    description: course.description, // Agregar descripción
  };
};

