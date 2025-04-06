import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  WordData, 
  LevelData, 
  GameMode, 
  levels, 
  gameModes, 
  getWordsByLevel, 
  getLevelDetails 
} from '../utils/gameData';
import {
  SentenceData,
  getSentencesByLevel,
  getSentenceById
} from '../utils/sentenceData';

// Interface para as configurações do jogo
interface GameSettings {
  parentPin: string;
  soundEffects: boolean;
  backgroundMusic: boolean;
  hapticFeedback: boolean;
}

// Interface para o estado de progresso do jogador
interface PlayerProgress {
  currentLevel: number;
  completedWords: string[];
  completedSentences: string[];
  score: number;
  streakCount: number;
}

// Interface para o contexto do jogo
interface GameContextType {
  // Estados
  currentMode: GameMode;
  currentLevel: LevelData;
  currentWord: WordData | null;
  currentSentence: SentenceData | null;
  wordsList: WordData[];
  sentencesList: SentenceData[];
  playerProgress: PlayerProgress;
  isLoading: boolean;
  settings: GameSettings;
  
  // Funções
  startGame: (modeId: string, levelId: number) => void;
  nextWord: () => void;
  nextSentence: () => void;
  completeWord: (wordId: string) => void;
  completeSentence: (sentenceId: string) => void;
  resetProgress: () => void;
  setGameMode: (modeId: string) => void;
  setGameLevel: (levelId: number) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
}

// Configurações iniciais padrão
const defaultSettings: GameSettings = {
  parentPin: '1234', // PIN padrão para acesso dos pais
  soundEffects: true,
  backgroundMusic: true,
  hapticFeedback: true
};

