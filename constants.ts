
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

export const MOTIVATIONAL_QUOTES: string[] = [
  "Mantenha-se focada para alcançar o objetivo que é ficar magra.",
  "Você é mais forte do que a sua vontade de comer.",
  "Cada hora de jejum é uma vitória brilhante para o seu corpo.",
  "A disciplina de hoje é a liberdade e a leveza de amanhã.",
  "Seu corpo é seu templo, cuide dele com carinho e respeito.",
  "O sabor da vitória é infinitamente melhor que o sabor de qualquer comida momentânea.",
  "Não troque o que você mais quer na vida pelo que você quer agora.",
  "Você está no controle absoluto, não a comida.",
  "Ame-se o suficiente para viver de forma saudável e plena.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Emagrecer é a única coisa que você perde e fica imensamente feliz!",
  "Acredite: você está se transformando na sua melhor e mais linda versão.",
  "Foco na meta, força na luta e fé na vitória.",
  "Desistir não acelera o processo. Continue firme, magra e maravilhosa!",
  "Se fosse fácil, todo mundo faria. Você é extraordinária.",
  "Sinta orgulho de cada 'não' que você disse para a tentação.",
  "A dor do sacrifício passa, a glória do resultado fica para sempre.",
  "Você não chegou até aqui para parar agora. Continue brilhando.",
  "Seu corpo agradece cada momento de descanso digestivo.",
  "Magra, saudável e feliz: esse é o seu destino traçado."
];
