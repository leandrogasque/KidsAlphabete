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
  disabledWords: string[]; // IDs das palavras desabilitadas
}

// Interface para uma sessão de jogo completa
interface GameSession {
  id: string;
  date: string;
  score: number;
  completedWords: string[];
  timeElapsed: number; // em segundos
  level: number;
}

// Interface para o estado de progresso do jogador
interface PlayerProgress {
  currentLevel: number;
  completedWords: string[];
  completedSentences: string[];
  score: number;
  streakCount: number;
  sessionsHistory: GameSession[]; // Histórico de sessões completadas
  currentSessionStartTime: number | null; // Timestamp de início da sessão atual
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
  isGameCompleted: boolean; // Novo estado para indicar se todas as palavras foram completadas
  
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
  toggleWordEnabled: (wordId: string) => void; 
  isWordEnabled: (wordId: string) => boolean; 
  completeGame: () => void; // Nova função para finalizar o jogo e registrar a sessão
  startNewGame: () => void; // Nova função para iniciar um novo jogo e resetar o estado de conclusão
}

// Configurações iniciais padrão
const defaultSettings: GameSettings = {
  parentPin: '1234', // PIN padrão para acesso dos pais
  soundEffects: true,
  backgroundMusic: true,
  hapticFeedback: true,
  disabledWords: []
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
    streakCount: 0,
    sessionsHistory: [],
    currentSessionStartTime: null
  },
  isLoading: false,
  settings: defaultSettings,
  isGameCompleted: false,
  
  startGame: () => {},
  nextWord: () => {},
  nextSentence: () => {},
  completeWord: () => {},
  completeSentence: () => {},
  resetProgress: () => {},
  setGameMode: () => {},
  setGameLevel: () => {},
  updateSettings: () => {},
  toggleWordEnabled: () => {},
  isWordEnabled: () => true,
  completeGame: () => {},
  startNewGame: () => {}
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
    streakCount: 0,
    sessionsHistory: [],
    currentSessionStartTime: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

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

  // Iniciar o jogo
  const startGame = (modeId: string, levelId: number) => {
    console.log('GameContext: Iniciando jogo', { modeId, levelId });
    setIsLoading(true);
    setIsGameCompleted(false);
    
    // Registrar o início da sessão atual se ainda não estiver definido
    if (!playerProgress.currentSessionStartTime) {
      setPlayerProgress(prev => ({
        ...prev,
        currentSessionStartTime: Date.now()
      }));
    }
    
    try {
      // Encontrar o modo e o nível atual
      const mode = gameModes.find(m => m.id === modeId);
      const level = levels.find(l => l.id === levelId);
      
      console.log('GameContext: Modo e nível encontrados', { mode, level });
      
      if (!mode || !level) {
        console.error('GameContext: Modo ou nível não encontrado');
        setIsLoading(false);
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
          // Obter palavras para o nível atual, excluindo palavras desabilitadas
          let levelWords = getWordsByLevel(levelId, settings.disabledWords);
          console.log('GameContext: Palavras obtidas para o nível', levelWords);
          
          // Se não houver palavras disponíveis neste nível após filtrar
          if (!levelWords || levelWords.length === 0) {
            console.warn(`GameContext: Nenhuma palavra disponível para o nível ${levelId} após filtrar desabilitadas`);
            
            // Verificar se há palavras habilitadas em qualquer nível
            const allWords: WordData[] = [];
            
            // Verificar palavras em todos os níveis
            for (let i = 1; i <= 3; i++) {
              const words = getWordsByLevel(i);
              allWords.push(...words);
            }
            
            const anyLevelWords = allWords.filter(word => !settings.disabledWords.includes(word.id));
            
            if (anyLevelWords.length > 0) {
              // Se houver palavras em outros níveis, usar o nível da primeira palavra disponível
              const firstAvailableWord = anyLevelWords[0];
              const newLevelId = firstAvailableWord.level;
              const newLevel = getLevelDetails(newLevelId);
              
              if (newLevel) {
                console.warn(`GameContext: Alterando para o nível ${newLevelId} que possui palavras disponíveis`);
                setCurrentLevel(newLevel);
                
                // Filtrar palavras apenas do novo nível
                const newLevelWords = anyLevelWords.filter(word => word.level === newLevelId);
                setWordsList(newLevelWords);
                
                // Escolher uma palavra aleatória para começar
                const randomIndex = Math.floor(Math.random() * newLevelWords.length);
                setCurrentWord(newLevelWords[randomIndex]);
              }
            } else {
              // Se não houver palavras disponíveis em nenhum nível, mostrar um alerta
              console.error('GameContext: Todas as palavras estão desabilitadas!');
              alert('Todas as palavras estão desabilitadas! Habilite pelo menos uma palavra na Área dos Pais.');
              
              // Reabilitar todas as palavras como medida de segurança
              setSettings(prev => ({
                ...prev,
                disabledWords: []
              }));
              
              // Tentar novamente com todas as palavras habilitadas
              levelWords = getWordsByLevel(levelId);
              setWordsList(levelWords);
              
              if (levelWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * levelWords.length);
                setCurrentWord(levelWords[randomIndex]);
              }
            }
          } else {
            // Atualizar a lista de palavras para o nível atual
            setWordsList(levelWords);
            
            // Escolher uma palavra aleatória para começar
            const randomIndex = Math.floor(Math.random() * levelWords.length);
            setCurrentWord(levelWords[randomIndex]);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Passar para a próxima palavra
  const nextWord = () => {
    // Limpa a palavra atual primeiro para garantir que ela seja completamente removida
    setCurrentWord(null);
    setIsLoading(true);
    
    try {
      // Obter todas as palavras disponíveis de todos os níveis, excluindo palavras desabilitadas
      let allAvailableWords: WordData[] = [];
      
      // Obter palavras de todos os níveis
      for (let i = 1; i <= 3; i++) {
        const levelWords = getWordsByLevel(i, settings.disabledWords);
        allAvailableWords = [...allAvailableWords, ...levelWords];
      }
      
      // Verificar se completou todas as palavras disponíveis
      const allWordsCompleted = allAvailableWords.every(word => 
        playerProgress.completedWords.includes(word.id)
      );
      
      console.log('GameContext: Verificando conclusão do jogo', { 
        totalPalavras: allAvailableWords.length,
        palavrasCompletadas: playerProgress.completedWords.length,
        todasCompletadas: allWordsCompleted 
      });
      
      // Se todas as palavras estão completadas, terminar o jogo
      if (allWordsCompleted && allAvailableWords.length > 0) {
        console.log('GameContext: Todas as palavras foram completadas! Chamando completeGame()');
        completeGame();
        setIsLoading(false);
        return;
      }
      
      // Continuar para a próxima palavra normalmente
      // Tentar obter palavras para o nível atual
      let availableWords = getWordsByLevel(currentLevel.id, settings.disabledWords);
      
      // Se não houver palavras disponíveis neste nível após filtrar
      if (availableWords.length === 0) {
        console.warn(`GameContext: Nenhuma palavra disponível para o nível ${currentLevel.id} após filtrar desabilitadas`);
        
        // Verificar se há palavras habilitadas em qualquer nível
        const anyLevelWords = wordsList.filter(word => !settings.disabledWords.includes(word.id));
        
        if (anyLevelWords.length > 0) {
          // Se houver palavras em outros níveis, usar uma dessas
          console.log('GameContext: Usando palavras de outros níveis');
          availableWords = anyLevelWords;
        } else {
          // Se não houver palavras disponíveis em nenhum nível, mostrar alerta
          console.error('GameContext: Todas as palavras estão desabilitadas!');
          alert('Todas as palavras estão desabilitadas! Habilite pelo menos uma palavra na Área dos Pais.');
          
          // Reabilitar todas as palavras como medida de segurança
          setSettings(prev => ({
            ...prev,
            disabledWords: []
          }));
          
          // Tentar novamente com todas as palavras habilitadas
          availableWords = getWordsByLevel(currentLevel.id);
        }
      }
      
      // Atualizar a lista de palavras disponíveis
      setWordsList(availableWords);
      
      // Filtrar palavras que ainda não foram completadas
      const remainingWords = availableWords.filter(
        word => !playerProgress.completedWords.includes(word.id)
      );
      
      if (remainingWords.length > 0) {
        // Selecionar uma palavra aleatória da lista filtrada
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        setCurrentWord(remainingWords[randomIndex]);
      } else if (availableWords.length > 0) {
        // Se todas as palavras foram completadas, mas ainda há palavras disponíveis
        // Selecionar uma aleatória de todas as disponíveis
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        setCurrentWord(availableWords[randomIndex]);
      } else {
        // Caso de segurança - não deveria acontecer devido aos checks acima
        console.error('GameContext: Sem palavras disponíveis após todos os checks');
      }
    } catch (error) {
      console.error('GameContext: Erro ao carregar próxima palavra', error);
    } finally {
      setIsLoading(false);
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
      streakCount: 0,
      sessionsHistory: [],
      currentSessionStartTime: null
    });
    
    // Reiniciar o jogo com o primeiro nível
    startGame('complete-word', 1);
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

  // Função para habilitar/desabilitar uma palavra
  const toggleWordEnabled = (wordId: string) => {
    setSettings(prev => ({
      ...prev,
      disabledWords: prev.disabledWords.includes(wordId)
        ? prev.disabledWords.filter(w => w !== wordId)
        : [...prev.disabledWords, wordId]
    }));
  };

  // Função para verificar se uma palavra está habilitada
  const isWordEnabled = (wordId: string) => {
    return !settings.disabledWords.includes(wordId);
  };

  // Função para finalizar o jogo e registrar a sessão
  const completeGame = () => {
    const now = Date.now();
    const sessionStartTime = playerProgress.currentSessionStartTime || now;
    const timeElapsed = Math.floor((now - sessionStartTime) / 1000); // Tempo em segundos
    
    // Criar uma nova sessão
    const newSession: GameSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: playerProgress.score,
      completedWords: [...playerProgress.completedWords],
      timeElapsed: timeElapsed,
      level: currentLevel.id
    };
    
    // Adicionar a sessão ao histórico
    setPlayerProgress(prev => ({
      ...prev,
      sessionsHistory: [...prev.sessionsHistory, newSession],
      currentSessionStartTime: null // Resetar o tempo de início
    }));
    
    // Marcar o jogo como completado
    setIsGameCompleted(true);
    console.log('GameContext: Jogo completado', newSession);
  };

  // Função para iniciar um novo jogo e resetar o estado de conclusão
  const startNewGame = () => {
    // Resetar o estado de conclusão
    setIsGameCompleted(false);
    
    // Manter o histórico de sessões, mas resetar as palavras completadas e pontuação
    setPlayerProgress(prev => ({
      ...prev,
      completedWords: [],
      completedSentences: [],
      score: 0,
      streakCount: 0,
      currentSessionStartTime: Date.now()
    }));
    
    // Iniciar o jogo com o nível 1
    startGame(currentMode.id, 1);
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
    isGameCompleted,
    startGame,
    nextWord,
    nextSentence,
    completeWord,
    completeSentence,
    resetProgress,
    setGameMode,
    setGameLevel,
    updateSettings,
    toggleWordEnabled,
    isWordEnabled,
    completeGame,
    startNewGame
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 