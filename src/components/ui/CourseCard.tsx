'use client';

import Link from "next/link";
import UsersIcon from "@/src/components/icons/users";
import StarIcon from "@/src/components/icons/star";

interface CourseCardProps {
  title: string;
  image: string;
  imageAlt?: string;
  users?: number;
  rating: number;
  categoryTag?: { name: string };
  levelTag?: { name: string; color: "green" | "yellow" | "red" };
  width?: string;
  // Props de la versión HEAD para compatibilidad
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled?: number;
  description?: string;
  reviews?: number;
  duration?: string;
  onEnroll?: () => void;
  courseId?: string; // ID del curso para inscripción
  isEnrolling?: boolean; // Estado de carga
  onClick?: () => void; // Callback para cuando se hace click en la tarjeta
}

const levelColors = {
  green: { bg: "bg-green-100", text: "text-green-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
};

const levelNameToColor: Record<string, "green" | "yellow" | "red"> = {
  'Beginner': 'green',
  'Intermediate': 'yellow',
  'Advanced': 'red'
};

export default function CourseCard({
  title,
  image,
  imageAlt,
  users,
  rating,
  categoryTag,
  levelTag,
  width,
  // Props de compatibilidad
  category,
  level,
  enrolled,
  description,
  reviews,
  duration,
  onEnroll,
  courseId,
  isEnrolling = false,
  onClick,
}: CourseCardProps) {
  // Determinar qué props usar (prioridad a la nueva interfaz)
  const finalCategoryTag = categoryTag || (category ? { name: category } : { name: '' });
  const finalLevelTag = levelTag || (level ? { 
    name: level, 
    color: levelNameToColor[level] || 'green' 
  } : { name: '', color: 'green' as const });
  const finalUsers = users ?? enrolled ?? 0;
  const finalImageAlt = imageAlt || title;

  const levelColor = levelColors[finalLevelTag.color];

  // Si se proporciona width, usar el diseño con posicionamiento absoluto
  if (width) {
    return (
      <div
        className="h-[400px] shrink-0 relative bg-neutral-800 rounded-[25px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col p-6"
        style={{ width }}
        {...(onClick && { onClick })}
      >
        <img
          src={image}
          alt={finalImageAlt}
          className="w-[101%] h-[60%] left-1/2 transform -translate-x-1/2 top-[-3%] absolute object-cover shadow-[inset_0px_-10px_15px_0px_rgba(0,0,0,0.25)]"
        />
        <div className="w-[95%] h-[40%] left-1/2 transform -translate-x-1/2 top-[60%] absolute flex flex-col justify-between items-center py-2">
          <div className="self-stretch flex justify-start items-center gap-2 -mt-2">
            <div className="px-2 py-[0.5%] bg-pink-300 rounded-md flex justify-center items-center gap-2.5 whitespace-nowrap shrink-0">
              <p className="justify-start text-pink-600 text-xs font-bold whitespace-nowrap">{finalCategoryTag.name}</p>
            </div>
            <div className={`px-2 py-[0.5%] ${levelColor.bg} rounded-md flex justify-center items-center gap-2.5 whitespace-nowrap shrink-0`}>
              <p className={`justify-start ${levelColor.text} text-xs font-bold whitespace-nowrap`}>{finalLevelTag.name}</p>
            </div>
          </div>
          <div className="self-stretch flex-1 flex flex-col justify-center gap-1 min-h-0">
            <div className="self-stretch flex justify-between items-end gap-2">
              <div className="flex-1 flex flex-col justify-start items-start min-w-0 overflow-hidden -mt-1">
                <h2 className="w-full text-neutral-50 text-lg sm:text-xl font-bold truncate" title={title}>
                  {title}
                </h2>
                <div className="flex justify-start items-center gap-1 ">
                  <UsersIcon className="w-4 h-4 text-neutral-50/40" />
                  <h2 className="justify-start text-neutral-50/40 text-xs font-bold">{finalUsers}</h2>
                </div>
              </div>
              <div className="flex justify-end items-center gap-0.5 shrink-0">
                <StarIcon className="w-5 h-5" />
                <h2 className="text-neutral-50/40 text-lg font-bold">{rating}</h2>
              </div>
            </div>
            {description && (
              <p className="text-neutral-50/70 text-xs font-medium line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>
          {onEnroll ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnroll();
              }}
              disabled={isEnrolling}
              className="w-full px-4 py-[0.5%] bg-pink-800 hover:bg-pink-700 disabled:bg-pink-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex justify-center items-center gap-2.5 transition-colors"
            >
              <h2 className="justify-start text-neutral-50 text-sm sm:text-base font-bold">
                {isEnrolling ? 'Enrolling...' : 'Enroll'}
              </h2>
            </button>
          ) : (
            <button
              disabled
              className="w-full px-4 py-[0.5%] bg-neutral-600 rounded-xl flex justify-center items-center gap-2.5 cursor-not-allowed opacity-50"
            >
              <h2 className="justify-start text-neutral-50 text-sm sm:text-base font-bold">Enroll</h2>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Diseño alternativo sin width (versión HEAD mejorada)
  return (
    <div 
      className="w-full max-w-md relative rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] overflow-hidden bg-neutral-800"
      {...(onClick && { onClick })}
    >
      <div className="w-full h-48 relative overflow-hidden shadow-[inset_0px_-10px_15px_0px_rgba(0,0,0,0.25)]">
        <img
          src={image}
          alt={finalImageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="bg-pink-300 rounded-md px-2 py-0.5">
            <span className="text-pink-600 text-xs font-bold">{finalCategoryTag.name}</span>
          </div>
          <div className={`${levelColor.bg} ${levelColor.text} rounded-md px-2 py-0.5`}>
            <span className="text-xs font-bold">{finalLevelTag.name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-50 text-xl font-bold">{title}</h3>
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4 text-neutral-50/40" />
            <span className="text-neutral-50/40 text-base font-bold">{finalUsers.toLocaleString()}</span>
          </div>
        </div>

        {description && (
          <p className="text-neutral-500 text-sm font-bold line-clamp-2">
            {description}
          </p>
        )}

        {description && <div className="w-full h-px bg-neutral-500"></div>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-neutral-50/40 text-sm font-bold">
              {rating}{reviews !== undefined ? ` (${reviews})` : ''}
            </span>
          </div>

          {duration && (
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-50/40 text-sm font-bold">{duration}</span>
            </div>
          )}
        </div>

        {onEnroll ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll();
            }}
            disabled={isEnrolling}
            className="w-full bg-pink-800 rounded-lg py-2 hover:bg-pink-900 disabled:bg-pink-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-neutral-50 text-base font-bold">
              {isEnrolling ? 'Enrolling...' : 'Enroll'}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-neutral-600 rounded-lg py-2 cursor-not-allowed opacity-50"
          >
            <span className="text-neutral-50 text-base font-bold">Enroll</span>
          </button>
        )}
      </div>
    </div>
  );
}

