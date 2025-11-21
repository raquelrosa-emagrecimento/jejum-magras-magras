
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
                // Ajustes críticos para evitar corte e melhorar visual na imagem
                const footer = clonedDoc.querySelector('.share-footer');
                const cardContainer = clonedDoc.querySelector('.share-card-container');
                const footerTitle = clonedDoc.querySelector('.share-footer-title') as HTMLElement;
                const footerSub = clonedDoc.querySelector('.share-footer-sub') as HTMLElement;
                
                if (footer && cardContainer) {
                    const elFooter = footer as HTMLElement;
                    const elCard = cardContainer as HTMLElement;
                    
                    // Torna o rodapé visível
                    elFooter.style.height = 'auto';
                    elFooter.style.opacity = '1';
                    elFooter.style.transform = 'scale(1)';
                    elFooter.style.marginTop = '30px';
                    elFooter.style.display = 'block';
                    elFooter.style.paddingBottom = '20px';
                    
                    // Força cores escuras no rodapé
                    if (footerTitle) footerTitle.style.color = '#000000';
                    if (footerSub) footerSub.style.color = '#374151';

                    // Força o container a crescer
                    elCard.style.height = 'auto';
                    elCard.style.minHeight = 'auto';
                    elCard.style.paddingBottom = '50px';
                    // Remove border radius bottom para parecer continuação natural se necessário, ou mantém
                    // elCard.style.borderRadius = '40px';
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* O container principal que será capturado. */}
      <div 
        ref={cardRef}
        className="share-card-container bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative overflow-hidden animate-pop-in flex flex-col items-center text-center border-4 border-gray-100"
      >
        
        {/* Background Effects - Cores sólidas e fortes para garantir contraste no branco */}
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-pink-200 to-transparent rounded-t-[2.5rem] pointer-events-none opacity-100"></div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-300 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="absolute top-20 -left-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl pointer-events-none opacity-50"></div>

        {/* Icon */}
        <div className="relative mb-8 mt-4 z-10">
            <div className="w-28 h-28 bg-gradient-to-br from-brand-pink to-brand-lavender rounded-full flex items-center justify-center shadow-xl shadow-brand-pink/50 animate-pulse-slow ring-8 ring-white">
                <TrophyIcon className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-3 -right-3 text-3xl filter drop-shadow-md">✨</div>
            <div className="absolute -top-2 -left-2 text-2xl filter drop-shadow-md">🎉</div>
        </div>

        {/* Texto PRETO e GROSSO */}
        <h2 className="text-4xl font-black text-black mb-2 relative z-10 tracking-tight drop-shadow-sm">Parabéns!</h2>
        <p className="text-black font-bold mb-8 relative z-10 text-xl opacity-90">Você completou seu jejum</p>

        {/* Box de Tempo Destacado */}
        <div className="bg-white rounded-3xl px-8 py-8 mb-8 border-2 border-gray-200 shadow-md w-full relative z-10">
            <span className="block text-sm text-gray-600 uppercase font-extrabold tracking-widest mb-2">Tempo Total</span>
            {/* Roxo bem escuro */}
            <span className="text-6xl font-black text-purple-900 tracking-tighter">{durationText}</span>
        </div>

        {/* Frase Motivacional em Preto Bold */}
        <p className="text-black text-lg font-bold leading-relaxed mb-10 px-2 italic relative z-10 min-h-[4rem] flex items-center justify-center">
          "{motivationalQuote}"
        </p>

        {/* Botões (Removidos na imagem) */}
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
        
        {/* Rodapé oculto por padrão */}
        <div className="share-footer h-0 opacity-0 overflow-hidden w-full scale-0">
             <p className="share-footer-title text-black font-black text-xl text-center tracking-tight">#JejumMagrasMagras</p>
             <p className="share-footer-sub text-gray-800 text-xs uppercase font-bold tracking-[0.2em] mt-1 text-center">App Jejum Magras Magras</p>
        </div>

      </div>
    </div>
  );
};

export default FastCompletionModal;
