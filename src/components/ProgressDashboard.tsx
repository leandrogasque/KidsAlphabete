import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';
import { levels, wordsList } from '../utils/gameData';

interface ProgressDashboardProps {
  onClose: () => void;
}

/**
 * Componente que exibe um painel de progresso detalhado para pais/educadores
 */
const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onClose }) => {
  const { playerProgress, resetProgress } = useGameContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'levels' | 'words'>('overview');

  // Calcular porcentagem de palavras completadas
  const calculateCompletion = () => {
    const totalWords = wordsList.length;
    const completedWords = playerProgress.completedWords.length;
    return Math.round((completedWords / totalWords) * 100);
  };

  // Calcular estatísticas por nível
  const calculateLevelStats = () => {
    return levels.map(level => {
      const wordsInLevel = wordsList.filter(word => word.level === level.id);
      const completedWordsInLevel = playerProgress.completedWords.filter(
        wordId => wordsInLevel.some(w => w.id === wordId)
      );
      
      const totalWords = wordsInLevel.length;
      const completedWords = completedWordsInLevel.length;
      const percentage = totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;
      
      return {
        level,
        totalWords,
        completedWords,
        percentage,
        isCurrentLevel: playerProgress.currentLevel === level.id
      };
    });
  };

  // Obter lista completa de palavras com status
  const getWordsList = () => {
    return wordsList.map(word => ({
      ...word,
      completed: playerProgress.completedWords.includes(word.id)
    }));
  };

  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const today = formatDate(new Date());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl"
      >
        <div className="p-6 bg-primary text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold font-fredoka">Painel de Progresso</h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
          >
            ✕
          </button>
        </div>
        
        {/* Navegação entre abas */}
        <div className="flex border-b">
          <button 
            className={`py-3 px-6 font-fredoka ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={`py-3 px-6 font-fredoka ${activeTab === 'levels' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('levels')}
          >
            Níveis
          </button>
          <button 
            className={`py-3 px-6 font-fredoka ${activeTab === 'words' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('words')}
          >
            Palavras
          </button>
        </div>
        
        <div className="p-6">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-wrap items-center mb-4">
                  <div className="mr-6">
                    <h3 className="text-gray-500 text-sm mb-1">Data</h3>
                    <p className="font-bold">{today}</p>
                  </div>
                  <div className="mr-6">
                    <h3 className="text-gray-500 text-sm mb-1">Pontuação Total</h3>
                    <p className="font-bold text-xl text-primary">{playerProgress.score} pontos</p>
                  </div>
                  <div className="mr-6">
                    <h3 className="text-gray-500 text-sm mb-1">Nível Atual</h3>
                    <p className="font-bold">{levels.find(l => l.id === playerProgress.currentLevel)?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Palavras Completadas</h3>
                    <p className="font-bold">{playerProgress.completedWords.length} de {wordsList.length}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Progresso Geral</span>
                    <span className="text-sm font-bold">{calculateCompletion()}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${calculateCompletion()}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="text-lg font-bold mb-3 font-fredoka">Resumo de Desempenho</h3>
                <p className="text-gray-700 mb-4">
                  A criança está no nível {playerProgress.currentLevel} ({levels.find(l => l.id === playerProgress.currentLevel)?.name}) 
                  e completou {playerProgress.completedWords.length} palavras até o momento.
                </p>
                
                <h4 className="font-bold text-gray-700 mb-2">Recomendações:</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li className="mb-1">Pratique palavras do nível atual regularmente</li>
                  <li className="mb-1">Incentive a criança a ouvir as sílabas antes de arrastar</li>
                  <li className="mb-1">Comemore cada palavra completada</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={resetProgress}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center"
                >
                  <span className="mr-1">↺</span> Reiniciar Progresso
                </button>
              </div>
            </div>
          )}
          
          {/* Níveis */}
          {activeTab === 'levels' && (
            <div>
              <h3 className="text-lg font-bold mb-4 font-fredoka">Progresso por Nível</h3>
              
              <div className="grid gap-4">
                {calculateLevelStats().map(({ level, totalWords, completedWords, percentage, isCurrentLevel }) => (
                  <div 
                    key={level.id}
                    className={`p-4 rounded-lg border ${isCurrentLevel ? 'border-primary bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">{level.name}</h4>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                      {isCurrentLevel && (
                        <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">Atual</span>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Progresso</span>
                          <span className="text-sm font-bold">{percentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-bar-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <span className="text-sm text-gray-500 block">Palavras</span>
                        <span className="font-bold">{completedWords}/{totalWords}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Palavras */}
          {activeTab === 'words' && (
            <div>
              <h3 className="text-lg font-bold mb-4 font-fredoka">Palavras Aprendidas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getWordsList().map(word => (
                  <div 
                    key={word.id}
                    className={`p-3 rounded-lg border flex items-center ${word.completed ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                      <img src={word.imageUrl} alt={word.word} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold">{word.word}</h4>
                      <p className="text-xs text-gray-500">
                        Nível {word.level} • {word.syllables.length} sílabas
                      </p>
                    </div>
                    <div className="ml-auto">
                      {word.completed ? (
                        <span className="text-green-500 text-xl">✓</span>
                      ) : (
                        <span className="text-gray-300 text-xl">○</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard; 