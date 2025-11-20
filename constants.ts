
import { FastingPlan, TimelineEvent } from './types';

export const FASTING_PLANS: FastingPlan[] = [
  { name: '16:8', hours: 16, description: 'Jejum de 16 horas, com uma janela de alimentação de 8 horas. Ótimo para iniciantes.' },
  { name: '18:6', hours: 18, description: 'Jejum de 18 horas, com uma janela de alimentação de 6 horas. Um passo adiante.' },
  { name: '20:4', hours: 20, description: 'Jejum de 20 horas, com uma janela de alimentação de 4 horas. Mais avançado.' },
  { name: 'OMAD', hours: 23, description: 'Uma Refeição Por Dia. Jejum por 23 horas.' },
  { name: '36 Horas', hours: 36, description: 'Um dia inteiro de jejum. Consulte um médico antes de tentar.' },
];

export const METABOLIC_TIMELINE: TimelineEvent[] = [
  {
    hour: 12,
    title: "Início da Queima de Gordura",
    description: "O corpo começa a entrar no estado de lipólise. Os níveis de insulina caem significativamente e o corpo para de usar glicose para acessar a gordura estocada.",
    benefits: ["Sensação de fome diminui", "Clareza mental leve", "Acesso à gordura estocada"]
  },
  {
    hour: 14,
    title: "Queima de Gordura Aumentando",
    description: "A lipólise se intensifica e mais ácidos graxos são liberados para virar energia. O metabolismo começa a ficar mais eficiente.",
    benefits: ["Leve energia", "Leve foco", "Redução do inchaço"]
  },
  {
    hour: 16,
    title: "Estado Metabólico Ideal",
    description: "Começa a produção maior de corpos cetônicos. O corpo fica mais estável e calmo. Início da autofagia leve (reciclagem celular).",
    benefits: ["Menos picos de fome", "Reciclagem celular inicial", "Estabilidade emocional"]
  },
  {
    hour: 18,
    title: "Autofagia Moderada",
    description: "A limpeza celular aumenta. O corpo começa a reparar tecidos e reduzir inflamações sistêmicas.",
    benefits: ["Ação anti-inflamatória", "Melhora na função celular", "Energia mais estável"]
  },
  {
    hour: 20,
    title: "Pico de Cetose Leve",
    description: "Os níveis de corpos cetônicos ficam bem mais altos. O cérebro funciona com energia 'limpa' e o foco mental aumenta.",
    benefits: ["Muita clareza mental", "Redução significativa da fome", "Aumento de disposição"]
  },
  {
    hour: 22,
    title: "Reparação Celular Avançada",
    description: "A autofagia se intensifica. Células danificadas são usadas como energia e há uma redução de marcadores inflamatórios.",
    benefits: ["Reparação profunda", "Maior sensibilidade à insulina", "Saúde interna otimizada"]
  },
  {
    hour: 24,
    title: "Reset Metabólico Leve",
    description: "Grande parte do glicogênio hepático já foi usada. O sistema imunológico é otimizado e o corpo depende fortemente da gordura.",
    benefits: ["Redução acentuada de inchaço", "Mente clara", "Metabolismo eficiente"]
  }
];
