import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';

// Música de fundo
const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_67c89907e1.mp3?filename=happy-children-111912.mp3';

const BackgroundMusic: React.FC = () => {
  const { settings, updateSettings } = useGameContext();
  const [showStartButton, setShowStartButton] = useState(true);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // Ao montar o componente, criar o elemento de áudio
  useEffect(() => {
    // Criar elemento de áudio
    const audioElement = document.createElement('audio');
    audioElement.id = 'background-music';
    audioElement.loop = true;
    audioElement.volume = 0.3;
    audioElement.src = MUSIC_URL;
    audioElement.preload = 'auto';
    
    // Adicionar à página
    document.body.appendChild(audioElement);
    audioElementRef.current = audioElement;
    
    // Ao desmontar, remover o elemento de áudio
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.remove();
      }
    };
  }, []);
  
  // Atualizar a reprodução quando as configurações mudarem
  useEffect(() => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;
    
    if (settings.backgroundMusic) {
      try {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Erro ao reproduzir música:', error);
          });
        }
      } catch (error) {
        console.error('Erro ao tentar reproduzir música:', error);
      }
    } else {
      audioElement.pause();
    }
  }, [settings.backgroundMusic]);
  
  // Função para iniciar a música
  const handleStartMusic = () => {
    if (!audioElementRef.current) return;
    
    try {
      // Ativar a configuração de música
      updateSettings({ backgroundMusic: true });
      
      // Tentar reproduzir
      const playPromise = audioElementRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Se reproduzido com sucesso, esconder o botão
            setShowStartButton(false);
          })
          .catch(error => {
            console.error('Falha ao reproduzir música:', error);
            // Manter o botão visível em caso de erro
          });
      }
    } catch (error) {
      console.error('Erro ao iniciar música:', error);
    }
  };
  
  // Não mostrar o botão se a música estiver desativada nas configurações
  if (!settings.backgroundMusic) {
    return null;
  }
  
  // Mostrar o botão para iniciar a música
  if (showStartButton) {
    return (
      <motion.div
        className="fixed bottom-20 right-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="bg-primary text-white px-4 py-3 rounded-lg shadow-lg flex items-center font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartMusic}
        >
          <span className="text-2xl mr-2">🎵</span>
          <span>Iniciar Música</span>
        </motion.button>
      </motion.div>
    );
  }
  
  return null;
};

export default BackgroundMusic; 