// Valores iniciais para o contexto
const initialGameContext: GameContextType = {
  currentMode: gameModes[0],
  currentLevel: levels[0],
  currentWord: null,
  currentSentence: null,
  wordsList: [],
  sentencesList: [],
  playerProgress: {
    currentLevel: 1,
    completedWords: [],
    completedSentences: [],
    score: 0,
    streakCount: 0
  },
  isLoading: false,
  settings: defaultSettings,
  
  startGame: () => {},
  nextWord: () => {},
  nextSentence: () => {},
  completeWord: () => {},
  completeSentence: () => {},
  resetProgress: () => {},
  setGameMode: () => {},
  setGameLevel: () => {},
  updateSettings: () => {}
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
  const [currentSentence, setCurrentSentence] = useState<SentenceData | null>(null);
  const [wordsList, setWordsList] = useState<WordData[]>([]);
  const [sentencesList, setSentencesList] = useState<SentenceData[]>([]);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    currentLevel: 1,
    completedWords: [],
    completedSentences: [],
    score: 0,
    streakCount: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  // Carregar progresso e configurações salvos
  useEffect(() => {
    try {
      // Carregar progresso
      const savedProgress = localStorage.getItem('playerProgress');
      if (savedProgress) {
        setPlayerProgress(JSON.parse(savedProgress));
      }
      
      // Carregar configurações
      const savedSettings = localStorage.getItem('gameSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
  }, []);

  // Salvar progresso quando for atualizado
  useEffect(() => {
    try {
      localStorage.setItem('playerProgress', JSON.stringify(playerProgress));
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }, [playerProgress]);

  // Salvar configurações quando forem atualizadas
  useEffect(() => {
    try {
      localStorage.setItem('gameSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }, [settings]);

  // Função para iniciar o jogo
  const startGame = (modeId: string, levelId: number) => {
    console.log('GameContext: Iniciando jogo', { modeId, levelId });
    
    try {
      // Encontrar o modo e o nível atual
      const mode = gameModes.find(m => m.id === modeId);
      const level = levels.find(l => l.id === levelId);
      
      console.log('GameContext: Modo e nível encontrados', { mode, level });
      
      if (!mode || !level) {
        console.error('GameContext: Modo ou nível não encontrado');
        return;
      }

      // Atualizar os estados
      setCurrentMode(mode);
      setCurrentLevel(level);
      
      // Limpar estados anteriores
      console.log('GameContext: Limpando estados anteriores');
      setCurrentWord(null);
      setCurrentSentence(null);

      // Inicializar dados do jogo com base no modo
      console.log('GameContext: Inicializando dados do jogo para o modo', modeId);
      
      if (modeId === 'complete-word') {
        try {
          // Obter palavras para o nível atual
          const levelWords = getWordsByLevel(levelId);
          console.log('GameContext: Palavras obtidas para o nível', levelWords);
          
          if (levelWords && levelWords.length > 0) {
            // Escolher uma palavra aleatória para começar
            const randomIndex = Math.floor(Math.random() * levelWords.length);
            console.log('GameContext: Selecionando palavra inicial', { index: randomIndex, word: levelWords[randomIndex] });
            setCurrentWord(levelWords[randomIndex]);
          } else {
            console.error('GameContext: Nenhuma palavra encontrada para o nível', levelId);
          }
        } catch (error) {
          console.error('GameContext: Erro ao obter palavras', error);
        }
      } 
      else if (modeId === 'form-sentence') {
        try {
          // Obter frases para o nível atual
          const levelSentences = getSentencesByLevel(levelId);
          console.log('GameContext: Frases obtidas para o nível', levelSentences);
          
          if (levelSentences && levelSentences.length > 0) {
            // Escolher uma frase aleatória para começar
            const randomIndex = Math.floor(Math.random() * levelSentences.length);
            console.log('GameContext: Selecionando frase inicial', { index: randomIndex, sentence: levelSentences[randomIndex] });
            setCurrentSentence(levelSentences[randomIndex]);
          } else {
            console.error('GameContext: Nenhuma frase encontrada para o nível', levelId);
          }
        } catch (error) {
          console.error('GameContext: Erro ao obter frases', error);
        }
      }
      
      console.log('GameContext: Jogo iniciado com sucesso!');
    } catch (error) {
      console.error('GameContext: Erro ao iniciar o jogo', error);
    }
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

  // Passar para a próxima frase - versão simplificada sem timeouts
  const nextSentence = () => {
    try {
      // Obter frases para o nível atual, caso a lista esteja vazia
      let availableSentences = sentencesList;
      
      if (!availableSentences || availableSentences.length === 0) {
        availableSentences = getSentencesByLevel(currentLevel.id);
        setSentencesList(availableSentences);
      }
      
      if (availableSentences && availableSentences.length > 0) {
        // Selecionar uma frase aleatória
        const randomIndex = Math.floor(Math.random() * availableSentences.length);
        setCurrentSentence(availableSentences[randomIndex]);
      }
    } catch (error) {
      console.error('GameContext - Erro ao avançar para próxima frase:', error);
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

  // Marcar uma frase como completada
  const completeSentence = (sentenceId: string) => {
    // Verificar se a frase já foi completada para evitar duplicidades
    if (playerProgress.completedSentences.includes(sentenceId)) return;
    
    // Atualizar o progresso do jogador
    setPlayerProgress(prev => {
      const updatedCompletedSentences = [...prev.completedSentences, sentenceId];
      const updatedStreakCount = prev.streakCount + 1;
      const baseScore = 15 * currentLevel.id; // Pontuação base baseada no nível (maior que para palavras)
      const streakBonus = Math.floor(updatedStreakCount / 3) * 8; // Bônus por sequência de acertos
      const pointsEarned = baseScore + streakBonus;
      
      return {
        ...prev,
        completedSentences: updatedCompletedSentences,
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
      completedSentences: [],
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
        completedWords: [], // Reset das palavras completadas para o novo nível
        completedSentences: [] // Reset das frases completadas para o novo nível
      }));
      
      // Reiniciar o jogo com o modo atual e o novo nível
      startGame(currentMode.id, levelId);
    }
  };

  // Função para atualizar configurações
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Valor do contexto
  const contextValue: GameContextType = {
    currentMode,
    currentLevel,
    currentWord,
    currentSentence,
    wordsList,
    sentencesList,
    playerProgress,
    isLoading,
    settings,
    startGame,
    nextWord,
    nextSentence,
    completeWord,
    completeSentence,
    resetProgress,
    setGameMode,
    setGameLevel,
    updateSettings
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 