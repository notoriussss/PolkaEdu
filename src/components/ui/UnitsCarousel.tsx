'use client';

import { useState, useEffect } from 'react';
import { ClipboardDocumentCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface Unit {
  orden: number;
  titulo: string;
  completed: boolean;
}

interface UnitsCarouselProps {
  units?: Unit[];
  onUnitSelect?: (unitOrden: number) => void;
  initialSelectedUnit?: number;
}

export default function UnitsCarousel({ units, onUnitSelect, initialSelectedUnit }: UnitsCarouselProps) {
  const defaultUnits: Unit[] = [
    { orden: 1, titulo: 'What is Polkadot?', completed: true },
    { orden: 2, titulo: 'Polkadot Architecture', completed: false },
    { orden: 3, titulo: 'Consensus and Validation', completed: false },
  ];

  const [selectedUnit, setSelectedUnit] = useState<number>(initialSelectedUnit || 1);

  useEffect(() => {
    if (initialSelectedUnit !== undefined) {
      setSelectedUnit(initialSelectedUnit);
    }
  }, [initialSelectedUnit]);
  const unitsList = units || defaultUnits;
  
  const completedUnits = unitsList.filter(unit => unit.completed).length;
  const totalUnits = unitsList.length;
  const progressPercentage = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;

  return (
    <div className="bg-[#222222] rounded-xl p-6 w-full">
      <h3 className="text-2xl font-bold text-white mb-6">Units:</h3>
      
      <div className="flex flex-col gap-3 mb-6">
        {unitsList.map((unit) => {
          const isActive = unit.orden === selectedUnit;
          const isCompleted = unit.completed;
          
          return (
            <button
              key={unit.orden}
              onClick={() => {
                setSelectedUnit(unit.orden);
                onUnitSelect?.(unit.orden);
              }}
              className={`
                flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-[#E6007A] text-white font-bold' 
                  : 'bg-[#2A2A2A] text-white hover:bg-[#333333]'
                }
              `}
            >
              <div className="flex-shrink-0">
                {isCompleted || isActive ? (
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                ) : (
                  <InformationCircleIcon className="w-5 h-5" />
                )}
              </div>
              
              <span className="text-left">
                {unit.orden}. {unit.titulo}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6">
        <h4 className="text-white text-lg font-semibold mb-3">Overall Progress:</h4>
        
        <div className="relative w-full h-3 bg-[#3A3A3A] rounded-lg overflow-hidden mb-2">
          <div 
            className="h-full bg-[#EA007A] rounded-lg transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-white text-sm">
          {completedUnits} of {totalUnits} Units ({progressPercentage.toFixed(1)}%)
        </div>
      </div>
    </div>
  );
}

