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
    <div className="min-h-screen bg-background">
      {!started ? (
        <div className="container-game flex flex-col items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-primary mb-6 font-fredoka">AlfaBeta</h1>
            <p className="text-2xl mb-8 text-gray-700 font-comic">Aprendendo a ler de forma divertida!</p>
            
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
              <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 font-fredoka">Escolha o Modo:</h2>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {gameModes.map(mode => (
                    <motion.button
                      key={mode.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`btn-outline text-left p-3 rounded-lg border-2 ${
                        currentMode.id === mode.id ? 'border-primary bg-primary/10' : 'border-gray-300'
                      }`}
                      onClick={() => setGameMode(mode.id)}
                    >
                      <p className="font-bold font-fredoka">{mode.name}</p>
                      <p className="text-sm text-gray-600 font-comic">{mode.description}</p>
                    </motion.button>
                  ))}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-700 mb-4 font-fredoka">Escolha o Nível:</h2>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {levels.map(level => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`btn-outline text-left p-3 rounded-lg border-2 ${
                        currentLevel.id === level.id ? 'border-primary bg-primary/10' : 'border-gray-300'
                      }`}
                      onClick={() => setGameLevel(level.id)}
                    >
                      <p className="font-bold font-fredoka">{level.name}</p>
                      <p className="text-sm text-gray-600 font-comic">{level.description}</p>
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline text-primary border-primary border-2 flex-1 py-3"
                    onClick={() => setShowLevelSelect(false)}
                  >
                    Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn flex-1 py-3"
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