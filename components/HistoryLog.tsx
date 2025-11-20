import React from 'react';
import { CompletedFast } from '../types';
import { CalendarIcon, ClockIcon } from './icons/Icons';

interface HistoryLogProps {
  history: CompletedFast[];
}

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 text-center">
         <h2 className="text-2xl font-bold text-primary mb-4">Histórico de Jejum</h2>
        <p className="text-text-secondary">Você ainda não completou nenhum jejum. Comece um para construir seu histórico!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">Histórico de Jejum</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {history.map((fast, index) => (
          <div key={index} className="bg-background p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-grow">
              <p className="font-bold text-lg text-primary">{fast.plan.name} ({fast.plan.hours} Horas)</p>
              <div className="flex items-center text-sm text-text-secondary mt-1">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{new Date(fast.startTime).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center text-right space-x-4">
               <div className="flex items-center text-sm text-text-secondary bg-blue-100 px-3 py-1 rounded-full">
                  <ClockIcon className="w-4 h-4 mr-2 text-secondary" />
                  <span className="font-semibold">{formatDuration(fast.durationSeconds)}</span>
               </div>
               <span className="font-bold text-green-600 text-lg">
                  {((fast.durationSeconds / (fast.plan.hours * 3600)) * 100).toFixed(0)}%
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryLog;