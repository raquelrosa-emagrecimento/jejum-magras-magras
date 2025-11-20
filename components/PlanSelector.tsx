
import React from 'react';
import { FastingPlan } from '../types';

interface PlanSelectorProps {
  plans: FastingPlan[];
  selectedPlan: FastingPlan;
  onSelectPlan: (plan: FastingPlan) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ plans, selectedPlan, onSelectPlan }) => {
  return (
    <div className="w-full max-w-lg mx-auto mt-4 text-center">
      <h3 className="text-lg font-semibold text-text-primary mb-3">Choose Your Fasting Plan</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {plans.map((plan) => (
          <button
            key={plan.name}
            onClick={() => onSelectPlan(plan)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary
              ${selectedPlan.name === plan.name
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-200 text-text-secondary hover:bg-accent hover:text-primary'
              }`}
          >
            {plan.name}
          </button>
        ))}
      </div>
       <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg min-h-[60px]">
        <p className="text-text-secondary">{selectedPlan.description}</p>
      </div>
    </div>
  );
};

export default PlanSelector;
