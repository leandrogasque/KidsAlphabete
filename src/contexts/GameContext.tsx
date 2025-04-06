import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  WordData, 
  LevelData, 
  GameMode, 
  levels, 
  gameModes, 
  getWordsByLevel, 
  getLevelDetails 
} from '../utils/gameData';

// Interface para o estado de progresso do jogador
interface PlayerProgress {
  currentLevel: number;
  completedWords: string[];
  score: number;
  streakCount: number;
}

// Interface para o contexto do jogo
interface GameContextType {
  // Estados
  currentMode: GameMode;
  currentLevel: LevelData;
  currentWord: WordData | null;
  wordsList: WordData[];
  playerProgress: PlayerProgress;
  isLoading: boolean;
  
  // Funções
  startGame: (modeId: string, levelId: number) => void;
  nextWord: () => void;
  completeWord: (wordId: string) => void;
  resetProgress: () => void;
  setGameMode: (modeId: string) => void;
  setGameLevel: (levelId: number) => void;
}

// Valores iniciais para o contexto
const initialGameContext: GameContextType = {
  currentMode: gameModes[0],
  currentLevel: levels[0],
  currentWord: null,
  wordsList: [],
  playerProgress: {
    currentLevel: 1,
    completedWords: [],
    score: 0,
    streakCount: 0
  },
  isLoading: false,
  
  startGame: () => {},
  nextWord: () => {},
  completeWord: () => {},
  resetProgress: () => {},
  setGameMode: () => {},
  setGameLevel: () => {}
};

// Criar o contexto
const GameContext = createContext<GameContextType>(initialGameContext);

// Hook personalizado para usar o contexto
export const useGameContext = () => useContext(GameContext);

// Propriedades do provedor
interface GameProviderProps {
  children: ReactNode;
}

// Componente provedor
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Estados
  const [currentMode, setCurrentMode] = useState<GameMode>(gameModes[0]);
  const [currentLevel, setCurrentLevel] = useState<LevelData>(levels[0]);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [wordsList, setWordsList] = useState<WordData[]>([]);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    currentLevel: 1,
    completedWords: [],
    score: 0,
    streakCount: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Iniciar o jogo com um modo e nível específicos
  const startGame = (modeId: string, levelId: number) => {
    setIsLoading(true);
    
    // Definir o modo e nível
    const mode = gameModes.find(m => m.id === modeId) || gameModes[0];
    const level = getLevelDetails(levelId) || levels[0];
    
    setCurrentMode(mode);
    setCurrentLevel(level);
    
    // Obter palavras para o nível selecionado
    const words = getWordsByLevel(level.id);
    setWordsList(words);
    
    // Selecionar a primeira palavra aleatoriamente
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setCurrentWord(words[randomIndex]);
    }
    
    setIsLoading(false);
  };

  // Passar para a próxima palavra
  const nextWord = () => {
    // Limpa a palavra atual primeiro para garantir que ela seja completamente removida
    setCurrentWord(null);
    
    if (wordsList.length === 0) {
      // Se não houver palavras disponíveis, recarrega o nível atual
      const words = getWordsByLevel(currentLevel.id);
      setWordsList(words);
      
      if (words.length > 0) {
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * words.length);
          setCurrentWord(words[randomIndex]);
        }, 100); // Pequeno atraso para garantir que a UI seja atualizada
      }
      return;
    }
    
    // Filtrar palavras que ainda não foram completadas
    const remainingWords = wordsList.filter(
      word => !playerProgress.completedWords.includes(word.id)
    );
    
    if (remainingWords.length > 0) {
      // Selecionar uma palavra aleatória da lista filtrada
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        setCurrentWord(remainingWords[randomIndex]);
      }, 100); // Pequeno atraso para garantir que a UI seja atualizada
    } else {
      // Se todas as palavras foram completadas, subir de nível
      const nextLevelId = currentLevel.id + 1;
      const nextLevel = getLevelDetails(nextLevelId);
      
      if (nextLevel) {
        setCurrentLevel(nextLevel);
        
        // Atualizar o progresso do jogador
        setPlayerProgress(prev => ({
          ...prev,
          currentLevel: nextLevelId,
          completedWords: [] // Reset das palavras completadas para o novo nível
        }));
        
        // Obter palavras para o próximo nível
        const words = getWordsByLevel(nextLevelId);
        setWordsList(words);
        
        // Selecionar a primeira palavra aleatoriamente
        if (words.length > 0) {
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * words.length);
            setCurrentWord(words[randomIndex]);
          }, 100); // Pequeno atraso para garantir que a UI seja atualizada
        }
      } else {
        // Se não houver próximo nível, reiniciar o nível atual
        const words = getWordsByLevel(currentLevel.id);
        setWordsList(words);
        
        // Resetar as palavras completadas e selecionar uma palavra aleatória
        setPlayerProgress(prev => ({
          ...prev,
          completedWords: []
        }));
        
        if (words.length > 0) {
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * words.length);
            setCurrentWord(words[randomIndex]);
          }, 100); // Pequeno atraso para garantir que a UI seja atualizada
        }
      }
    }
  };

  // Marcar uma palavra como completada
  const completeWord = (wordId: string) => {
    // Verificar se a palavra já foi completada para evitar duplicidades
    if (playerProgress.completedWords.includes(wordId)) return;
    
    // Atualizar o progresso do jogador
    setPlayerProgress(prev => {
      const updatedCompletedWords = [...prev.completedWords, wordId];
      const updatedStreakCount = prev.streakCount + 1;
      const baseScore = 10 * currentLevel.id; // Pontuação base baseada no nível
      const streakBonus = Math.floor(updatedStreakCount / 3) * 5; // Bônus por sequência de acertos
      const pointsEarned = baseScore + streakBonus;
      
      return {
        ...prev,
        completedWords: updatedCompletedWords,
        score: prev.score + pointsEarned,
        streakCount: updatedStreakCount
      };
    });
  };

  // Reiniciar o progresso do jogador
  const resetProgress = () => {
    setPlayerProgress({
      currentLevel: 1,
      completedWords: [],
      score: 0,
      streakCount: 0
    });
    
    // Reiniciar o jogo com o primeiro nível
    startGame(currentMode.id, 1);
  };

  // Mudar o modo de jogo
  const setGameMode = (modeId: string) => {
    const mode = gameModes.find(m => m.id === modeId);
    if (mode) {
      setCurrentMode(mode);
      // Reiniciar o jogo com o novo modo e o nível atual
      startGame(modeId, currentLevel.id);
    }
  };

  // Mudar o nível do jogo
  const setGameLevel = (levelId: number) => {
    const level = getLevelDetails(levelId);
    if (level) {
      setCurrentLevel(level);
      // Atualizar o nível no progresso do jogador
      setPlayerProgress(prev => ({
        ...prev,
        currentLevel: levelId,
        completedWords: [] // Reset das palavras completadas para o novo nível
      }));
      
      // Reiniciar o jogo com o modo atual e o novo nível
      startGame(currentMode.id, levelId);
    }
  };

  // Valor do contexto
  const value: GameContextType = {
    currentMode,
    currentLevel,
    currentWord,
    wordsList,
    playerProgress,
    isLoading,
    
    startGame,
    nextWord,
    completeWord,
    resetProgress,
    setGameMode,
    setGameLevel
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 