
import { FastingPlan, TimelineEvent } from './types';

export const FASTING_PLANS: FastingPlan[] = [
  { name: '12 Horas', hours: 12, description: 'Janela de 12h. O ponto de partida ideal para se acostumar com o jejum.' },
  { name: '14 Horas', hours: 14, description: 'Aumenta a queima de gordura e começa a melhorar a sensibilidade à insulina.' },
  { name: '16 Horas', hours: 16, description: 'O popular 16:8. Ideal para perda de peso e controle metabólico diário.' },
  { name: '18 Horas', hours: 18, description: 'Jejum mais profundo. Aumenta a autofagia e reduz inflamações.' },
  { name: '20 Horas', hours: 20, description: 'Dieta do Guerreiro. Janela curta de alimentação para foco mental intenso.' },
  { name: '22 Horas', hours: 22, description: 'Quase um dia completo (OMAD). Maximize a queima de gordura.' },
  { name: '24 Horas', hours: 24, description: 'Jejum de dia inteiro. Reset completo do sistema digestivo.' },
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
