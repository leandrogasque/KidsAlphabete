import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';

interface AudioControlsProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

const AudioControls: React.FC<AudioControlsProps> = ({ position = 'top-right' }) => {
  const { settings, updateSettings } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4',
  };
  
  // Simplesmente alterna a configuração de música de fundo
  const handleToggleMusic = () => {
    updateSettings({ backgroundMusic: !settings.backgroundMusic });
  };
  
  // Alterna a configuração de efeitos sonoros
  const handleToggleSoundEffects = () => {
    updateSettings({ soundEffects: !settings.soundEffects });
  };
  
  // Alterna o menu de áudio
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {isOpen ? (
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-3 min-w-[200px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-700">Configurações de Áudio</h3>
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div 
              className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={handleToggleMusic}
            >
              <span className="flex items-center">
                <span className={`mr-2 text-xl ${settings.backgroundMusic ? 'text-primary' : 'text-gray-400'}`}>
                  🎵
                </span>
                <span>Música de Fundo</span>
              </span>
              <div className={`w-10 h-6 rounded-full p-1 ${settings.backgroundMusic ? 'bg-primary' : 'bg-gray-300'}`}>
                <div 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    settings.backgroundMusic ? 'translate-x-4' : ''
                  }`} 
                />
              </div>
            </div>
            
            <div 
              className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={handleToggleSoundEffects}
            >
              <span className="flex items-center">
                <span className={`mr-2 text-xl ${settings.soundEffects ? 'text-primary' : 'text-gray-400'}`}>
                  🔊
                </span>
                <span>Efeitos Sonoros</span>
              </span>
              <div className={`w-10 h-6 rounded-full p-1 ${settings.soundEffects ? 'bg-primary' : 'bg-gray-300'}`}>
                <div 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    settings.soundEffects ? 'translate-x-4' : ''
                  }`} 
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          onClick={toggleMenu}
          className={`rounded-full p-3 shadow-lg ${
            settings.backgroundMusic ? 'bg-primary text-white' : 'bg-white text-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={settings.backgroundMusic ? {
            rotate: [0, 5, -5, 5, 0],
            scale: [1, 1.05, 1, 1.05, 1],
          } : {}}
          transition={settings.backgroundMusic ? { 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 3 
          } : {}}
          title={settings.backgroundMusic ? "Som está ativado" : "Som está desativado"}
        >
          {settings.backgroundMusic ? '🔊' : '🔇'}
        </motion.button>
      )}
    </div>
  );
};

export default AudioControls; 