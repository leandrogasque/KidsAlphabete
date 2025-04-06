import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CompleteWord from './pages/CompleteWord'
import { GameProvider, useGameContext } from './contexts/GameContext'
import { levels, gameModes } from './utils/gameData'
import Tutorial from './components/Tutorial'
import ProgressDashboard from './components/ProgressDashboard'

// Componente principal da aplicação
function AppContent() {
  const [started, setStarted] = useState(false)
  const [showLevelSelect, setShowLevelSelect] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showProgressDashboard, setShowProgressDashboard] = useState(false)
  const { startGame, currentLevel, currentMode, setGameLevel, setGameMode } = useGameContext()

  // Iniciar o jogo com o nível selecionado
  const handleStartGame = (levelId: number, modeId: string) => {
    startGame(modeId, levelId)
    setStarted(true)
    setShowLevelSelect(false)
  }

  // Mostrar tutorial e iniciar o jogo quando o tutorial for concluído
  const handleTutorialComplete = () => {
    setShowTutorial(false)
    // Iniciar o jogo com o nível e modo selecionados
    handleStartGame(currentLevel.id, currentMode.id)
  }

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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn text-2xl px-10 py-4 w-64"
                  onClick={() => setShowLevelSelect(true)}
                >
                  Começar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline text-2xl px-10 py-4 w-64 block mx-auto"
                  onClick={() => setShowTutorial(true)}
                >
                  Como Jogar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline text-lg px-6 py-2 mt-8 block mx-auto"
                  onClick={() => setShowProgressDashboard(true)}
                >
                  Área dos Pais
                </motion.button>
              </div>
            ) : (
              <div className="bg-white p-2 rounded-xl shadow-md w-full mx-auto flex flex-col">
                <div>
                  <h2 className="text-base font-bold text-gray-700 mb-1 font-fredoka">Escolha o Modo:</h2>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {gameModes.map(mode => (
                      <motion.button
                        key={mode.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`btn-outline text-left p-1.5 rounded-lg border ${
                          currentMode.id === mode.id ? 'border-primary bg-primary/10' : 'border-gray-300'
                        }`}
                        onClick={() => setGameMode(mode.id)}
                      >
                        <p className="font-bold font-fredoka text-xs">{mode.name}</p>
                        <p className="text-xs text-gray-600 font-comic truncate">{mode.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-base font-bold text-gray-700 mb-1 font-fredoka">Escolha o Nível:</h2>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {levels.map(level => (
                      <motion.button
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`btn-outline text-left p-1.5 rounded-lg border ${
                          currentLevel.id === level.id ? 'border-primary bg-primary/10' : 'border-gray-300'
                        }`}
                        onClick={() => setGameLevel(level.id)}
                      >
                        <p className="font-bold font-fredoka text-xs">{level.name}</p>
                        <p className="text-xs text-gray-600 font-comic truncate">{level.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline text-primary border-primary border flex-1 py-1.5 text-sm"
                    onClick={() => setShowLevelSelect(false)}
                  >
                    Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn flex-1 py-1.5 text-sm"
                    onClick={() => setShowTutorial(true)}
                  >
                    Jogar
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          <CompleteWord onShowProgress={() => setShowProgressDashboard(true)} />
          <button 
            onClick={() => setShowProgressDashboard(true)}
            className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="Ver progresso"
          >
            📊
          </button>
        </div>
      )}
      
      {/* Tutorial */}
      {showTutorial && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}
      
      {/* Painel de Progresso */}
      {showProgressDashboard && (
        <ProgressDashboard onClose={() => setShowProgressDashboard(false)} />
      )}
    </div>
  )
}

// Componente principal envolto com o provedor de contexto
function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App