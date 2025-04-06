import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { GameProvider, useGameContext } from './contexts/GameContext'
import { levels, gameModes } from './utils/gameData'
import { DndContext } from '@dnd-kit/core'

// Versão simplificada para evitar problemas com lazy loading
import CompleteWord from './pages/CompleteWord'
// Lazy loading apenas do painel de progresso
const ProgressDashboard = lazy(() => import('./components/ProgressDashboard'))

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    <p className="ml-3 text-primary font-medium">Carregando...</p>
  </div>
)

// Interfaces para os componentes memoizados
interface MemoizedButtonProps {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  hoverScale?: number;
  tapScale?: number;
}

interface LevelButtonProps {
  level: {
    id: number | string;
    name: string;
    description: string;
  };
  isActive: boolean;
  onClick: () => void;
}

// Componente para o botão memoizado
const MemoizedButton = React.memo(({ 
  onClick, 
  className, 
  children,
  hoverScale = 1.05,
  tapScale = 0.95
}: MemoizedButtonProps) => (
  <motion.button
    whileHover={{ scale: hoverScale }}
    whileTap={{ scale: tapScale }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.button>
))

// Componente de nível memoizado
const LevelButton = React.memo(({ 
  level, 
  isActive, 
  onClick 
}: LevelButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`btn-outline text-left p-1.5 rounded-lg border ${
      isActive ? 'border-primary bg-primary/10' : 'border-gray-300'
    }`}
    onClick={onClick}
  >
    <p className="font-bold font-fredoka text-xs">{level.name}</p>
    <p className="text-xs text-gray-600 font-comic truncate">{level.description}</p>
  </motion.button>
))

// Componente principal da aplicação
function AppContent() {
  const [started, setStarted] = useState(false)
  const [showLevelSelect, setShowLevelSelect] = useState(false)
  const [showProgressDashboard, setShowProgressDashboard] = useState(false)
  const { 
    startGame, 
    currentLevel, 
    currentMode, 
    setGameLevel, 
    setGameMode, 
    currentSentence, 
    currentWord 
  } = useGameContext()

  // Funções memoizadas com useCallback
  const handleShowLevelSelect = useCallback(() => {
    setShowLevelSelect(true)
  }, [])

  const handleHideLevelSelect = useCallback(() => {
    setShowLevelSelect(false)
  }, [])

  const handleShowProgressDashboard = useCallback(() => {
    setShowProgressDashboard(true)
  }, [])

  const handleHideProgressDashboard = useCallback(() => {
    setShowProgressDashboard(false)
  }, [])

  const handleModeSelect = useCallback((modeId: string) => {
    setGameMode(modeId)
  }, [setGameMode])

  const handleLevelSelect = useCallback((levelId: number) => {
    setGameLevel(levelId)
  }, [setGameLevel])

  // Iniciar o jogo com o nível selecionado
  const handleStartGame = useCallback((levelId: number, modeId: string) => {
    try {
      // Primeiro, fazer as configurações necessárias
      setStarted(true);
      setShowLevelSelect(false);
      
      // Iniciar o jogo imediatamente para evitar problemas com a UI
      startGame(modeId, levelId);
      console.log('Jogo iniciado com sucesso');
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
    }
  }, [startGame, setStarted, setShowLevelSelect])

  // Renderizar o componente do jogo sem lazy loading
  const renderGameComponent = useCallback(() => {
    return <CompleteWord onShowProgress={handleShowProgressDashboard} />;
  }, [handleShowProgressDashboard])

  return (
    <div className="h-screen bg-background overflow-hidden">
      {!started ? (
        <div className="container-game flex flex-col items-center justify-center min-h-screen py-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full max-w-md px-2"
          >
            <img src="/logo.svg" alt="Logo AlfaBeta" className="w-32 h-32 mx-auto mb-2" />
            <h1 className="text-5xl font-bold text-primary mb-4 font-fredoka">AlfaBeta</h1>
            <p className="text-xl mb-6 text-gray-700 font-comic">Aprendendo a ler de forma divertida!</p>
            
            {!showLevelSelect ? (
              <div className="space-y-4">
                <MemoizedButton
                  className="btn text-2xl px-10 py-4 w-64"
                  onClick={handleShowLevelSelect}
                >
                  Começar
                </MemoizedButton>
                
                <MemoizedButton
                  className="btn-outline text-lg px-6 py-2 mt-8 block mx-auto"
                  onClick={handleShowProgressDashboard}
                >
                  Área dos Pais
                </MemoizedButton>
              </div>
            ) : (
              <div className="bg-white p-2 rounded-xl shadow-md w-full mx-auto flex flex-col">
                <div>
                  <h2 className="text-base font-bold text-gray-700 mb-1 font-fredoka">Escolha o Modo:</h2>
                  <div className="grid grid-cols-1 gap-1 mb-2">
                    {/* Temporariamente mostrando apenas o modo CompleteWord */}
                    <LevelButton
                      level={{
                        id: gameModes[0].id,
                        name: gameModes[0].name,
                        description: gameModes[0].description
                      }}
                      isActive={currentMode.id === gameModes[0].id}
                      onClick={() => handleModeSelect(gameModes[0].id)}
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-base font-bold text-gray-700 mb-1 font-fredoka">Escolha o Nível:</h2>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {levels.map(level => (
                      <LevelButton
                        key={level.id}
                        level={level}
                        isActive={currentLevel.id === level.id}
                        onClick={() => handleLevelSelect(level.id)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-1">
                  <MemoizedButton
                    className="btn-outline text-primary border-primary border flex-1 py-1.5 text-sm"
                    onClick={handleHideLevelSelect}
                  >
                    Voltar
                  </MemoizedButton>
                  <MemoizedButton
                    className="btn flex-1 py-1.5 text-sm"
                    onClick={() => handleStartGame(currentLevel.id, currentMode.id)}
                  >
                    Jogar
                  </MemoizedButton>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          {renderGameComponent()}
          <button 
            onClick={handleShowProgressDashboard}
            className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="Ver progresso"
          >
            📊
          </button>
        </div>
      )}
      
      {/* Painel de Progresso com lazy loading */}
      {showProgressDashboard && (
        <Suspense fallback={<LoadingFallback />}>
          <ProgressDashboard onClose={handleHideProgressDashboard} />
        </Suspense>
      )}
    </div>
  )
}

// Componente App memoizado
const App = React.memo(() => {
  return (
    <DndContext>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </DndContext>
  )
})

export default App