
import React, { useState, useEffect } from 'react';
import { DailyLog, BodyMeasurements, BloodLevels } from '../types';
import { CalendarIcon, ScaleIcon, RulerIcon, DropIcon, WaterIcon, PlusSmallIcon, XMarkIcon } from './icons/Icons';

const JournalSession: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [modalOpen, setModalOpen] = useState<'measurements' | 'weight' | 'blood' | null>(null);

  // Temporary state for modal inputs
  const [tempMeasurements, setTempMeasurements] = useState<BodyMeasurements>({});
  const [tempWeight, setTempWeight] = useState<string>('');
  const [tempBlood, setTempBlood] = useState<BloodLevels>({});

  // Load logs from local storage
  useEffect(() => {
    const savedLogs = localStorage.getItem('journalLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save logs
  const saveLog = (newLog: DailyLog) => {
    const dateKey = newLog.date;
    const updatedLogs = { ...logs, [dateKey]: newLog };
    setLogs(updatedLogs);
    localStorage.setItem('journalLogs', JSON.stringify(updatedLogs));
  };

  const getDateKey = (date: Date) => date.toISOString().split('T')[0];
  const currentKey = getDateKey(selectedDate);
  const currentLog = logs[currentKey] || { date: currentKey };

  // Calendar Generation (Current week centered)
  const getCalendarDays = () => {
    const days = [];
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 3); // Start 3 days back

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Handlers
  const handleWaterAdd = () => {
    const currentWater = currentLog.waterIntake || 0;
    saveLog({ ...currentLog, waterIntake: currentWater + 1 });
  };
  
  const handleWaterRemove = () => {
    const currentWater = currentLog.waterIntake || 0;
    if (currentWater > 0) {
        saveLog({ ...currentLog, waterIntake: currentWater - 1 });
    }
  };

  const handleSaveMeasurements = () => {
    saveLog({ ...currentLog, measurements: { ...currentLog.measurements, ...tempMeasurements } });
    setModalOpen(null);
  };

  const handleSaveWeight = () => {
    const weightVal = parseFloat(tempWeight);
    if (!isNaN(weightVal)) {
      saveLog({ ...currentLog, weight: weightVal });
    }
    setModalOpen(null);
  };

  const handleSaveBlood = () => {
    saveLog({ ...currentLog, bloodLevels: { ...currentLog.bloodLevels, ...tempBlood } });
    setModalOpen(null);
  };

  // Initialize temp state when modal opens
  const openModal = (type: 'measurements' | 'weight' | 'blood') => {
    if (type === 'measurements') setTempMeasurements(currentLog.measurements || {});
    if (type === 'weight') setTempWeight(currentLog.weight?.toString() || '');
    if (type === 'blood') setTempBlood(currentLog.bloodLevels || {});
    setModalOpen(type);
  };

  const weekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-4 scroll-smooth">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-lavender-dark">Diário</h2>
          <div className="p-2 bg-brand-lavender/10 rounded-full text-brand-lavender">
              <CalendarIcon className="w-6 h-6" />
          </div>
      </div>

      {/* Calendar Strip */}
      <div className="mb-8">
         <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide pl-1">
            {months[selectedDate.getMonth()]}. {selectedDate.getFullYear()}
         </p>
         <div className="flex justify-between gap-2">
            {getCalendarDays().map((date, idx) => {
                const isSelected = getDateKey(date) === currentKey;
                const isToday = getDateKey(date) === getDateKey(new Date());
                return (
                    <button 
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center min-w-[3rem] h-16 rounded-2xl transition-all
                           ${isSelected 
                             ? 'bg-brand-lavender text-white shadow-lg shadow-brand-lavender/40 scale-105' 
                             : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                           }
                        `}
                    >
                        <span className="text-[10px] uppercase font-bold mb-1">{weekDays[date.getDay()]}</span>
                        <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {date.getDate()}
                        </span>
                        {isToday && !isSelected && <div className="w-1 h-1 bg-brand-pink rounded-full mt-1"></div>}
                    </button>
                )
            })}
         </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 mb-4">
         <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-blue-50 rounded-lg text-blue-400">
                    <WaterIcon className="w-5 h-5" />
                 </div>
                 <span className="font-bold text-gray-700">Hidratação</span>
             </div>
             <span className="text-xs text-gray-400 font-medium">
                {((currentLog.waterIntake || 0) * 0.25).toFixed(2)} L aprox.
             </span>
         </div>
         <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
             <button onClick={handleWaterRemove} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-brand-pink active:scale-95 transition-all">-</button>
             <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-dark">{currentLog.waterIntake || 0}</span>
                <span className="text-xs text-gray-400 uppercase font-medium">Copos</span>
             </div>
             <button onClick={handleWaterAdd} className="w-10 h-10 bg-brand-pink text-white rounded-xl shadow-lg shadow-brand-pink/30 flex items-center justify-center active:scale-95 transition-all">
                <PlusSmallIcon className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* Body Measurements */}
      <div className="bg-gray-900 p-5 rounded-3xl shadow-soft-lavender mb-4 relative overflow-hidden text-white">
          {/* Background subtle gradient to match screenshot vibe but kept clean */}
          <div className="flex justify-between items-center mb-4 relative z-10">
             <div className="flex items-center gap-2">
                 <RulerIcon className="w-5 h-5 text-gray-400" />
                 <span className="font-bold">Medições do corpo</span>
             </div>
             <button onClick={() => openModal('measurements')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                 <PlusSmallIcon className="w-5 h-5 text-white" />
             </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3 relative z-10">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-300">peito</span>
                  </div>
                  <span className="text-sm font-medium">{currentLog.measurements?.chest || '0.0'} cm</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-sm text-gray-300">cintura</span>
                  </div>
                  <span className="text-sm font-medium">{currentLog.measurements?.waist || '0.0'} cm</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-300">quadris</span>
                  </div>
                  <span className="text-sm font-medium">{currentLog.measurements?.hips || '0.0'} cm</span>
              </div>
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-300">coxa</span>
                  </div>
                  <span className="text-sm font-medium">{currentLog.measurements?.thigh || '0.0'} cm</span>
              </div>
          </div>
      </div>

      {/* Weight */}
      <div className="bg-gray-900 p-5 rounded-3xl shadow-soft-lavender mb-4 text-white">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                 <ScaleIcon className="w-5 h-5 text-gray-400" />
                 <span className="font-bold">Peso</span>
             </div>
             <button onClick={() => openModal('weight')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                 <PlusSmallIcon className="w-5 h-5 text-white" />
             </button>
          </div>
          <div className="text-center py-4">
              <span className="text-4xl font-bold tracking-tight">{currentLog.weight ? currentLog.weight.toFixed(2) : '--'}</span>
              <span className="text-gray-400 ml-2 font-medium">kg</span>
          </div>
          {currentLog.weight && (
             <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                 <div className="bg-white h-full w-1/2 rounded-full"></div>
             </div>
          )}
      </div>

      {/* Blood Levels */}
      <div className="bg-gray-900 p-5 rounded-3xl shadow-soft-lavender mb-8 text-white">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                 <DropIcon className="w-5 h-5 text-gray-400" />
                 <span className="font-bold">Níveis de sangue</span>
             </div>
             <button onClick={() => openModal('blood')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                 <PlusSmallIcon className="w-5 h-5 text-white" />
             </button>
          </div>
          
          <div className="flex justify-between items-end mb-1 px-1">
             <span className="text-[10px] text-gray-500 uppercase">Médias diárias</span>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span className="text-sm text-gray-300">cetonas</span>
                  </div>
                  <span className="text-sm font-medium">{currentLog.bloodLevels?.ketones ? currentLog.bloodLevels.ketones.toFixed(2) : '0.00'} mmol/L</span>
              </div>
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      <span className="text-sm text-gray-300">glicose</span>
                  </div>
                  <span className="text-sm font-medium">{currentLog.bloodLevels?.glucose ? currentLog.bloodLevels.glucose.toFixed(2) : '0.00'} mmol/L</span>
              </div>
          </div>
      </div>

      {/* Modals */}
      {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-brand-dark">
                          {modalOpen === 'measurements' && 'Medidas'}
                          {modalOpen === 'weight' && 'Registrar Peso'}
                          {modalOpen === 'blood' && 'Níveis Sanguíneos'}
                      </h3>
                      <button onClick={() => setModalOpen(null)} className="p-1 bg-gray-100 rounded-full">
                          <XMarkIcon className="w-5 h-5 text-gray-500" />
                      </button>
                  </div>

                  {modalOpen === 'measurements' && (
                      <div className="space-y-3">
                          {['chest', 'waist', 'hips', 'thigh'].map((part) => (
                              <div key={part} className="flex flex-col gap-1">
                                  <label className="text-xs font-bold text-gray-400 uppercase">{part === 'chest' ? 'Peito' : part === 'waist' ? 'Cintura' : part === 'hips' ? 'Quadris' : 'Coxa'}</label>
                                  <div className="flex items-center gap-2">
                                      <input 
                                          type="number" 
                                          className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 focus:outline-none focus:border-brand-pink font-bold text-brand-dark"
                                          placeholder="0.0"
                                          value={tempMeasurements[part as keyof BodyMeasurements] || ''}
                                          onChange={(e) => setTempMeasurements({...tempMeasurements, [part]: parseFloat(e.target.value)})}
                                      />
                                      <span className="text-gray-400 text-sm">cm</span>
                                  </div>
                              </div>
                          ))}
                          <button onClick={handleSaveMeasurements} className="w-full bg-brand-pink text-white py-3 rounded-xl font-bold mt-2">Salvar</button>
                      </div>
                  )}

                  {modalOpen === 'weight' && (
                      <div className="space-y-4">
                          <div className="flex items-center justify-center gap-3">
                               <input 
                                  type="number" 
                                  autoFocus
                                  className="w-32 text-center bg-gray-50 p-4 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-pink text-3xl font-bold text-brand-dark"
                                  placeholder="0.0"
                                  value={tempWeight}
                                  onChange={(e) => setTempWeight(e.target.value)}
                              />
                              <span className="text-gray-400 font-medium text-xl">kg</span>
                          </div>
                          <button onClick={handleSaveWeight} className="w-full bg-brand-pink text-white py-3 rounded-xl font-bold">Salvar Peso</button>
                      </div>
                  )}

                  {modalOpen === 'blood' && (
                      <div className="space-y-4">
                           <div className="flex flex-col gap-1">
                                  <label className="text-xs font-bold text-gray-400 uppercase">Cetonas</label>
                                  <div className="flex items-center gap-2">
                                      <input 
                                          type="number" 
                                          className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 focus:outline-none focus:border-brand-pink font-bold text-brand-dark"
                                          placeholder="0.0"
                                          value={tempBlood.ketones || ''}
                                          onChange={(e) => setTempBlood({...tempBlood, ketones: parseFloat(e.target.value)})}
                                      />
                                      <span className="text-gray-400 text-sm">mmol/L</span>
                                  </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                  <label className="text-xs font-bold text-gray-400 uppercase">Glicose</label>
                                  <div className="flex items-center gap-2">
                                      <input 
                                          type="number" 
                                          className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 focus:outline-none focus:border-brand-pink font-bold text-brand-dark"
                                          placeholder="0.0"
                                          value={tempBlood.glucose || ''}
                                          onChange={(e) => setTempBlood({...tempBlood, glucose: parseFloat(e.target.value)})}
                                      />
                                      <span className="text-gray-400 text-sm">mmol/L</span>
                                  </div>
                            </div>
                            <button onClick={handleSaveBlood} className="w-full bg-brand-pink text-white py-3 rounded-xl font-bold mt-2">Salvar</button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default JournalSession;
