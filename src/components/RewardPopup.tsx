import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardPopupProps {
  show: boolean;
  type: 'points' | 'badge' | 'level';
  value: number | string;
  message: string;
  onClose: () => void;
}

/**
 * Componente que exibe um popup de recompensa quando o jogador ganha pontos ou badges
 */
const RewardPopup: React.FC<RewardPopupProps> = ({ show, type, value, message, onClose }) => {
  useEffect(() => {
    if (show) {
      // Fechar automaticamente após 3 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  // Definir o ícone com base no tipo de recompensa
  const getIcon = () => {
    switch (type) {
      case 'points':
        return '⭐';
      case 'badge':
        return '🏆';
      case 'level':
        return '🎮';
      default:
        return '🎉';
    }
  };

  // Definir a cor de fundo com base no tipo de recompensa
  const getBgColor = () => {
    switch (type) {
      case 'points':
        return 'bg-yellow-100 border-yellow-400';
      case 'badge':
        return 'bg-purple-100 border-purple-400';
      case 'level':
        return 'bg-blue-100 border-blue-400';
      default:
        return 'bg-green-100 border-green-400';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
        >
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`rounded-lg shadow-lg p-4 border-2 ${getBgColor()} max-w-xs`}
          >
            <div className="flex items-center">
              <div className="text-4xl mr-3">
                {getIcon()}
              </div>
              <div>
                <h3 className="font-fredoka text-lg font-bold text-gray-800">
                  {type === 'points' ? `+${value} pontos!` : 
                   type === 'badge' ? `Nova conquista!` : 
                   `Nível ${value} alcançado!`}
                </h3>
                <p className="text-sm text-gray-600 font-comic">{message}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardPopup; 