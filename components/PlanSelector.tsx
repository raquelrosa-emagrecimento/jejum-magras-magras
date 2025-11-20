import React from 'react';
import { FastingPlan } from '../types';
import { CheckCircleIcon } from './icons/Icons';

interface PlanSelectorProps {
  plans: FastingPlan[];
  selectedPlan: FastingPlan;
  onSelectPlan: (plan: FastingPlan) => void;
  disabled?: boolean;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ plans, selectedPlan, onSelectPlan, disabled }) => {
  return (
    <div className="flex flex-col space-y-4">
      {disabled && (
         <div className="bg-brand-lavender/10 border border-brand-lavender/30 p-4 rounded-2xl text-sm text-brand-lavender-dark mb-2 text-center font-medium">
            Encerre o jejum atual para mudar de plano.
         </div>
      )}
      {plans.map((plan) => {
        const isSelected = selectedPlan.name === plan.name;
        return (
          <button
            key={plan.name}
            onClick={() => !disabled && onSelectPlan(plan)}
            disabled={disabled}
            className={`relative w-full text-left p-6 rounded-3xl transition-all duration-300 border-2 
              ${isSelected 
                ? 'bg-white border-brand-pink shadow-soft-lavender' 
                : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-gray-100'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-bold text-xl ${isSelected ? 'text-brand-pink' : 'text-gray-700'}`}>
                    {plan.name}
                </h3>
                <p className="text-sm font-medium text-brand-lavender mt-1">
                   Meta: {plan.hours} horas
                </p>
              </div>
              {isSelected && (
                <div className="text-brand-pink">
                    <CheckCircleIcon className="w-7 h-7 fill-current" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                {plan.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default PlanSelector;