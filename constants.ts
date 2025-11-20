import { FastingPlan } from './types';

export const FASTING_PLANS: FastingPlan[] = [
  { name: '16:8', hours: 16, description: 'Jejum de 16 horas, com uma janela de alimentação de 8 horas. Ótimo para iniciantes.' },
  { name: '18:6', hours: 18, description: 'Jejum de 18 horas, com uma janela de alimentação de 6 horas. Um passo adiante.' },
  { name: '20:4', hours: 20, description: 'Jejum de 20 horas, com uma janela de alimentação de 4 horas. Mais avançado.' },
  { name: 'OMAD', hours: 23, description: 'Uma Refeição Por Dia. Jejum por 23 horas.' },
  { name: '36 Horas', hours: 36, description: 'Um dia inteiro de jejum. Consulte um médico antes de tentar.' },
];
