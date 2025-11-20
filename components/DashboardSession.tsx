
import React from 'react';
import { CompletedFast } from '../types';
import { UserCircleIcon } from './icons/Icons';

interface DashboardSessionProps {
  history: CompletedFast[];
}

const DashboardSession: React.FC<DashboardSessionProps> = ({ history }) => {
  
  // Stats Calculations
  const totalFasts = history.length;
  
  const maxDurationSeconds = history.reduce((max, curr) => Math.max(max, curr.durationSeconds), 0);
  const longestFastHours = maxDurationSeconds > 0 ? Math.floor(maxDurationSeconds / 3600) : 0;

  const totalSeconds = history.reduce((sum, curr) => sum + curr.durationSeconds, 0);
  const totalDays = Math.floor(totalSeconds / (3600 * 24));
  const totalHoursLeft = Math.floor((totalSeconds % (3600 * 24)) / 3600);

  // Count unique days with fasts
  const uniqueDays = new Set(history.map(fast => new Date(fast.endTime).toDateString()));
  const daysWithFast = uniqueDays.size;

  // Chart Data (Last 7 days)
  const getChartData = () => {
      const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
      const data = [];
      const today = new Date();

      // Generate last 7 days array reversed (today to 6 days ago) then reverse back for display
      for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          // Sum hours for this day
          const fastsOnDay = history.filter(h => new Date(h.endTime).toDateString() === date.toDateString());
          const hours = fastsOnDay.reduce((sum, h) => sum + (h.durationSeconds / 3600), 0);
          
          data.push({
              dayName: days[date.getDay()],
              dayNum: date.getDate(),
              hours: hours,
              isToday: i === 0
          });
      }
      return data;
  };

  const chartData = getChartData();

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-lavender-dark">Painel</h2>
          <div className="p-2 bg-brand-lavender/10 rounded-full text-brand-lavender">
              <UserCircleIcon className="w-6 h-6" />
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Total Fasts */}
          <div className="bg-gray-900 p-5 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-xs text-gray-400 uppercase font-medium mb-2">Jejum</p>
              <p className="text-3xl font-bold">{totalFasts}</p>
          </div>

          {/* Longest Fast */}
          <div className="bg-gray-900 p-5 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-xs text-gray-400 uppercase font-medium mb-2">Jejum mais longo</p>
              <p className="text-3xl font-bold">{longestFastHours}h</p>
          </div>

           {/* Total Time */}
           <div className="bg-gray-900 p-5 rounded-3xl text-white relative overflow-hidden">
              <p className="text-xs text-gray-400 uppercase font-medium mb-2">Tempo total de jejum</p>
              <p className="text-3xl font-bold">{totalDays}d {totalHoursLeft}h</p>
          </div>

           {/* Days Count */}
           <div className="bg-gray-900 p-5 rounded-3xl text-white relative overflow-hidden">
              <p className="text-xs text-gray-400 uppercase font-medium mb-2">Dias com jejum</p>
              <p className="text-3xl font-bold">{daysWithFast}</p>
          </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-900 rounded-3xl p-6 text-white mb-8">
          <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                  <span className="font-bold">Jejum</span>
              </div>
              <div className="flex bg-gray-800 rounded-full p-1">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-xs font-bold">Semana</span>
                  <span className="px-3 py-1 text-gray-500 text-xs font-bold">Mês</span>
                  <span className="px-3 py-1 text-gray-500 text-xs font-bold">Ano</span>
              </div>
          </div>

          <div className="relative h-48 mt-4">
              {/* Y Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600 pointer-events-none">
                   <div className="border-b border-gray-800 w-full h-0 relative"><span className="absolute -left-8 -top-2">24h</span></div>
                   <div className="border-b border-gray-800 w-full h-0 relative"><span className="absolute -left-8 -top-2">18h</span></div>
                   <div className="border-b border-gray-800 w-full h-0 relative"><span className="absolute -left-8 -top-2">12h</span></div>
                   <div className="border-b border-gray-800 w-full h-0 relative"><span className="absolute -left-8 -top-2">6h</span></div>
                   <div className="border-b border-gray-800 w-full h-0 relative"><span className="absolute -left-8 -top-2">0h</span></div>
              </div>

              {/* Bars Container */}
              <div className="absolute inset-0 flex items-end justify-between pl-4 pt-2">
                  {chartData.map((data, idx) => {
                      // Cap max height at 24h (100%)
                      const heightPercent = Math.min((data.hours / 24) * 100, 100);
                      return (
                          <div key={idx} className="flex flex-col items-center gap-2 w-full">
                              <div className="w-2.5 sm:w-4 bg-gray-800 rounded-full h-full relative flex items-end overflow-hidden">
                                  <div 
                                    className={`${data.isToday ? 'bg-brand-pink' : 'bg-brand-lavender'} w-full rounded-full transition-all duration-1000`}
                                    style={{ height: `${heightPercent}%` }}
                                  ></div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] text-gray-500 uppercase">{data.dayName}</span>
                                  <span className="text-xs font-bold text-gray-300">{data.dayNum}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardSession;
