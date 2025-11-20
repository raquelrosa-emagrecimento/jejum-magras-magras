import React from 'react';
import { CompletedFast } from '../types';
import { ClockIcon } from './icons/Icons';

interface HistoryLogProps {
  history: CompletedFast[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  
  const totalFasts = history.length;
  const totalHours = history.reduce((acc, curr) => acc + (curr.durationSeconds / 3600), 0);

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-5">
          <div className="bg-brand-pink text-white p-5 rounded-3xl shadow-lg shadow-brand-pink/30 flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-3xl transform rotate-12 scale-150 -translate-x-10 -translate-y-10"></div>
             <p className="text-white/90 text-xs font-semibold tracking-wider uppercase relative z-10">Jejuns</p>
             <p className="text-4xl font-bold mt-2 relative z-10">{totalFasts}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-soft-lavender border border-brand-lavender/20 flex flex-col items-center text-center">
             <p className="text-brand-lavender text-xs font-semibold tracking-wider uppercase">Horas Totais</p>
             <p className="text-4xl font-bold text-brand-lavender-dark mt-2">{totalHours.toFixed(1)}</p>
          </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-4 px-2">Atividades Recentes</h3>
        {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ClockIcon className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">Nenhum jejum registrado.</p>
                <p className="text-xs text-gray-300 mt-1">Seus registros aparecerão aqui.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {history.map((fast, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-50 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">{fast.plan.name}</span>
                        </div>
                        <p className="text-xs text-brand-lavender mt-1 font-medium">
                            {new Date(fast.endTime).toLocaleDateString()} • {new Date(fast.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-brand-pink">
                            {(fast.durationSeconds / 3600).toFixed(1)}h
                        </p>
                        <span className="text-[10px] px-2 py-1 bg-brand-pink/10 text-brand-pink rounded-full font-bold uppercase tracking-wide">
                            Concluído
                        </span>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryLog;