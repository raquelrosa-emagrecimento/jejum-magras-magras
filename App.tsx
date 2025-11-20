
import React, { useState, useEffect, useCallback } from 'react';
import { FastingPlan, CompletedFast, ActiveFast } from './types';
import { FASTING_PLANS } from './constants';
import TimerDisplay from './components/TimerDisplay';
import PlanSelector from './components/PlanSelector';
import HistoryLog from './components/HistoryLog';
import { FlagIcon, PlayIcon, StopIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<FastingPlan>(FASTING_PLANS[0]);
  const [activeFast, setActiveFast] = useState<ActiveFast | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [history, setHistory] = useState<CompletedFast[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('fastingHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedActiveFast = localStorage.getItem('activeFast');
      if (savedActiveFast) {
        const parsedFast: ActiveFast = JSON.parse(savedActiveFast);
        setActiveFast(parsedFast);
        setSelectedPlan(FASTING_PLANS.find(p => p.hours === parsedFast.plan.hours) || parsedFast.plan);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (activeFast) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(activeFast.startTime).getTime();
        setElapsedSeconds(Math.floor((now - start) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeFast]);

  const handleStartFast = useCallback(() => {
    const now = new Date();
    const newFast: ActiveFast = {
      startTime: now.toISOString(),
      plan: selectedPlan,
    };
    setActiveFast(newFast);
    localStorage.setItem('activeFast', JSON.stringify(newFast));
  }, [selectedPlan]);
  
  const handleEndFast = useCallback(() => {
    if (!activeFast) return;
    const now = new Date();
    const completedFast: CompletedFast = {
      ...activeFast,
      endTime: now.toISOString(),
      durationSeconds: elapsedSeconds
    };

    const newHistory = [completedFast, ...history];
    setHistory(newHistory);
    localStorage.setItem('fastingHistory', JSON.stringify(newHistory));
    
    setActiveFast(null);
    setElapsedSeconds(0);
    localStorage.removeItem('activeFast');
  }, [activeFast, elapsedSeconds, history]);

  const totalDurationSeconds = (activeFast?.plan.hours ?? selectedPlan.hours) * 3600;
  const percentage = activeFast ? Math.min((elapsedSeconds / totalDurationSeconds) * 100, 100) : 0;
  const startTime = activeFast ? new Date(activeFast.startTime) : null;
  const endTime = startTime ? new Date(startTime.getTime() + totalDurationSeconds * 1000) : null;

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Fasting Tracker</h1>
        <p className="text-text-secondary mt-2 text-lg">Your companion for intermittent fasting.</p>
      </header>
      
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <TimerDisplay
            elapsedSeconds={elapsedSeconds}
            totalSeconds={totalDurationSeconds}
            percentage={percentage}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center my-6">
              <div className="flex items-center justify-center space-x-2 text-text-secondary">
                  <PlayIcon className="w-6 h-6 text-green-500" />
                  <div>
                      <p className="font-semibold">Start Time</p>
                      <p>{startTime ? startTime.toLocaleString() : 'N/A'}</p>
                  </div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-text-secondary">
                  <FlagIcon className="w-6 h-6 text-red-500" />
                  <div>
                      <p className="font-semibold">End Time</p>
                      <p>{endTime ? endTime.toLocaleString() : 'N/A'}</p>
                  </div>
              </div>
          </div>
          
          {!activeFast && (
             <PlanSelector
                plans={FASTING_PLANS}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
              />
          )}

          <div className="mt-8 flex justify-center">
            {activeFast ? (
              <button onClick={handleEndFast} className="flex items-center justify-center w-full max-w-xs px-8 py-4 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-xl">
                <StopIcon className="w-7 h-7 mr-3" />
                End Fast
              </button>
            ) : (
              <button onClick={handleStartFast} className="flex items-center justify-center w-full max-w-xs px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 text-xl">
                 <PlayIcon className="w-7 h-7 mr-3" />
                 Start Fast
              </button>
            )}
          </div>
        </div>

        <HistoryLog history={history} />
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center mt-8 text-text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} Fasting Tracker. Stay healthy and mindful.</p>
      </footer>
    </div>
  );
};

export default App;
