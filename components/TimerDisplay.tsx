
import React from 'react';

interface TimerDisplayProps {
  elapsedSeconds: number;
  totalSeconds: number;
  percentage: number;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedSeconds, percentage }) => {
  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 mx-auto">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 200 200"
        className="transform -rotate-90"
      >
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius + stroke}
          cy={radius + stroke}
        />
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, strokeLinecap: 'round' }}
          r={normalizedRadius}
          cx={radius + stroke}
          cy={radius + stroke}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl sm:text-5xl font-bold text-primary tracking-tighter">
          {formatTime(elapsedSeconds)}
        </span>
        <span className="text-lg text-text-secondary mt-1">Elapsed Time</span>
        <span className="text-2xl font-semibold text-secondary mt-2">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default TimerDisplay;
