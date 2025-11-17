'use client';

import { useState } from 'react';

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
}

interface UnitContentProps {
  unit: Unit | null;
}

export default function UnitContent({ unit }: UnitContentProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!unit) {
    return null;
  }

  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('- ')) {
        return (
          <li key={index} className="text-white text-base flex items-start mb-2">
            <span className="mr-2">-</span>
            <span>{line.trim().substring(2)}</span>
          </li>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={index} className="text-white text-base flex items-start mb-2">
            <span className="mr-2">{line.trim().match(/^\d+\./)?.[0]}</span>
            <span>{line.trim().replace(/^\d+\.\s/, '')}</span>
          </li>
        );
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="text-white text-base leading-relaxed mb-4">
            {line}
          </p>
        );
      }
    });
  };

  const tabItems = [
    {
      label: 'Main Content',
      command: () => setActiveTab(0)
    },
    {
      label: 'Support Material',
      command: () => setActiveTab(1)
    }
  ];

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-white mb-4">
        {unit.orden}. {unit.titulo}
      </h2>

      <div className="mb-4">
        <div className="flex gap-6 border-b border-[#3A3A3A]">
          {tabItems.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className={`
                pb-3 px-2 text-base font-medium cursor-pointer transition-colors
                ${activeTab === index
                  ? 'text-white border-b-2 border-[#E6007A] font-semibold'
                  : 'text-white/70 hover:text-white'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#222222] rounded-xl p-6">
        {activeTab === 0 ? (
          <div className="space-y-4">
            <div className="text-white">
              {formatText(unit.texto)}
            </div>
          </div>
        ) : (
          <div className="text-white space-y-6">
            {unit.materialApoyo ? (
              <>
                {unit.materialApoyo.videos && unit.materialApoyo.videos.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Videos</h3>
                    <div className="space-y-4">
                      {unit.materialApoyo.videos.map((video, index) => (
                        <div key={index} className="bg-[#2A2A2A] rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{video.titulo}</h4>
                          <p className="text-white/70 text-sm mb-2">Duration: {video.duracion}</p>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#E6007A] hover:text-[#EA007A] underline text-sm"
                          >
                            Watch video →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {unit.materialApoyo.imagenes && unit.materialApoyo.imagenes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unit.materialApoyo.imagenes.map((imagen, index) => (
                        <div key={index} className="bg-[#2A2A2A] rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{imagen.titulo}</h4>
                          <p className="text-white/70 text-sm mb-2">{imagen.descripcion}</p>
                          <a 
                            href={imagen.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#E6007A] hover:text-[#EA007A] underline text-sm"
                          >
                            View image →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!unit.materialApoyo.videos || unit.materialApoyo.videos.length === 0) && 
                 (!unit.materialApoyo.imagenes || unit.materialApoyo.imagenes.length === 0) && (
                  <p className="text-white/70">No support material available for this unit.</p>
                )}
              </>
            ) : (
              <p className="text-white/70">Support material available soon.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

