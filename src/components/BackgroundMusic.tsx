/*
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';

// Usar URL externa direta para o arquivo de música
const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_67c89907e1.mp3?filename=happy-children-111912.mp3';

const BackgroundMusic: React.FC = () => {
  const { settings, updateSettings } = useGameContext();
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Criar elemento de áudio na montagem do componente
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      console.log('Áudio carregado com sucesso');
      setAudioLoaded(true);
      setAudioError(null);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Erro ao carregar áudio:', e);
      setAudioError('Falha ao carregar arquivo de áudio. Verifique sua conexão com a internet.');
      setAudioLoaded(false);
    });
    
    setAudioElement(audio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  // Manipulação do status de reprodução
  useEffect(() => {
    if (!audioElement || !audioLoaded) return;
    
    if (settings.backgroundMusic) {
      console.log('Tentando iniciar áudio...');
      audioElement.play()
        .then(() => console.log('Áudio iniciado com sucesso'))
        .catch(e => {
          console.error('Erro ao iniciar áudio:', e);
          setAudioError('Falha ao iniciar reprodução. Clique no botão para tentar novamente.');
        });
    } else {
      audioElement.pause();
    }
  }, [settings.backgroundMusic, audioElement, audioLoaded]);

  // Função para tentar iniciar a música manualmente
  const handlePlayMusic = () => {
    if (!audioElement) return;
    
    try {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Reprodução iniciada pelo botão');
            updateSettings({ backgroundMusic: true });
            setAudioError(null);
          })
          .catch(e => {
            console.error('Erro na reprodução pelo botão:', e);
            setAudioError(`Erro: ${e.message || 'Falha ao iniciar áudio'}`);
          });
      }
    } catch (error) {
      console.error('Erro ao manipular áudio:', error);
      setAudioError(`Erro: ${error instanceof Error ? error.message : 'Falha ao iniciar áudio'}`);
    }
  };

  // Estilo mais chamativo para o botão
  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white px-4 py-3 rounded-xl shadow-xl border-2 border-primary text-center max-w-sm">
        <h3 className="text-lg font-bold mb-2">🎵 Música do Jogo</h3>
        
        {audioError && (
          <div className="mb-3 p-2 bg-red-50 text-red-600 rounded text-sm">
            {audioError}
          </div>
        )}
        
        <button
          onClick={handlePlayMusic}
          className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <span className="text-2xl mr-2">▶️</span>
          Iniciar Música Agora
        </button>
        
        <p className="mt-2 text-xs text-gray-500">
          Clique no botão acima para iniciar a música de fundo.
        </p>
      </div>
    </div>
  );
};

export default BackgroundMusic;
*/ 