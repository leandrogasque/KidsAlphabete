import React, { useState, useEffect } from 'react';
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
  
  const handleToggleMusic = () => {
    const newMusicState = !settings.backgroundMusic;
    console.log('AudioControls: Alternando música para', newMusicState);
    
    // Obter o elemento de áudio criado pelo BackgroundMusic
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    
    if (newMusicState && audioElement) {
      try {
        console.log('AudioControls: Tentando iniciar música diretamente');
        // Tentar reproduzir
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('AudioControls: Erro ao reproduzir música:', error);
          });
        }
      } catch (error) {
        console.error('AudioControls: Erro ao iniciar música:', error);
      }
    } else if (audioElement) {
      audioElement.pause();
    }
    
    // Atualizar configuração
    updateSettings({ backgroundMusic: newMusicState });
  };
  
  const handleToggleSoundEffects = () => {
    console.log('AudioControls: Alternando efeitos sonoros', { atual: settings.soundEffects });
    updateSettings({ soundEffects: !settings.soundEffects });
  };

  // Ícones para os botões
  const getMusicIcon = () => {
    if (settings.backgroundMusic) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 9.5l-3-3m0 0l-3-3m3 3H9.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.5 5.5 0 010 7.424" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.414a8 8 0 1112.828 0M12 6v6m0 0l-3-3m3 3l3-3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
        </svg>
      );
    }
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-20`}>
      <motion.div 
        className="relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Botão principal */}
        <motion.button 
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow text-xl ${settings.backgroundMusic ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={settings.backgroundMusic ? "Música ligada - Clique para configurações" : "Música desligada - Clique para configurações"}
          animate={settings.backgroundMusic ? { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={settings.backgroundMusic ? { 
            repeat: Infinity, 
            repeatDelay: 2, 
            duration: 0.8 
          } : {}}
        >
          {settings.backgroundMusic ? '🎵' : '🔇'}
        </motion.button>
        
        {/* Painel de controles */}
        {isOpen && (
          <motion.div 
            className="absolute bottom-full right-0 mb-2 bg-white p-4 rounded-lg shadow-lg min-w-[200px]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-md font-medium flex items-center">
                  <span className="mr-2 text-lg">🎵</span> Música
                </span>
                <button 
                  onClick={handleToggleMusic}
                  className={`w-14 h-7 rounded-full relative ${settings.backgroundMusic ? 'bg-primary' : 'bg-gray-300'} transition-colors duration-300`}
                >
                  <motion.span 
                    className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md"
                    animate={{ x: settings.backgroundMusic ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-md font-medium flex items-center">
                  <span className="mr-2 text-lg">🔊</span> Efeitos
                </span>
                <button 
                  onClick={handleToggleSoundEffects}
                  className={`w-14 h-7 rounded-full relative ${settings.soundEffects ? 'bg-primary' : 'bg-gray-300'} transition-colors duration-300`}
                >
                  <motion.span 
                    className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md"
                    animate={{ x: settings.soundEffects ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AudioControls; 