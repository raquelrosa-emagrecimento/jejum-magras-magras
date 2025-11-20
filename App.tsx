import React, { useState, useEffect, useCallback } from 'react';
import { FastingPlan, CompletedFast, ActiveFast } from './types';
import { FASTING_PLANS } from './constants';
import TimerDisplay from './components/TimerDisplay';
import PlanSelector from './components/PlanSelector';
import HistoryLog from './components/HistoryLog';
import { PlayIcon, StopIcon, HomeIcon, ListIcon, ClockHistoryIcon } from './components/icons/Icons';

type Tab = 'timer' | 'plans' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [selectedPlan, setSelectedPlan] = useState<FastingPlan>(FASTING_PLANS[0]);
  const [activeFast, setActiveFast] = useState<ActiveFast | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [history, setHistory] = useState<CompletedFast[]>([]);

  // Load data
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('fastingHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      
      const savedActiveFast = localStorage.getItem('activeFast');
      if (savedActiveFast) {
        const parsedFast: ActiveFast = JSON.parse(savedActiveFast);
        setActiveFast(parsedFast);
        // Sync selected plan with active fast plan
        const matchingPlan = FASTING_PLANS.find(p => p.name === parsedFast.plan.name);
        if (matchingPlan) setSelectedPlan(matchingPlan);
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (activeFast) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(activeFast.startTime).getTime();
        setElapsedSeconds(Math.floor((now - start) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedSeconds(0);
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
    setActiveTab('timer'); // Auto switch to timer
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

  const handlePlanSelect = (plan: FastingPlan) => {
    setSelectedPlan(plan);
    // Don't switch tab immediately, let user see selection
  };

  const totalDurationSeconds = (activeFast?.plan.hours ?? selectedPlan.hours) * 3600;
  const percentage = activeFast ? Math.min((elapsedSeconds / totalDurationSeconds) * 100, 100) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <div className="flex flex-col items-center justify-center h-full pb-20">
             <div className="w-full max-w-md px-6">
                <div className="bg-white rounded-[2rem] shadow-soft-lavender p-8 flex flex-col items-center relative overflow-hidden border border-brand-lavender/20">
                   
                   <h2 className="text-xl font-medium text-brand-lavender-dark mb-6 tracking-tight">
                     {activeFast ? 'Jejum em Andamento' : 'Magras Magras, vamos jejuar?'}
                   </h2>

                   <TimerDisplay
                    elapsedSeconds={elapsedSeconds}
                    totalSeconds={totalDurationSeconds}
                    percentage={percentage}
                    isActive={!!activeFast}
                   />

                   <div className="mt-10 w-full">
                      {activeFast ? (
                        <div className="flex flex-col gap-3">
                          <div className="text-center mb-4">
                            <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Plano Atual</p>
                            <p className="font-bold text-brand-lavender-dark text-lg">{activeFast.plan.name}</p>
                          </div>
                          <button 
                            onClick={handleEndFast}
                            className="w-full py-4 bg-brand-lavender text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-lavender/40 hover:bg-brand-lavender-dark transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            <StopIcon className="w-6 h-6" />
                            Encerrar Jejum
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                           <div className="text-center mb-4">
                            <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Plano Selecionado</p>
                            <button onClick={() => setActiveTab('plans')} className="font-bold text-brand-pink text-lg underline decoration-dotted decoration-2 underline-offset-4 hover:text-brand-pink/80">
                              {selectedPlan.name} ({selectedPlan.hours}h)
                            </button>
                          </div>
                          <button 
                            onClick={handleStartFast}
                            className="w-full py-4 bg-brand-pink text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-pink/40 hover:brightness-95 transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            <PlayIcon className="w-6 h-6" />
                            Iniciar Jejum
                          </button>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        );
      case 'plans':
        return (
          <div className="h-full overflow-y-auto pb-24 pt-8 px-4">
             <h2 className="text-2xl font-bold text-brand-lavender-dark mb-6 px-2 text-center">Planos de Jejum</h2>
             <PlanSelector
                plans={FASTING_PLANS}
                selectedPlan={activeFast ? activeFast.plan : selectedPlan}
                onSelectPlan={handlePlanSelect}
                disabled={!!activeFast}
              />
          </div>
        );
      case 'history':
        return (
          <div className="h-full overflow-y-auto pb-24 pt-8 px-4">
            <h2 className="text-2xl font-bold text-brand-lavender-dark mb-6 px-2 text-center">Seu Progresso</h2>
            <HistoryLog history={history} />
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white font-sans">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-50 pb-safe pt-3 px-6 shadow-[0_-4px_25px_rgba(200,180,227,0.15)] z-50 h-24 rounded-t-3xl">
        <div className="flex justify-around items-center h-full pb-4">
          <button 
            onClick={() => setActiveTab('timer')}
            className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${activeTab === 'timer' ? 'text-brand-lavender-dark' : 'text-gray-300 hover:text-brand-lavender'}`}
          >
            <HomeIcon className={`w-7 h-7 ${activeTab === 'timer' ? 'fill-brand-lavender/20 stroke-brand-lavender-dark' : 'stroke-current'}`} />
            <span className="text-xs font-medium">Início</span>
          </button>

          <button 
            onClick={() => setActiveTab('plans')}
            className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${activeTab === 'plans' ? 'text-brand-lavender-dark' : 'text-gray-300 hover:text-brand-lavender'}`}
          >
            <ListIcon className={`w-7 h-7 ${activeTab === 'plans' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-xs font-medium">Planos</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${activeTab === 'history' ? 'text-brand-lavender-dark' : 'text-gray-300 hover:text-brand-lavender'}`}
          >
            <ClockHistoryIcon className={`w-7 h-7 ${activeTab === 'history' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-xs font-medium">Histórico</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;