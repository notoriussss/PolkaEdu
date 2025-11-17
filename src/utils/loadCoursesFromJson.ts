/**
 * Utilidad para cargar cursos desde el archivo JSON
 */

import * as fs from 'fs';
import * as path from 'path';
import { CourseService } from '../services/course.service';

interface JsonUnidad {
  orden: number;
  titulo: string;
  texto: string;
  materialApoyo?: {
    videos?: Array<{
      url: string;
      titulo: string;
      duracion: string;
    }>;
    imagenes?: Array<{
      url: string;
      titulo: string;
      descripcion?: string;
    }>;
  };
}

interface JsonCurso {
  codigo: string;
  titulo: string;
  descripcion: string;
  precio: number;
  nivel: string;
  tipo: string;
  imageUrl?: string;
  unidades: JsonUnidad[];
}

interface JsonData {
  cursos: JsonCurso[];
}

/**
 * Convierte duración de formato "MM:SS" o "HH:MM:SS" a minutos
 */
function parseDurationToMinutes(duration: string): number {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    // Formato MM:SS
    return parts[0];
  } else if (parts.length === 3) {
    // Formato HH:MM:SS
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

/**
 * Calcula la duración total del curso en horas basándose en los videos
 */
function calculateCourseDuration(unidades: JsonUnidad[]): number {
  let totalMinutes = 0;
  
  unidades.forEach(unidad => {
    if (unidad.materialApoyo?.videos) {
      unidad.materialApoyo.videos.forEach(video => {
        totalMinutes += parseDurationToMinutes(video.duracion);
      });
    }
  });
  
  // Convertir minutos a horas (redondeado hacia arriba)
  // Si no hay videos, usar un valor por defecto basado en el número de unidades
  if (totalMinutes === 0) {
    return Math.max(1, unidades.length * 2); // Mínimo 1 hora, 2 horas por unidad por defecto
  }
  
  return Math.ceil(totalMinutes / 60);
}

/**
 * Mapea un instructor basado en el tipo de curso
 */
function mapInstructor(tipo: string, nivel: string): string {
  const instructorMap: Record<string, string> = {
    'Introduction': 'Polkadot Academy',
    'Programming': 'Substrate Developers',
    'DeFi': 'DeFi Experts',
  };
  
  return instructorMap[tipo] || `${tipo} Experts`;
}

/**
 * Carga cursos desde el archivo JSON y los crea en el sistema
 */
export async function loadCoursesFromJson(courseService: CourseService): Promise<number> {
  try {
    // La ruta debe ser relativa a la raíz del proyecto (donde está package.json)
    // En desarrollo: __dirname es backend/src/utils
    // En producción compilado: __dirname es backend/dist/utils
    const jsonPath = path.join(__dirname, '../../cursos-ejemplo.json');
    
    // Verificar que el archivo existe
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`No se encontró el archivo cursos-ejemplo.json en: ${jsonPath}`);
    }
    
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const data: JsonData = JSON.parse(jsonContent);

    let createdCount = 0;

    for (const jsonCurso of data.cursos) {
      try {
        // Calcular duración del curso
        const duration = calculateCourseDuration(jsonCurso.unidades);

        // Mapear unidades a lecciones
        const lessons = jsonCurso.unidades.map(unidad => ({
          title: unidad.titulo,
          description: unidad.titulo, // Usar el título como descripción
          content: unidad.texto,
          order: unidad.orden,
          duration: unidad.materialApoyo?.videos?.reduce((acc, video) => {
            return acc + parseDurationToMinutes(video.duracion);
          }, 0) || 30, // 30 minutos por defecto si no hay videos
        }));

        // Crear el curso
        await courseService.createCourse({
          title: jsonCurso.titulo,
          description: jsonCurso.descripcion,
          instructor: mapInstructor(jsonCurso.tipo, jsonCurso.nivel),
          duration: duration,
          price: jsonCurso.precio,
          imageUrl: jsonCurso.imageUrl,
          lessons: lessons,
        });

        createdCount++;
      } catch (error) {
        console.error(`Error al crear el curso ${jsonCurso.codigo}:`, error);
      }
    }

    return createdCount;
  } catch (error) {
    console.error('Error al cargar cursos desde JSON:', error);
    throw error;
  }
}

