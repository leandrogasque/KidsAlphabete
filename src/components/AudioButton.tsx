import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface AudioButtonProps {
  text: string;
  onPlay?: () => void;
  autoPlay?: boolean;
  className?: string;
  children?: React.ReactNode;
  speechRate?: number;
}

/**
 * Componente que reproduz áudio ao ser clicado usando a Web Speech API
 * @param text - Texto a ser falado
 * @param onPlay - Função chamada quando o áudio começa a tocar
 * @param autoPlay - Se o áudio deve ser reproduzido automaticamente
 * @param className - Classes CSS adicionais
 * @param children - Conteúdo a ser renderizado dentro do botão
 * @param speechRate - Velocidade da fala (1.0 é normal, maior é mais rápido)
 */
const AudioButton = ({ 
  text, 
  onPlay, 
  autoPlay = false, 
  className = '', 
  children,
  speechRate = 0.9
}: AudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  const speakText = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    if (onPlay) onPlay();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = speechRate;
    utterance.pitch = 1.2; // Tom um pouco mais alto (infantil)
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Evitar reprodução automática em nova renderização do mesmo componente
    if (autoPlay && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      speakText();
    }
    
    return () => {
      // Limpar qualquer reprodução pendente ao desmontar
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [autoPlay, text]);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={className}
      onClick={speakText}
      disabled={isPlaying}
    >
      {children}
    </motion.button>
  );
};

export default AudioButton;