import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import AudioButton from './AudioButton';

interface NegativeFeedbackProps {
  text?: string;
  onComplete?: () => void;
  duration?: number;
}

/**
 * Componente que exibe uma animação e som de feedback negativo
 * @param text - Texto personalizado para o feedback
 * @param onComplete - Função chamada quando a animação terminar
 * @param duration - Duração do feedback em ms (padrão: 1500ms)
 */
const NegativeFeedback = ({ 
  text = "Tente novamente! Você consegue!", 
  onComplete,
  duration = 1500
}: NegativeFeedbackProps) => {
  const [visible, setVisible] = useState(true);

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

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md"
          >
            <motion.div
              animate={{ 
                x: [0, -10, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
            >
              <span className="text-6xl mb-4 inline-block">🤔</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-orange-500 mb-4 font-fredoka">Ops!</h2>
            <p className="text-xl text-gray-700 mb-6 font-comic">{text}</p>
            <AudioButton text={text} autoPlay={true} className="hidden" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NegativeFeedback; 