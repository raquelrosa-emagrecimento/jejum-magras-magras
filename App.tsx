
import React, { useState, useEffect, useCallback } from 'react';
import { FastingPlan, CompletedFast, ActiveFast, User } from './types';
import { FASTING_PLANS } from './constants';
import TimerDisplay from './components/TimerDisplay';
import PlanSelector from './components/PlanSelector';
import MetabolicStatus from './components/MetabolicStatus';
import TimelineGuide from './components/TimelineGuide';
import JournalSession from './components/JournalSession';
import DashboardSession from './components/DashboardSession';
import FastCompletionModal from './components/FastCompletionModal';
import AuthScreen from './components/AuthScreen';
import { PlayIcon, StopIcon, HomeIcon, XMarkIcon, ChevronRightIcon, JournalIcon, UserCircleIcon } from './components/icons/Icons';

type Tab = 'timer' | 'journal' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FastingPlan>(FASTING_PLANS[2]); // Default to 16h (index 2)
  const [activeFast, setActiveFast] = useState<ActiveFast | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [history, setHistory] = useState<CompletedFast[]>([]);
  
  // New State for Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedFast, setLastCompletedFast] = useState<CompletedFast | null>(null);

  // Load data
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('userProfile');
      if (savedUser) setUser(JSON.parse(savedUser));

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

  // Auth Handlers
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('userProfile', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userProfile');
  };

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
    
    // Set completion state
    setLastCompletedFast(completedFast);
    setShowCompletionModal(true);

    // Reset active state
    setActiveFast(null);
    setElapsedSeconds(0);
    localStorage.removeItem('activeFast');
  }, [activeFast, elapsedSeconds, history]);

  const handlePlanSelect = (plan: FastingPlan) => {
    setSelectedPlan(plan);
  };

  const totalDurationSeconds = (activeFast?.plan.hours ?? selectedPlan.hours) * 3600;
  const percentage = activeFast ? Math.min((elapsedSeconds / totalDurationSeconds) * 100, 100) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <div className="h-full overflow-y-auto pb-24 pt-6 px-4 scroll-smooth">
             <div className="w-full max-w-md mx-auto">
                {/* Main Timer Card */}
                <div className="bg-white rounded-[2rem] shadow-soft-lavender p-8 flex flex-col items-center relative overflow-hidden border border-brand-lavender/20">
                   
                   <h2 className="text-xl font-medium text-brand-lavender-dark mb-6 tracking-tight text-center">
                     {activeFast ? 'Jejum em Andamento' : 'Magras Magras, vamos jejuar?'}
                   </h2>

                   <TimerDisplay
                    elapsedSeconds={elapsedSeconds}
                    totalSeconds={totalDurationSeconds}
                    percentage={percentage}
                    isActive={!!activeFast}
                   />

                   <div className="mt-8 w-full">
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
                        <div className="flex flex-col gap-4">
                           {/* New Plan Selection Bar */}
                           <div className="w-full">
                              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2 ml-1">Selecione seu Plano</p>
                              <button 
                                onClick={() => setShowPlanModal(true)} 
                                className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 p-4 rounded-2xl flex items-center justify-between transition-colors group border border-gray-100"
                              >
                                <div className="flex flex-col items-start">
                                   <span className="font-bold text-brand-lavender-dark text-lg group-hover:text-brand-pink transition-colors">
                                      {selectedPlan.name}
                                   </span>
                                   <span className="text-xs text-gray-400 font-medium">{selectedPlan.hours} horas de jejum</span>
                                </div>
                                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-brand-pink group-hover:text-white transition-all">
                                   <ChevronRightIcon className="w-5 h-5 text-brand-lavender-dark group-hover:text-white" />
                                </div>
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

                {/* Metabolic Status - Current Phase (Only if active) */}
                {activeFast && (
                   <MetabolicStatus elapsedSeconds={elapsedSeconds} />
                )}

                {/* Full Timeline Guide (Always visible as reference or progress tracker) */}
                <TimelineGuide elapsedSeconds={elapsedSeconds} isActive={!!activeFast} />
                
             </div>
          </div>
        );
      case 'journal':
        return <JournalSession />;
      case 'dashboard':
        return <DashboardSession history={history} user={user} onLogout={handleLogout} />;
    }
  };

  // If not logged in, show auth screen
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-full flex flex-col bg-white font-sans">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}

        {/* Plan Selection Modal */}
        {showPlanModal && (
           <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
              {/* Overlay click to close */}
              <div className="absolute inset-0" onClick={() => setShowPlanModal(false)}></div>
              
              <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6 pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300 relative max-h-[85vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6 px-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">Escolha seu Plano</h2>
                        <p className="text-brand-lavender-dark text-sm font-medium">Qual sua meta para hoje?</p>
                    </div>
                    <button 
                      onClick={() => setShowPlanModal(false)}
                      className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                 </div>
                 
                 <PlanSelector
                    plans={FASTING_PLANS}
                    selectedPlan={activeFast ? activeFast.plan : selectedPlan}
                    onSelectPlan={(plan) => {
                        handlePlanSelect(plan);
                        setShowPlanModal(false);
                    }}
                    disabled={!!activeFast}
                  />
                  <div className="h-8"></div> {/* Spacing at bottom */}
              </div>
           </div>
        )}

        {/* Fast Completion Modal */}
        {showCompletionModal && lastCompletedFast && (
            <FastCompletionModal 
                fast={lastCompletedFast} 
                onClose={() => setShowCompletionModal(false)} 
            />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-50 pb-safe pt-3 px-4 shadow-[0_-4px_25px_rgba(200,180,227,0.15)] z-40 h-24 rounded-t-3xl">
        <div className="flex justify-between items-center h-full pb-4 max-w-sm mx-auto px-4">
          <button 
            onClick={() => setActiveTab('timer')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors w-16 ${activeTab === 'timer' ? 'text-brand-lavender-dark' : 'text-gray-300 hover:text-brand-lavender'}`}
          >
            <HomeIcon className={`w-7 h-7 ${activeTab === 'timer' ? 'fill-brand-lavender/20 stroke-brand-lavender-dark' : 'stroke-current'}`} />
            <span className="text-[10px] font-bold">Início</span>
          </button>

          <button 
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors w-16 ${activeTab === 'journal' ? 'text-brand-lavender-dark' : 'text-gray-300 hover:text-brand-lavender'}`}
          >
             <JournalIcon className={`w-7 h-7 ${activeTab === 'journal' ? 'fill-brand-lavender/20 stroke-brand-lavender-dark' : 'stroke-current'}`} />
             <span className="text-[10px] font-bold">Diário</span>
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors w-16 ${activeTab === 'dashboard' ? 'text-brand-lavender-dark' : 'text-gray-300 hover:text-brand-lavender'}`}
          >
            <UserCircleIcon className={`w-7 h-7 ${activeTab === 'dashboard' ? 'fill-brand-lavender/20 stroke-brand-lavender-dark' : 'stroke-current'}`} />
            <span className="text-[10px] font-bold">Painel</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
