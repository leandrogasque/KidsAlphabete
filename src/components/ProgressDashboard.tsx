import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';
import { levels, wordsList } from '../utils/gameData';
import { sentencesList } from '../utils/sentenceData';

interface ProgressDashboardProps {
  onClose: () => void;
  isEmbedded?: boolean; // Indica se está integrado em outro componente
}

/**
 * Componente que exibe um painel de progresso detalhado para pais/educadores
 */
const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  onClose,
  isEmbedded = false
}) => {
  const { playerProgress, resetProgress } = useGameContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'levels' | 'words' | 'sentences'>('overview');

  // Calcular porcentagem de palavras completadas
  const calculateWordCompletion = () => {
    const totalWords = wordsList.length;
    const completedWords = playerProgress.completedWords.length;
    return Math.round((completedWords / totalWords) * 100);
  };

  // Calcular porcentagem de frases completadas
  const calculateSentenceCompletion = () => {
    const totalSentences = sentencesList.length;
    const completedSentences = playerProgress.completedSentences.length;
    return totalSentences > 0 ? Math.round((completedSentences / totalSentences) * 100) : 0;
  };

  // Calcular porcentagem geral de conclusão (palavras + frases)
  const calculateOverallCompletion = () => {
    const totalItems = wordsList.length + sentencesList.length;
    const completedItems = playerProgress.completedWords.length + playerProgress.completedSentences.length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Calcular estatísticas por nível
  const calculateLevelStats = () => {
    return levels.map(level => {
      // Palavras
      const wordsInLevel = wordsList.filter(word => word.level === level.id);
      const completedWordsInLevel = playerProgress.completedWords.filter(
        wordId => wordsInLevel.some(w => w.id === wordId)
      );
      
      const totalWords = wordsInLevel.length;
      const completedWords = completedWordsInLevel.length;
      const wordPercentage = totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;
      
      // Frases
      const sentencesInLevel = sentencesList.filter(sentence => sentence.level === level.id);
      const completedSentencesInLevel = playerProgress.completedSentences.filter(
        sentenceId => sentencesInLevel.some(s => s.id === sentenceId)
      );
      
      const totalSentences = sentencesInLevel.length;
      const completedSentences = completedSentencesInLevel.length;
      const sentencePercentage = totalSentences > 0 ? Math.round((completedSentences / totalSentences) * 100) : 0;
      
      // Combinado
      const totalItems = totalWords + totalSentences;
      const completedItems = completedWords + completedSentences;
      const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      return {
        level,
        totalWords,
        completedWords,
        wordPercentage,
        totalSentences,
        completedSentences,
        sentencePercentage,
        totalItems,
        completedItems,
        overallPercentage,
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

  // Obter lista completa de frases com status
  const getSentencesList = () => {
    return sentencesList.map(sentence => ({
      ...sentence,
      completed: playerProgress.completedSentences.includes(sentence.id)
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

  if (!isEmbedded) {
    // Versão standalone com modal próprio (legado)
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
          <div className="flex border-b overflow-x-auto">
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
            <button 
              className={`py-3 px-6 font-fredoka ${activeTab === 'sentences' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sentences')}
            >
              Frases
            </button>
          </div>
          
          <div className="p-6">
            {renderActiveTab()}
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Versão integrada para o novo layout
  return (
    <div className="h-full flex flex-col">
      {/* Navegação de abas para a versão integrada */}
      <div className="bg-white border-b flex overflow-x-auto">
        <button 
          className={`py-3 px-6 font-fredoka ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button 
          className={`py-3 px-6 font-fredoka ${activeTab === 'levels' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('levels')}
        >
          Níveis
        </button>
        <button 
          className={`py-3 px-6 font-fredoka ${activeTab === 'words' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('words')}
        >
          Palavras
        </button>
        <button 
          className={`py-3 px-6 font-fredoka ${activeTab === 'sentences' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('sentences')}
        >
          Frases
        </button>
      </div>
      
      {/* Conteúdo da aba ativa */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {renderActiveTab()}
      </div>
    </div>
  );
  
  // Função para renderizar a aba ativa
  function renderActiveTab() {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'levels':
        return renderLevels();
      case 'words':
        return renderWords();
      case 'sentences':
        return renderSentences();
      default:
        return renderOverview();
    }
  }
  
  // Renderizar a visão geral
  function renderOverview() {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Data</h3>
              <p className="font-bold">{today}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Pontuação Total</h3>
              <p className="font-bold text-xl text-primary">{playerProgress.score} pontos</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Nível Atual</h3>
              <p className="font-bold">{levels.find(l => l.id === playerProgress.currentLevel)?.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Palavras Completadas</h3>
              <p className="font-bold">{playerProgress.completedWords.length} de {wordsList.length}</p>
              <div className="flex justify-between mb-1 mt-2">
                <span className="text-sm text-gray-500">Progresso</span>
                <span className="text-sm font-bold">{calculateWordCompletion()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary"
                  style={{ width: `${calculateWordCompletion()}%` }}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Frases Completadas</h3>
              <p className="font-bold">{playerProgress.completedSentences.length} de {sentencesList.length}</p>
              <div className="flex justify-between mb-1 mt-2">
                <span className="text-sm text-gray-500">Progresso</span>
                <span className="text-sm font-bold">{calculateSentenceCompletion()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${calculateSentenceCompletion()}%` }}
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Progresso Geral</span>
              <span className="text-sm font-bold">{calculateOverallCompletion()}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-secondary to-primary"
                style={{ width: `${calculateOverallCompletion()}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold mb-3 font-fredoka">Resumo de Desempenho</h3>
          <p className="text-gray-700 mb-4">
            A criança está no nível {playerProgress.currentLevel} ({levels.find(l => l.id === playerProgress.currentLevel)?.name}) 
            e completou {playerProgress.completedWords.length} palavras e {playerProgress.completedSentences.length} frases até o momento.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Recomendações:</h4>
              <ul className="list-disc pl-5 text-gray-700">
                <li className="mb-1">Pratique palavras e frases do nível atual regularmente</li>
                <li className="mb-1">Incentive a criança a ouvir as sílabas/palavras antes de arrastar</li>
                <li className="mb-1">Alterne entre os modos "Complete a Palavra" e "Forme a Frase"</li>
                <li className="mb-1">Comemore cada conquista</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">💡</span> Dica do dia
              </h4>
              <p className="text-gray-700 text-sm">
                Jogar por períodos curtos (15-20 minutos) todos os dias é mais eficiente para o aprendizado do que sessões longas menos frequentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar níveis
  function renderLevels() {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold font-fredoka">Progresso por Nível</h3>
          <div className="text-sm bg-white px-3 py-1 rounded-full shadow-sm">
            {calculateLevelStats().filter(stat => stat.overallPercentage === 100).length} de {levels.length} níveis concluídos
          </div>
        </div>
        
        {calculateLevelStats().map(({
          level,
          totalWords,
          completedWords,
          wordPercentage,
          totalSentences,
          completedSentences,
          sentencePercentage,
          totalItems,
          completedItems,
          overallPercentage,
          isCurrentLevel
        }) => (
          <div 
            key={level.id}
            className={`p-4 rounded-lg border ${isCurrentLevel ? 'border-primary bg-white shadow-sm' : 'bg-white shadow-sm'}`}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Palavras</span>
                  <span className="text-sm font-bold">{wordPercentage}% ({completedWords}/{totalWords})</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary"
                    style={{ width: `${wordPercentage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Frases</span>
                  <span className="text-sm font-bold">{sentencePercentage}% ({completedSentences}/{totalSentences})</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${sentencePercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Progresso Geral</span>
                <span className="text-sm font-bold">{overallPercentage}% ({completedItems}/{totalItems})</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary to-primary"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Renderizar palavras
  function renderWords() {
    const wordData = getWordsList();
    const completedCount = wordData.filter(word => word.completed).length;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-fredoka">Palavras Aprendidas</h3>
          <div className="bg-white text-sm px-3 py-1 rounded-full shadow-sm">
            {completedCount} de {wordData.length} palavras
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordData.map(word => (
            <div 
              key={word.id}
              className={`p-4 rounded-lg border flex items-center ${word.completed ? 'border-green-300 bg-white shadow-sm' : 'border-gray-200 bg-white'}`}
            >
              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                <img src={word.imageUrl} alt={word.word} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold truncate">{word.word}</h4>
                <p className="text-xs text-gray-500">
                  Nível {word.level} • {word.syllables.length} sílabas
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                {word.completed ? (
                  <span className="text-green-500 text-xl flex items-center justify-center w-8 h-8">✓</span>
                ) : (
                  <span className="text-gray-300 text-xl flex items-center justify-center w-8 h-8">○</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Renderizar frases
  function renderSentences() {
    const sentenceData = getSentencesList();
    const completedCount = sentenceData.filter(sentence => sentence.completed).length;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-fredoka">Frases Aprendidas</h3>
          <div className="bg-white text-sm px-3 py-1 rounded-full shadow-sm">
            {completedCount} de {sentenceData.length} frases
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {sentenceData.map(sentence => (
            <div 
              key={sentence.id}
              className={`p-4 rounded-lg border flex items-center ${sentence.completed ? 'border-green-300 bg-white shadow-sm' : 'border-gray-200 bg-white'}`}
            >
              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                <img src={sentence.imageUrl} alt={sentence.words.join(' ')} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{sentence.words.join(' ')}</h4>
                <p className="text-xs text-gray-500">
                  Nível {sentence.level} • {sentence.words.length} palavras
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                {sentence.completed ? (
                  <span className="text-green-500 text-xl flex items-center justify-center w-8 h-8">✓</span>
                ) : (
                  <span className="text-gray-300 text-xl flex items-center justify-center w-8 h-8">○</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ProgressDashboard; 