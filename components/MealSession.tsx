
import React, { useState } from 'react';
import { UtensilsIcon, XMarkIcon, BookOpenIcon } from './icons/Icons';
import { BREAK_FAST_MENU } from '../constants';

const MealSession: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-4 scroll-smooth bg-white">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-lavender-dark">Refeições</h2>
          <div className="p-2 bg-brand-lavender/10 rounded-full text-brand-lavender">
              <UtensilsIcon className="w-6 h-6" />
          </div>
      </div>

       {/* Suggested Menu Button */}
       <button 
         onClick={() => setMenuOpen(true)}
         className="w-full bg-gradient-to-r from-brand-lavender to-brand-pink text-white rounded-2xl p-6 shadow-lg shadow-brand-pink/20 flex items-center justify-between group active:scale-98 transition-all"
       >
          <div className="flex items-center gap-4">
             <div className="bg-white/20 p-3 rounded-2xl">
                <BookOpenIcon className="w-8 h-8 text-white" />
             </div>
             <div className="text-left">
                <p className="font-bold text-xl leading-tight">Sugestão de Cardápio</p>
                <p className="text-sm text-white/80 font-medium mt-1">Opções para quebrar o jejum</p>
             </div>
          </div>
          <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
          </div>
       </button>

       {/* Menu Suggestions Modal */}
       {menuOpen && (
         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
             <div className="absolute inset-0" onClick={() => setMenuOpen(false)}></div>
             <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-300">
                 
                 {/* Header */}
                 <div className="flex justify-between items-center mb-6 px-2 flex-shrink-0">
                     <div>
                         <h2 className="text-2xl font-bold text-brand-dark">Cardápio Sugerido</h2>
                         <p className="text-brand-lavender-dark text-sm font-medium">Opções leves para quebrar o jejum</p>
                     </div>
                     <button 
                       onClick={() => setMenuOpen(false)}
                       className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                     >
                       <XMarkIcon className="w-6 h-6" />
                     </button>
                 </div>

                 {/* Content */}
                 <div className="overflow-y-auto pr-2 space-y-4 pb-8 flex-1">
                     {BREAK_FAST_MENU.map((item, index) => (
                         <div key={index} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
                                 <div className="bg-brand-lavender/10 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                                     {item.emoji}
                                 </div>
                                 <div>
                                     <p className="text-xs font-bold text-brand-pink uppercase tracking-wider">{item.day}</p>
                                     <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                 </div>
                             </div>
                             <ul className="space-y-2">
                                 {item.items.map((ing, idx) => (
                                     <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                         <span className="w-1.5 h-1.5 rounded-full bg-brand-lavender mt-1.5 flex-shrink-0"></span>
                                         <span>{ing}</span>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     ))}
                     
                     <div className="bg-blue-50 p-4 rounded-2xl text-center">
                         <p className="text-blue-800 text-xs font-bold">
                             ⚠️ Lembre-se: Mastigue bem os alimentos durante as refeições e Beba bastante água durante o dia.
                         </p>
                     </div>
                 </div>

             </div>
         </div>
       )}

    </div>
  );
};

export default MealSession;
