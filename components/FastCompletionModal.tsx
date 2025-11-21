
import React, { useMemo } from 'react';
import { CompletedFast } from '../types';
import { ShareIcon, XMarkIcon, TrophyIcon } from './icons/Icons';
import { MOTIVATIONAL_QUOTES } from '../constants';

interface FastCompletionModalProps {
  fast: CompletedFast;
  onClose: () => void;
}

const FastCompletionModal: React.FC<FastCompletionModalProps> = ({ fast, onClose }) => {
  
  // Seleciona uma frase aleatória apenas quando o componente é montado
  const motivationalQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  const durationText = formatDuration(fast.durationSeconds);

  const handleShare = async () => {
    const shareText = `Acabei de completar um jejum de ${durationText} no app Jejum Magras Magras! "${motivationalQuote}" 💪✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Conquista no Jejum Magras Magras',
          text: shareText,
        });
      } catch (error) {
        console.log('Erro ao compartilhar', error);
      }
    } else {
      // Fallback para copiar para área de transferência
      try {
          await navigator.clipboard.writeText(shareText);
          alert('Texto copiado para a área de transferência!');
      } catch (err) {
          console.error('Falha ao copiar', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden animate-pop-in flex flex-col items-center text-center">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-pink/20 to-transparent rounded-t-[2.5rem]"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-lavender/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 w-32 h-32 bg-brand-pink/20 rounded-full blur-3xl"></div>

        {/* Icon */}
        <div className="relative mb-6 mt-4">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-pink to-brand-lavender rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/40 animate-pulse-slow">
                <TrophyIcon className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 text-2xl">✨</div>
            <div className="absolute -top-1 -left-2 text-xl">🎉</div>
        </div>

        <h2 className="text-3xl font-bold text-brand-dark mb-2 relative z-10">Parabéns!</h2>
        <p className="text-brand-lavender-dark font-medium mb-6 relative z-10">Você completou seu jejum</p>

        <div className="bg-gray-50 rounded-2xl px-8 py-4 mb-6 border border-gray-100 shadow-sm w-full relative z-10">
            <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Tempo Total</span>
            <span className="text-4xl font-bold text-brand-pink tracking-tight">{durationText}</span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-8 px-2 italic relative z-10">
          "{motivationalQuote}"
        </p>

        <div className="flex flex-col gap-3 w-full relative z-10">
            <button 
                onClick={handleShare}
                className="w-full py-4 bg-brand-lavender text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-lavender/40 hover:bg-brand-lavender-dark transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <ShareIcon className="w-5 h-5" />
                Compartilhar Conquista
            </button>
            
            <button 
                onClick={onClose}
                className="w-full py-3 text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
                Fechar
            </button>
        </div>

      </div>
    </div>
  );
};

export default FastCompletionModal;
