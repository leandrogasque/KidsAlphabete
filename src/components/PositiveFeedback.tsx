import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import AudioButton from './AudioButton';

interface PositiveFeedbackProps {
  text?: string;
  onComplete?: () => void;
  duration?: number;
  speechRate?: number; // Nova prop para controlar a velocidade da fala
}

/**
 * Componente que exibe uma animação e som de feedback positivo
 * @param text - Texto personalizado para o feedback
 * @param onComplete - Função chamada quando a animação terminar
 * @param duration - Duração do feedback em ms (padrão: 2000ms)
 * @param speechRate - Velocidade da fala (1.0 é normal, maior é mais rápido)
 */
const PositiveFeedback = ({ 
  text = "Muito bem! Você completou a palavra corretamente!", 
  onComplete,
  duration = 2000,
  speechRate = 1.2 // Voz um pouco mais rápida no feedback positivo
}: PositiveFeedbackProps) => {
  const [visible, setVisible] = useState(true);
  const didPlayAudio = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 300); // Um pequeno atraso após a animação de saída
      }
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  // Função para lidar com o início da reprodução do áudio
  const handleAudioPlay = () => {
    didPlayAudio.current = true;
  };

  // Variantes para a animação de confete
  const confettiVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Mais rápido, era 0.1
        duration: 0.3, // Mais rápido, era 0.5
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: 100,
      transition: {
        delay: i * 0.03, // Mais rápido, era 0.05
        duration: 0.2, // Mais rápido, era 0.3
      },
    }),
  };

  // Gera confetes coloridos
  const confetti = Array.from({ length: 20 }).map((_, i) => (
    <motion.div
      key={i}
      custom={i}
      variants={confettiVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'absolute',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6772E5'][i % 4],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  ));

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          {confetti}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.8, repeat: 1 }}
            >
              <span className="text-6xl mb-4 inline-block">⭐</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-primary mb-4 font-fredoka">Muito bem!</h2>
            <p className="text-xl text-gray-700 mb-6 font-comic">{text}</p>
            <AudioButton 
              text={text} 
              autoPlay={true} 
              className="hidden" 
              onPlay={handleAudioPlay}
              speechRate={speechRate}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PositiveFeedback;