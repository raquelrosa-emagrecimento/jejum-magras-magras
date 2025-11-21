
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { CompletedFast } from '../types';
import { ShareIcon, XMarkIcon, TrophyIcon } from './icons/Icons';
import { MOTIVATIONAL_QUOTES } from '../constants';

interface FastCompletionModalProps {
  fast: CompletedFast;
  onClose: () => void;
}

const FastCompletionModal: React.FC<FastCompletionModalProps> = ({ fast, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  
  // Seleciona uma frase aleatória apenas quando o componente é montado
  const motivationalQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  // Função para tocar o som de vitória usando Web Audio API (sem arquivos externos)
  const playVictorySound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Melodia de Vitória (Acorde Maior Ascendente): C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((note, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Tipo de onda: Sine é suave e agradável
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime + index * 0.1); // 100ms entre cada nota
        
        // Envelope de volume (Fade in rápido -> Fade out suave)
        const startTime = ctx.currentTime + index * 0.1;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05); // Ataque
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); // Release suave
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });

    } catch (e) {
      console.error("Erro ao reproduzir som de vitória", e);
    }
  };

  // Toca o som ao montar o componente
  useEffect(() => {
    playVictorySound();
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
    if (!cardRef.current || isSharing) return;
    setIsSharing(true);

    try {
        // @ts-ignore - html2canvas is loaded via CDN in index.html
        if (typeof window.html2canvas === 'undefined') {
            // Fallback simples de texto se a lib não carregou
            const shareText = `Acabei de completar um jejum de ${durationText} no app Jejum Magras Magras! "${motivationalQuote}" 💪✨`;
             if (navigator.share) {
                await navigator.share({ title: 'Minha Conquista', text: shareText });
             } else {
                await navigator.clipboard.writeText(shareText);
                alert('Texto copiado!');
             }
             setIsSharing(false);
             return;
        }

        // @ts-ignore
        const canvas = await window.html2canvas(cardRef.current, {
            scale: 3, // Alta qualidade
            backgroundColor: '#FFFFFF', // FUNDO BRANCO FORÇADO
            logging: false,
            useCORS: true,
            // Ignora os botões na hora da foto para ficar um card limpo
            ignoreElements: (element: Element) => {
                return element.classList.contains('share-ignore');
            },
            onclone: (clonedDoc: Document) => {
                // Torna o rodapé visível APENAS na imagem gerada
                const footer = clonedDoc.querySelector('.share-footer');
                if (footer) {
                    const el = footer as HTMLElement;
                    el.style.height = 'auto';
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                    el.style.marginTop = '24px';
                    el.style.display = 'block';
                }
            }
        });

        canvas.toBlob(async (blob: Blob | null) => {
            if (!blob) {
                setIsSharing(false);
                return;
            }

            const file = new File([blob], 'jejum-conquista.png', { type: 'image/png' });
            const shareData = {
                files: [file],
                title: 'Minha Conquista no Jejum',
                text: `Consegui jejuar por ${durationText}! 💪✨ #JejumMagrasMagras`
            };

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Cancelado ou erro no compartilhamento nativo', err);
                }
            } else {
                // Fallback: Baixar a imagem
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'jejum-conquista.png';
                link.click();
            }
            setIsSharing(false);
        });

    } catch (error) {
        console.error('Erro ao gerar imagem', error);
        setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* O container principal é o que será capturado pelo html2canvas */}
      <div 
        ref={cardRef}
        className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden animate-pop-in flex flex-col items-center text-center border-2 border-gray-100"
      >
        
        {/* Background Effects - Aumentado opacidade significativamente para contraste */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-brand-pink/70 to-transparent rounded-t-[2.5rem] pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-lavender/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 -left-10 w-32 h-32 bg-brand-pink/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Icon */}
        <div className="relative mb-6 mt-4 z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-pink to-brand-lavender rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/40 animate-pulse-slow">
                <TrophyIcon className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 text-2xl">✨</div>
            <div className="absolute -top-1 -left-2 text-xl">🎉</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">Parabéns!</h2>
        <p className="text-gray-600 font-medium mb-6 relative z-10">Você completou seu jejum</p>

        <div className="bg-gray-50 rounded-2xl px-8 py-4 mb-6 border border-gray-200 shadow-sm w-full relative z-10">
            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tempo Total</span>
            {/* Mudado para Lavender Dark para melhor leitura no fundo branco do que o rosa claro */}
            <span className="text-4xl font-bold text-brand-lavender-dark tracking-tight">{durationText}</span>
        </div>

        <p className="text-gray-800 text-sm font-medium leading-relaxed mb-8 px-2 italic relative z-10 min-h-[3rem] flex items-center justify-center">
          "{motivationalQuote}"
        </p>

        {/* 
           A classe 'share-ignore' é usada na função handleShare para dizer ao html2canvas 
           para NÃO incluir esta div na imagem gerada. Assim, o print sai limpo.
        */}
        <div className="flex flex-col gap-3 w-full relative z-10 share-ignore">
            <button 
                onClick={handleShare}
                disabled={isSharing}
                className="w-full py-4 bg-brand-lavender text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-lavender/40 hover:bg-brand-lavender-dark transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:scale-100"
            >
                {isSharing ? (
                    <span className="animate-pulse">Gerando imagem...</span>
                ) : (
                    <>
                        <ShareIcon className="w-5 h-5" />
                        Compartilhar Box
                    </>
                )}
            </button>
            
            <button 
                onClick={onClose}
                className="w-full py-3 text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
                Fechar
            </button>
        </div>
        
        {/* Rodapé visível apenas na imagem gerada (controlado via onclone) */}
        <div className="share-footer h-0 opacity-0 overflow-hidden w-full scale-0">
             <p className="text-brand-lavender font-bold text-sm text-center">#JejumMagrasMagras</p>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1 text-center">App Jejum Magras Magras</p>
        </div>

      </div>
    </div>
  );
};

export default FastCompletionModal;
