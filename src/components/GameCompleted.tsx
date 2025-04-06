import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';
import confetti from 'canvas-confetti';
import { formatTime } from '../utils/helpers';

// Não tem como saber o código exato, mas buscarei a URL e a substituirei
const VICTORY_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c204e69023.mp3?filename=success-1-6297.mp3';

interface GameCompletedProps {
  onStartNewGame: () => void;
}

/**
 * Componente exibido quando o jogador completa todas as palavras disponíveis
 */
const GameCompleted: React.FC<GameCompletedProps> = ({ onStartNewGame }) => {
  const { playerProgress, startNewGame, settings } = useGameContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Tocar música de vitória e disparar confetti ao renderizar o componente
  useEffect(() => {
    // Configuração do confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    // Tocar música de vitória se os efeitos sonoros estiverem ativados
    if (settings.soundEffects) {
      try {
        console.log('GameCompleted: Tentando tocar música de vitória');
        const audio = new Audio();
        audio.src = VICTORY_MUSIC_URL;
        audio.volume = 0.5;
        
        // Carregar o áudio primeiro
        audio.addEventListener('canplaythrough', () => {
          console.log('GameCompleted: Música de vitória carregada, tentando reproduzir');
          // Tentar reproduzir com tratamento para bloqueio de autoplay
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('GameCompleted: Erro ao reproduzir música de vitória', error);
              
              // Mostrar botão para tocar manualmente se houver erro
              const playButton = document.createElement('button');
              playButton.innerHTML = '🎵 Tocar Música';
              playButton.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50';
              playButton.onclick = () => {
                audio.play().catch(e => console.error('Erro ao tocar música:', e));
                playButton.remove();
              };
              document.body.appendChild(playButton);
            });
          }
        });
        
        audio.addEventListener('error', (e) => {
          console.error('GameCompleted: Erro ao carregar música de vitória', e);
        });
        
        audioRef.current = audio;
      } catch (error) {
        console.error('GameCompleted: Erro ao configurar áudio de vitória', error);
      }
    }
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Confetti por toda a tela
      confetti({
        particleCount,
        spread: randomInRange(50, 100),
        origin: { y: 0.6, x: randomInRange(0.1, 0.9) }
      });
    }, 250);
    
    // Limpeza ao desmontar o componente
    return () => {
      clearInterval(confettiInterval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [settings.soundEffects]);
  
  // Ordenar sessões por pontuação (maior primeiro)
  const sortedSessions = [...playerProgress.sessionsHistory]
    .sort((a, b) => b.score - a.score || a.timeElapsed - b.timeElapsed);
  
  // Encontrar a sessão atual (a mais recente)
  const currentSession = playerProgress.sessionsHistory.length > 0 
    ? playerProgress.sessionsHistory[playerProgress.sessionsHistory.length - 1] 
    : null;
  
  // Verificar se a pontuação atual é um recorde pessoal
  const isHighScore = currentSession && sortedSessions.length > 1 && 
    sortedSessions[0].id === currentSession.id && 
    currentSession.score > (sortedSessions[1]?.score || 0);
  
  // Manipulador para iniciar um novo jogo
  const handleStartNewGame = () => {
    startNewGame();
    if (onStartNewGame) onStartNewGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <motion.div 
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary font-fredoka mb-2">
            🎉 Parabéns! 🎉
          </h2>
          <p className="text-xl text-gray-700 font-comic">
            Você completou todas as palavras!
          </p>
          
          {isHighScore && (
            <motion.div 
              className="mt-2 text-lg text-yellow-600 font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ⭐ Novo Recorde Pessoal! ⭐
            </motion.div>
          )}
        </div>
        
        {currentSession && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-fredoka text-xl text-blue-800 mb-2">Sua Pontuação:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <p className="text-gray-500 text-sm">Pontos</p>
                <p className="text-2xl font-bold text-blue-600">{currentSession.score}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <p className="text-gray-500 text-sm">Tempo</p>
                <p className="text-2xl font-bold text-green-600">{formatTime(currentSession.timeElapsed)}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h3 className="font-fredoka text-xl text-gray-800 mb-2">Ranking:</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-3 text-left">#</th>
                  <th className="py-2 px-3 text-left">Data</th>
                  <th className="py-2 px-3 text-right">Pontos</th>
                  <th className="py-2 px-3 text-right">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {sortedSessions.slice(0, 5).map((session, index) => {
                  const isCurrent = session.id === currentSession?.id;
                  return (
                    <tr 
                      key={session.id} 
                      className={`border-b ${isCurrent ? 'bg-yellow-50 font-medium' : ''}`}
                    >
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-right">{session.score}</td>
                      <td className="py-2 px-3 text-right">{formatTime(session.timeElapsed)}</td>
                    </tr>
                  );
                })}
                
                {sortedSessions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      Nenhuma partida registrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleStartNewGame}
            className="btn bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Jogar Novamente
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCompleted; 