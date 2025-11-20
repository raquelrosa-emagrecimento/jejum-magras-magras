import React from 'react';

interface TimerDisplayProps {
  elapsedSeconds: number;
  totalSeconds: number;
  percentage: number;
  isActive: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedSeconds, percentage, isActive }) => {
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-4">
      {/* Background glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-brand-pink/20 blur-3xl rounded-full animate-pulse-slow"></div>
      )}

      <svg
        height="100%"
        width="100%"
        viewBox="0 0 240 240"
        className="transform -rotate-90 relative z-10"
      >
        {/* Track Circle */}
        <circle
          stroke="#F3F4F6" // Um cinza muito leve para o fundo do track
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
        {/* Progress Circle */}
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* Rosa Chá Suave */}
            <stop offset="0%" stopColor="#F7C5CC" />
            <stop offset="100%" stopColor="#F7C5CC" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center text-center z-20">
        {/* Números em Lavanda - Reduzido para text-4xl para melhor proporção */}
        <span className={`text-4xl font-bold tracking-tighter tabular-nums ${isActive ? 'text-brand-lavender' : 'text-gray-300'}`}>
          {formatTime(elapsedSeconds)}
        </span>
        <span className="text-xs text-gray-400 font-medium mt-2 uppercase tracking-widest text-[10px]">
          {isActive ? 'Tempo Decorrido' : 'Aguardando'}
        </span>
      </div>
    </div>
  );
};

export default TimerDisplay;