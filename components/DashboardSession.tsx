
import React, { useState, useEffect } from 'react';
import { CompletedFast, DailyLog } from '../types';
import { UserCircleIcon, DropIcon, ScaleIcon, RulerIcon, BoltIcon, ChevronRightIcon } from './icons/Icons';

interface DashboardSessionProps {
  history: CompletedFast[];
}

// --- Chart Components ---

interface ChartSeries {
  key: string; // dot notation path e.g. 'bloodLevels.ketones'
  label: string;
  color: string;
  strokeColor?: string;
}

interface ChartDataPoint {
  dayName: string;
  dayNum: number;
  fullDate: string;
  [key: string]: any;
}

interface ReferenceLine {
  value: number;
  color: string;
}

interface DashboardChartProps {
  title: string;
  icon: React.ReactNode;
  unit: string;
  data: ChartDataPoint[];
  series: ChartSeries[];
  yMax?: number; // Manual override
  referenceLines?: ReferenceLine[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ title, icon, unit, data, series, yMax, referenceLines }) => {
    // Calculate Max Y for scaling
    const calculateMaxY = () => {
        if (yMax) return yMax;
        let max = 0;
        data.forEach(point => {
            series.forEach(s => {
                const keys = s.key.split('.');
                let val = point;
                for (const k of keys) val = val ? val[k] : undefined;
                if (typeof val === 'number' && val > max) max = val;
            });
        });
        return max === 0 ? 1 : max * 1.2; // Add some padding
    };

    const maxY = calculateMaxY();
    const chartHeight = 160;
    const xPadding = 20;

    const getValue = (point: ChartDataPoint, keyPath: string) => {
        const keys = keyPath.split('.');
        let val: any = point;
        for (const k of keys) {
            val = val ? val[k] : undefined;
        }
        return typeof val === 'number' ? val : null;
    };

    return (
        <div className="bg-white rounded-3xl p-5 mb-4 shadow-soft-lavender border border-brand-lavender/20">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-bold text-lg text-brand-dark">{title}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm cursor-pointer hover:text-brand-lavender transition-colors">
                    <span>Todos</span>
                    <ChevronRightIcon className="w-4 h-4" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-4">
                <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
                    <span className="px-4 py-1.5 bg-white rounded-full text-xs font-bold shadow-sm text-brand-lavender-dark border border-gray-100">Semana</span>
                    <span className="px-4 py-1.5 text-gray-400 text-xs font-bold hover:text-brand-lavender transition-colors cursor-pointer">Mês</span>
                    <span className="px-4 py-1.5 text-gray-400 text-xs font-bold hover:text-brand-lavender transition-colors cursor-pointer">Ano</span>
                </div>
            </div>

            <p className="text-center text-gray-400 text-xs mb-4">Unidades: {unit}</p>

            <div className="relative h-56 w-full select-none">
                {/* Y Axis Labels */}
                <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 text-right w-8 pr-1">
                    <span>{maxY.toFixed(2)}</span>
                    <span>{(maxY * 0.5).toFixed(2)}</span>
                    <span>0.00</span>
                </div>

                {/* Chart Area */}
                <div className="absolute left-0 top-0 right-8 bottom-8 border-b border-gray-100 border-l border-gray-100 border-dashed">
                     {/* Grid Lines */}
                     <div className="absolute top-0 w-full border-t border-gray-100 border-dashed opacity-60"></div>
                     <div className="absolute top-1/2 w-full border-t border-gray-100 border-dashed opacity-60"></div>
                     
                     {/* Reference Lines */}
                     {referenceLines?.map((ref, idx) => {
                         const topPct = 100 - (ref.value / maxY) * 100;
                         if (topPct < 0 || topPct > 100) return null;
                         return (
                             <div 
                                key={idx} 
                                className="absolute w-full border-t border-dashed opacity-60 transition-all duration-500"
                                style={{ top: `${topPct}%`, borderColor: ref.color }}
                             ></div>
                         )
                     })}

                     {/* SVG Data Lines/Dots */}
                     <svg className="w-full h-full overflow-visible">
                        {series.map((s, sIdx) => {
                            // Build path
                            let pathD = "";
                            const points: {x: number, y: number, val: number}[] = [];

                            data.forEach((d, i) => {
                                const val = getValue(d, s.key);
                                if (val !== null) {
                                    const x = (i / (data.length - 1)) * 100; // percent
                                    const y = 100 - (val / maxY) * 100; // percent
                                    points.push({x, y, val});
                                }
                            });

                            return (
                                <g key={sIdx}>
                                    {/* Dots */}
                                    {points.map((p, i) => (
                                        <circle 
                                            key={i} 
                                            cx={`${p.x}%`} 
                                            cy={`${p.y}%`} 
                                            r="4" 
                                            className="transition-all duration-500"
                                            fill={s.color} 
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                        />
                                    ))}
                                </g>
                            );
                        })}
                     </svg>
                </div>

                {/* X Axis Labels */}
                <div className="absolute bottom-0 left-0 right-8 flex justify-between pt-2">
                    {data.map((d, i) => (
                        <div key={i} className="flex flex-col items-center text-[10px] text-gray-400 w-8">
                            <span className="capitalize">{d.dayName}.</span>
                            <span className="text-gray-600 font-bold">{d.dayNum}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
                {series.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                        <span className="text-xs text-gray-600 capitalize font-medium">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


const DashboardSession: React.FC<DashboardSessionProps> = ({ history }) => {
  const [journalLogs, setJournalLogs] = useState<Record<string, DailyLog>>({});

  useEffect(() => {
      const savedLogs = localStorage.getItem('journalLogs');
      if (savedLogs) {
          setJournalLogs(JSON.parse(savedLogs));
      }
  }, []);
  
  // Stats Calculations
  const totalFasts = history.length;
  
  const maxDurationSeconds = history.reduce((max, curr) => Math.max(max, curr.durationSeconds), 0);
  const longestFastHours = maxDurationSeconds > 0 ? Math.floor(maxDurationSeconds / 3600) : 0;

  const totalSeconds = history.reduce((sum, curr) => sum + curr.durationSeconds, 0);
  const totalDays = Math.floor(totalSeconds / (3600 * 24));
  const totalHoursLeft = Math.floor((totalSeconds % (3600 * 24)) / 3600);

  const uniqueDays = new Set(history.map(fast => new Date(fast.endTime).toDateString()));
  const daysWithFast = uniqueDays.size;

  // Data Preparation for Charts (Last 7 days)
  const getChartData = () => {
      const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const data: ChartDataPoint[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          
          const log = journalLogs[dateKey];

          // Fasting hours
          const fastsOnDay = history.filter(h => new Date(h.endTime).toDateString() === date.toDateString());
          const hoursFasted = fastsOnDay.reduce((sum, h) => sum + (h.durationSeconds / 3600), 0);
          
          data.push({
              dayName: days[date.getDay()],
              dayNum: date.getDate(),
              fullDate: `${date.getDate()} ${months[date.getMonth()]}`,
              hoursFasted: hoursFasted,
              ...log, // Spread log properties (weight, measurements, etc.)
              isToday: i === 0
          });
      }
      return data;
  };

  const chartData = getChartData();

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-4 scroll-smooth bg-white">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-lavender-dark">Painel</h2>
          <div className="p-2 bg-brand-lavender/10 rounded-full text-brand-lavender">
              <UserCircleIcon className="w-6 h-6" />
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-5 rounded-3xl border border-brand-lavender/20 relative overflow-hidden shadow-soft-lavender">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-pink/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-wider">Jejum</p>
              <p className="text-3xl font-bold text-brand-dark">{totalFasts}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-brand-lavender/20 relative overflow-hidden shadow-soft-lavender">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-lavender/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-wider">Jejum mais longo</p>
              <p className="text-3xl font-bold text-brand-dark">{longestFastHours}h</p>
          </div>
           <div className="bg-white p-5 rounded-3xl border border-brand-lavender/20 relative overflow-hidden shadow-soft-lavender">
              <p className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-wider">Tempo total</p>
              <p className="text-3xl font-bold text-brand-dark">{totalDays}d {totalHoursLeft}h</p>
          </div>
           <div className="bg-white p-5 rounded-3xl border border-brand-lavender/20 relative overflow-hidden shadow-soft-lavender">
              <p className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-wider">Dias com jejum</p>
              <p className="text-3xl font-bold text-brand-dark">{daysWithFast}</p>
          </div>
      </div>

      {/* Fasting Bar Chart (Custom implementation to match previous look) */}
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-soft-lavender border border-brand-lavender/20">
          <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                   <div className="p-1 bg-brand-lavender/10 rounded text-brand-lavender">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                  <span className="font-bold text-lg text-brand-dark">Jejum</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm cursor-pointer hover:text-brand-lavender transition-colors">
                    <span>Todos</span>
                    <ChevronRightIcon className="w-4 h-4" />
              </div>
          </div>
          
          <div className="flex justify-center mb-4">
             <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
                  <span className="px-4 py-1.5 bg-white rounded-full text-xs font-bold shadow-sm text-brand-lavender-dark border border-gray-100">Semana</span>
                  <span className="px-4 py-1.5 text-gray-400 text-xs font-bold hover:text-brand-lavender cursor-pointer">Mês</span>
                  <span className="px-4 py-1.5 text-gray-400 text-xs font-bold hover:text-brand-lavender cursor-pointer">Ano</span>
              </div>
          </div>
          <p className="text-center text-gray-400 text-xs mb-4">Horas por dia</p>

          <div className="relative h-48 mt-2">
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none pr-2 text-right w-8 border-r border-dashed border-gray-100">
                   <span className="-mt-2">24h</span>
                   <span>18h</span>
                   <span>12h</span>
                   <span>6h</span>
                   <span className="-mb-2">0h</span>
              </div>
              <div className="absolute inset-0 flex items-end justify-between pl-10 pr-2 pt-2 pb-6">
                  {chartData.map((data, idx) => {
                      const heightPercent = Math.min((data.hoursFasted / 24) * 100, 100);
                      return (
                          <div key={idx} className="flex flex-col items-center gap-2 w-full h-full justify-end group">
                              <div className="w-3 sm:w-5 bg-gray-100 rounded-t-full rounded-b-md h-full relative flex items-end overflow-hidden group-hover:bg-gray-200 transition-colors">
                                  <div 
                                    className={`${data.isToday ? 'bg-brand-pink' : 'bg-brand-lavender'} w-full rounded-t-full rounded-b-md transition-all duration-1000`}
                                    style={{ height: `${heightPercent}%` }}
                                  ></div>
                              </div>
                          </div>
                      );
                  })}
              </div>
               <div className="absolute bottom-0 left-10 right-2 flex justify-between">
                    {chartData.map((d, i) => (
                         <div key={i} className="flex flex-col items-center text-[10px] text-gray-400 w-3 sm:w-5">
                             <span>{d.dayName}.</span>
                             <span className="text-gray-600 font-bold">{d.dayNum}</span>
                         </div>
                    ))}
               </div>
          </div>
      </div>

      {/* Blood Levels Chart */}
      <DashboardChart 
        title="Níveis de sangue"
        icon={<DropIcon className="w-5 h-5 text-brand-lavender" />}
        unit="mmol/L"
        data={chartData}
        series={[
            { key: 'bloodLevels.ketones', label: 'cetonas', color: '#3b82f6' }, // Blue
            { key: 'bloodLevels.glucose', label: 'glicose', color: '#14b8a6' }, // Teal
        ]}
        yMax={3.0}
      />

      {/* Weight Chart */}
      <DashboardChart 
        title="Peso"
        icon={<ScaleIcon className="w-5 h-5 text-brand-lavender" />}
        unit="kg"
        data={chartData}
        series={[
            { key: 'weight', label: 'Peso', color: '#a3e635' }, // Lime
        ]}
      />

      {/* Body Measurements Chart */}
      <DashboardChart 
        title="Medições do corpo"
        icon={<RulerIcon className="w-5 h-5 text-brand-lavender" />}
        unit="cm"
        data={chartData}
        series={[
            { key: 'measurements.chest', label: 'peito', color: '#22c55e' }, // Green
            { key: 'measurements.waist', label: 'cintura', color: '#eab308' }, // Yellow
            { key: 'measurements.hips', label: 'quadris', color: '#3b82f6' }, // Blue
            { key: 'measurements.thigh', label: 'coxa', color: '#ef4444' }, // Red
        ]}
      />

      {/* Electrolytes Chart */}
      <DashboardChart 
        title="Eletrólitos"
        icon={<BoltIcon className="w-5 h-5 text-brand-lavender" />}
        unit="g"
        data={chartData}
        series={[
            { key: 'electrolytes.sodium', label: 'sódio', color: '#a855f7' }, // Purple
            { key: 'electrolytes.potassium', label: 'potássio', color: '#eab308' }, // Yellow
            { key: 'electrolytes.magnesium', label: 'magnésio', color: '#2dd4bf' }, // Teal
        ]}
        yMax={3.5}
        referenceLines={[
            { value: 3.00, color: '#a855f7' },
            { value: 0.30, color: '#2dd4bf' },
        ]}
      />

    </div>
  );
};

export default DashboardSession;
