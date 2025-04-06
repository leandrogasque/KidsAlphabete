import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AudioButtonProps {
  text: string;
  onPlay?: () => void;
  autoPlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Componente que reproduz áudio ao ser clicado usando a Web Speech API
 * @param text - Texto a ser falado
 * @param onPlay - Função chamada quando o áudio começa a tocar
 * @param autoPlay - Se o áudio deve ser reproduzido automaticamente
 * @param className - Classes CSS adicionais
 * @param children - Conteúdo a ser renderizado dentro do botão
 */
const AudioButton = ({ text, onPlay, autoPlay = false, className = '', children }: AudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    if (onPlay) onPlay();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Velocidade um pouco mais lenta para crianças
    utterance.pitch = 1.2; // Tom um pouco mais alto (infantil)
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoPlay) {
      speakText();
    }
  }, [autoPlay]);

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