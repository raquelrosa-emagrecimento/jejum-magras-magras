
import React from 'react';
import { METABOLIC_TIMELINE } from '../constants';
import { TimelineEvent } from '../types';
import { FireIcon } from './icons/Icons';

interface MetabolicStatusProps {
  elapsedSeconds: number;
}

const MetabolicStatus: React.FC<MetabolicStatusProps> = ({ elapsedSeconds }) => {
  const elapsedHours = elapsedSeconds / 3600;

  // Encontrar o estágio atual (o último que já foi ultrapassado)
  const currentStageIndex = METABOLIC_TIMELINE.findIndex(
    (event, index) => elapsedHours >= event.hour && (index === METABOLIC_TIMELINE.length - 1 || elapsedHours < METABOLIC_TIMELINE[index + 1].hour)
  );

  // Se não atingiu nem 12h ainda
  if (elapsedHours < 12) {
    const nextStage = METABOLIC_TIMELINE[0];
    const hoursLeft = nextStage.hour - elapsedHours;
    const progressPercent = (elapsedHours / 12) * 100;

    return (
      <div className="w-full bg-white rounded-3xl shadow-soft-lavender p-6 border border-brand-lavender/20 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-full text-gray-400">
            <FireIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-gray-500">Preparando o Corpo</h3>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Seu corpo ainda está digerindo sua última refeição e usando glicose como energia. A mágica metabólica começa em breve!
        </p>
        
        <div className="mt-4">
           <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
             <span>0h</span>
             <span>Próxima fase: 12h</span>
           </div>
           <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
             <div 
               className="bg-gray-300 h-3 rounded-full transition-all duration-1000 ease-out"
               style={{ width: `${progressPercent}%` }}
             ></div>
           </div>
           <p className="text-center text-brand-lavender-dark font-bold mt-2 text-sm">
             Faltam {Math.floor(hoursLeft)}h {Math.floor((hoursLeft % 1) * 60)}m para a Queima de Gordura
           </p>
        </div>
      </div>
    );
  }

  const currentStage = METABOLIC_TIMELINE[currentStageIndex];
  const nextStage = currentStageIndex < METABOLIC_TIMELINE.length - 1 ? METABOLIC_TIMELINE[currentStageIndex + 1] : null;

  // Calcular progresso para o próximo estágio
  let progressToNext = 100;
  if (nextStage) {
      const hoursInStage = nextStage.hour - currentStage.hour;
      const hoursPassedInStage = elapsedHours - currentStage.hour;
      progressToNext = (hoursPassedInStage / hoursInStage) * 100;
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-soft-lavender p-6 border border-brand-lavender/20 mt-6 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

       <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-brand-pink/10 rounded-full text-brand-pink animate-pulse">
                <FireIcon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-brand-lavender uppercase tracking-wider">Fase Atual • {currentStage.hour}h+</p>
                <h3 className="font-bold text-xl text-brand-dark leading-tight">{currentStage.title}</h3>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {currentStage.description}
          </p>

          <div className="bg-brand-lavender/5 rounded-xl p-4 mb-4 border border-brand-lavender/10">
             <p className="text-xs font-bold text-brand-lavender-dark uppercase mb-2 tracking-wide">Benefícios Ativos:</p>
             <ul className="space-y-2">
                {currentStage.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-brand-pink mt-0.5">✔</span>
                        {benefit}
                    </li>
                ))}
             </ul>
          </div>

          {nextStage && (
             <div className="mt-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                  <span>Progresso da fase</span>
                  <span>Próx: {nextStage.title} ({nextStage.hour}h)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-brand-pink to-brand-lavender h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressToNext}%` }}
                  ></div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default MetabolicStatus;
