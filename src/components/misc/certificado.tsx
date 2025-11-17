import { UsersIcon, StarIcon } from '@heroicons/react/24/solid';
import Link from 'next/dist/client/link';
import React from 'react';

interface CertificadoProps {
    photoUrl: string;
    cuenta: string;
    curso: string;
    categoria: string;
    calificacion: number;
    link: string;
    usuarios: number;
    descripcion: string;
    tokenId: string;
    imageAlt?: string;
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

export default function Certificado({ 
   photoUrl,
    cuenta,
    curso,
    categoria,
    calificacion,
    link,
    usuarios,
    descripcion,
    tokenId,
    imageAlt,
    levelTag,
    width,
    category,
    level,
    enrolled,
    description, 
    reviews,
    duration,
    courseId, // ID del curso para inscripción

    }: CertificadoProps) {


        // Determinar qué props usar (prioridad a la nueva interfaz)
  const finalCategoryTag = categoria ;
  const finalLevelTag = levelTag || (level ? { 
    name: level, 
    color: levelNameToColor[level] || 'green' 
  } : { name: '', color: 'green' as const });
  const finalUsers = usuarios ?? enrolled ?? 0;
  const finalImageAlt = imageAlt || curso;
  const finalDescription = descripcion || description || '';

  const levelColor = levelColors[finalLevelTag.color];

        // Si se proporciona width, usar el diseño con posicionamiento absoluto
  if (width) {
    return (
      <div
        className="h-full shrink-0 relative bg-neutral-800 rounded-[25px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col p-6"
        style={{ width }}
      >
        <img
          src={photoUrl}
          alt={finalImageAlt}
          className="w-[101%] h-[60%] left-1/2 transform -translate-x-1/2 top-[-3%] absolute object-cover shadow-[inset_0px_-10px_15px_0px_rgba(0,0,0,0.25)]"
        />
        <div className="w-[95%] h-[40%] left-1/2 transform -translate-x-1/2 top-[60%] absolute flex flex-col justify-between items-center py-2">
          <div className="self-stretch flex justify-start items-center gap-2 -mt-2">
            <div className="px-2 py-[0.5%] bg-pink-300 rounded-md flex justify-center items-center gap-2.5 whitespace-nowrap shrink-0">
             {   
                //<p className="justify-start text-pink-600 text-xs font-bold whitespace-nowrap">{finalCategoryTag.name}</p>
            }
            </div>
            <div className={`px-2 py-[0.5%] ${levelColor.bg} rounded-md flex justify-center items-center gap-2.5 whitespace-nowrap shrink-0`}>
              <p className={`justify-start ${levelColor.text} text-xs font-bold whitespace-nowrap`}>{finalLevelTag.name}</p>
            </div>
          </div>
          <div className="self-stretch flex-1 flex flex-col justify-center gap-1 min-h-0">
            <div className="self-stretch flex justify-between items-end gap-2">
              <div className="flex-1 flex flex-col justify-start items-start min-w-0 overflow-hidden -mt-1">
                <h2 className="w-full text-neutral-50 text-lg sm:text-xl font-bold truncate" title={curso}>
                  {curso}
                </h2>
              </div>
              <div className="flex justify-end items-center gap-0.5 shrink-0">
                <StarIcon className="w-5 h-5" />
                <h2 className="text-neutral-50/40 text-lg font-bold">{calificacion}</h2>
              </div>
            </div>
            {finalDescription && (
              <p className="text-neutral-50/70 text-xs font-medium line-clamp-2 mt-1">
                {finalDescription}
              </p>
            )}
            {duration && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-neutral-50/60 text-xs font-medium">{duration}</span>
              </div>
            )}
          </div>
          <Link
            href={link} 
            className="text-center w-full bg-pink-800 rounded-lg py-2 hover:bg-pink-900 disabled:bg-pink-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
           <h2 className="justify-center text-neutral-50 text-sm sm:text-base font-bold">
                View course
              </h2>
          </Link>
        </div>
      </div>
    );
  }

  // Diseño alternativo sin width (versión HEAD mejorada)
  return (
    <div className="w-full max-w-md relative rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] overflow-hidden bg-neutral-800">
      <div className="w-full h-48 relative overflow-hidden shadow-[inset_0px_-10px_15px_0px_rgba(0,0,0,0.25)]">
        <img
          src={photoUrl}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="bg-pink-300 rounded-md px-2 py-0.5">
            
            <span className="text-pink-600 text-xs font-bold">{finalCategoryTag}</span>
          
          </div>
          <div className={`${levelColor.bg} ${levelColor.text} rounded-md px-2 py-0.5`}>
            <span className="text-xs font-bold">{finalLevelTag.name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-50 text-xl font-bold">{curso}</h3>
        </div>

        {finalDescription && (
          <p className="text-neutral-500 text-sm font-bold line-clamp-2">
            {finalDescription}
          </p>
        )}

        {finalDescription && <div className="w-full h-px bg-neutral-500"></div>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-neutral-50/40 text-sm font-bold">
              {calificacion}{reviews !== undefined ? ` (${reviews})` : ''}
            </span>
          </div>

          {duration && (
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-50/40 text-sm font-bold">{duration}</span>
            </div>
          )}
        </div>
          <Link
            href={link} 
            className="text-center w-full bg-pink-800 rounded-lg py-2 hover:bg-pink-900 disabled:bg-pink-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
           <h2 className="justify-center text-neutral-50 text-sm sm:text-base font-bold">
                View course
              </h2>
          </Link>
      </div>
    </div>
  );




    return(
        <div className="h-full">
            <div className="h-full rounded-lg dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20 flex flex-col m-5">
                <div className="w-full h-48 overflow-hidden rounded-md ">
                    <iframe
                        src={photoUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
                <div className="text-xs text-zinc-500 inline-flex m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {usuarios}
                </div>
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {finalCategoryTag && (
                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-semibold text-gray-800 dark:text-gray-200">
                                {finalCategoryTag}
                            </span>
                        )}
                        
                    </div>
                </div>

                <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
                    {curso}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex-1">
                    {finalDescription}
                </p>
                
                <hr></hr>
                <div className="text-xs text-zinc-500">
                    Token ID: {tokenId}
                </div>
                    {link ? (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                        >
                            Ver Detalles
                        </a>
                    ) : (
                        <button
                            type="button"
                            className="inline-block mt-3 px-4 py-2 bg-gray-300 text-gray-800 rounded-md cursor-default"
                            disabled
                        >
                            Ver Detalles
                        </button>
                    )}
            </div>
            
        </div>
    );
}