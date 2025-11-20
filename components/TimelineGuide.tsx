
import React from 'react';
import { METABOLIC_TIMELINE } from '../constants';
import { InstagramIcon } from './icons/Icons';

interface TimelineGuideProps {
  elapsedSeconds: number;
  isActive: boolean;
}

const TimelineGuide: React.FC<TimelineGuideProps> = ({ elapsedSeconds, isActive }) => {
  const elapsedHours = elapsedSeconds / 3600;

  return (
    <div className="w-full mt-10 px-2 mb-6">
      <div className="flex items-center justify-center mb-8">
        <h3 className="text-lg font-bold text-brand-lavender-dark px-4 py-2 bg-brand-lavender/5 rounded-full border border-brand-lavender/10">
          Jornada Metabólica (12h - 24h)
        </h3>
      </div>
      
      <div className="relative space-y-0 ml-3">
        {/* Linha Vertical de Fundo */}
        <div className="absolute left-[19px] top-4 bottom-0 w-0.5 bg-gradient-to-b from-brand-pink via-brand-lavender to-gray-100"></div>

        {METABOLIC_TIMELINE.map((event, index) => {
          const isReached = isActive && elapsedHours >= event.hour;
          // A próxima fase é aquela que ainda não foi alcançada, mas é a imediata subsequente
          const isNext = isActive && !isReached && (index === 0 || elapsedHours >= METABOLIC_TIMELINE[index - 1].hour);
          
          return (
            <div key={event.hour} className="relative pl-12 pb-12 last:pb-0 group">
              {/* Círculo da Linha do Tempo */}
              <div 
                className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center transition-all duration-500
                ${isReached 
                  ? 'bg-brand-pink scale-110 shadow-glow-pink' 
                  : isNext 
                    ? 'bg-white border-brand-lavender ring-4 ring-brand-lavender/20' 
                    : 'bg-gray-100 border-gray-50'
                }`}
              >
                {isReached ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span className={`text-[10px] font-bold ${isNext ? 'text-brand-lavender' : 'text-gray-400'}`}>
                    {event.hour}h
                  </span>
                )}
              </div>

              {/* Card de Conteúdo */}
              <div className={`bg-white p-5 rounded-3xl shadow-sm border transition-all duration-300 relative
                ${isReached ? 'border-brand-pink/30 shadow-soft-lavender bg-gradient-to-br from-white to-brand-pink/5' : 'border-gray-100 opacity-90'}
                ${isNext ? 'border-brand-lavender ring-1 ring-brand-lavender/20 opacity-100 scale-[1.02] shadow-lg' : ''}
              `}>
                 {/* Indicador "Em Breve" para a próxima fase */}
                 {isNext && (
                    <div className="absolute -top-3 right-4 bg-brand-lavender text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm">
                        Próxima Fase
                    </div>
                 )}

                 <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isReached ? 'text-brand-pink' : 'text-gray-400'}`}>
                        {event.hour} Horas de Jejum
                    </span>
                 </div>

                 <h4 className={`font-bold text-lg mb-2 ${isReached ? 'text-brand-dark' : 'text-gray-600'}`}>
                   {event.title}
                 </h4>
                 
                 <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                   {event.description}
                 </p>
                 
                 <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl">
                   <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">Benefícios</p>
                   {event.benefits.map((benefit, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isReached ? 'bg-brand-pink' : 'bg-brand-lavender'}`}></div>
                        <span className="text-xs text-gray-600 font-medium">{benefit}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {!isActive && (
          <div className="mt-12 px-2">
              <a 
                href="https://www.instagram.com/raquelrosa.emagrecimento/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-brand-lavender to-brand-pink text-white py-4 rounded-2xl shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                 <InstagramIcon className="w-6 h-6" />
                 <span className="font-bold text-sm sm:text-base">Siga @raquelrosa.emagrecimento</span>
              </a>
          </div>
      )}
    </div>
  );
};

export default TimelineGuide;
