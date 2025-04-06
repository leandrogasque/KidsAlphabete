import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DragItem from '../components/DragItem';
import DropZone from '../components/DropZone';
import AudioButton from '../components/AudioButton';
import PositiveFeedback from '../components/PositiveFeedback';
import RewardPopup from '../components/RewardPopup';
import { playSyllable } from '../utils/speech';
import { useGameContext } from '../contexts/GameContext';
import { getSyllablesForWord, getDropZonesForWord } from '../utils/gameData';

// Tipo para os itens arrastáveis
interface DragItemType {
  id: string;
  text: string;
  used: boolean;
}

// Tipo para as zonas de soltar
interface DropItemType {
  id: string;
  text: string | null;
}

interface CompleteWordProps {
  onShowProgress?: () => void;
}

const CompleteWord: React.FC<CompleteWordProps> = ({ onShowProgress }) => {
  const { 
    currentWord, 
    nextWord, 
    completeWord, 
    currentLevel,
    playerProgress, 
    currentMode 
  } = useGameContext();

  // Estado para os itens arrastáveis (sílabas)
  const [dragItems, setDragItems] = useState<DragItemType[]>([]);

  // Estado para as zonas de soltar (onde as sílabas serão colocadas)
  const [dropZones, setDropZones] = useState<DropItemType[]>([]);

  // Estado para controlar o feedback positivo
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Estado para controlar se a palavra foi completada corretamente
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Estado para controlar a exibição de recompensas
  const [reward, setReward] = useState<{
    show: boolean;
    type: 'points' | 'badge' | 'level';
    value: number | string;
    message: string;
  }>({
    show: false,
    type: 'points',
    value: 0,
    message: ''
  });

  // Inicializar os estados com a palavra atual quando ela muda
  useEffect(() => {
    if (currentWord) {
      // Inicializar as sílabas disponíveis
      const syllables = getSyllablesForWord(currentWord, true);
      setDragItems(syllables);
      
      // Inicializar as zonas de soltar
      const zones = getDropZonesForWord(currentWord);
      setDropZones(zones);
      
      // Resetar os estados de conclusão
      setShowSuccess(false);
      setIsCompleted(false);
    }
  }, [currentWord]);

  // Verifica se a palavra foi completada corretamente
  useEffect(() => {
    if (!currentWord) return;
    
    const correctWord = currentWord.syllables;
    const currentText = dropZones.map(zone => zone.text);
    
    // Verifica se todas as zonas estão preenchidas
    const allZonesFilled = currentText.every(text => text !== null);
    
    // Verifica se a palavra está correta
    const isCorrect = allZonesFilled && 
      correctWord.every((syllable, index) => syllable === currentText[index]);
    
    if (isCorrect && !isCompleted) {
      // Aguarda um momento para mostrar o feedback
      setTimeout(() => {
        setShowSuccess(true);
        setIsCompleted(true);
        
        // Atualizar o progresso do jogador
        if (currentWord) {
          completeWord(currentWord.id);
          
          // Mostrar recompensa de pontos
          const pointsEarned = 10 * currentLevel.id + Math.floor(playerProgress.streakCount / 3) * 5;
          
          setReward({
            show: true,
            type: 'points',
            value: pointsEarned,
            message: `Você ganhou ${pointsEarned} pontos por completar "${currentWord.word}"!`
          });
          
          // Verificar se ganhou alguma conquista baseada no número de palavras completadas
          const completedCount = playerProgress.completedWords.length + 1; // +1 para incluir a atual
          
          if (completedCount === 5) {
            setTimeout(() => {
              setReward({
                show: true,
                type: 'badge',
                value: 'Iniciante',
                message: 'Você completou 5 palavras! Continue assim!'
              });
            }, 3500);
          } else if (completedCount === 10) {
            setTimeout(() => {
              setReward({
                show: true,
                type: 'badge',
                value: 'Aprendiz',
                message: 'Você completou 10 palavras! Você está indo muito bem!'
              });
            }, 3500);
          }
        }
      }, 500);
    }
  }, [dropZones, isCompleted, currentWord, completeWord, currentLevel.id, playerProgress.completedWords.length, playerProgress.streakCount]);

  // Função chamada quando um item é solto em uma zona
  const handleDrop = (zoneId: string, item: { id: string; text: string }) => {
    // Atualiza o estado das zonas de soltar
    setDropZones(prev => 
      prev.map(zone => 
        zone.id === zoneId ? { ...zone, text: item.text } : zone
      )
    );

    // Marca o item como usado
    setDragItems(prev => 
      prev.map(dragItem => 
        dragItem.id === item.id ? { ...dragItem, used: true } : dragItem
      )
    );

    // Reproduz o som da sílaba
    playSyllable(item.text);
  };

  // Função para reiniciar o jogo
  const resetGame = () => {
    // Limpar os estados antes de passar para a próxima palavra
    setDragItems([]);
    setDropZones([]);
    setShowSuccess(false);
    setIsCompleted(false);
    
    // Passar para a próxima palavra
    nextWord();
  };

  // Função chamada quando um item é clicado
  const handleItemClick = (text: string) => {
    playSyllable(text);
  };

  // Determinar número de colunas com base no número de zonas
  const getGridColumns = () => {
    const count = dropZones.length;
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-4";
    return "grid-cols-4"; // Máximo de 4 colunas, para palavras mais longas
  };

  // Se não houver palavra atual, exiba uma mensagem
  if (!currentWord) {
    return (
      <div className="container-game py-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 font-fredoka">Carregando...</h1>
      </div>
    );
  }

  return (
    <div className={`container-game py-2 h-screen overflow-hidden flex flex-col level-${currentLevel.id}`}>
      {/* Barra de status */}
      <div className="flex justify-between items-center mb-2 bg-white p-2 rounded-lg shadow-sm">
        <div>
          <span className="font-fredoka text-gray-700">Nível: </span>
          <span className="font-bold text-primary">{currentLevel.name}</span>
        </div>
        <div className="tooltip group">
          <div 
            className="cursor-pointer"
            onClick={onShowProgress}
          >
            <span className="font-fredoka text-gray-700">Pontos: </span>
            <span className="font-bold text-accent bg-primary/10 px-2 py-1 rounded-md">{playerProgress.score}</span>
          </div>
          <span className="tooltip-text">Clique para ver detalhes</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center"
      >
        <h1 className="text-2xl font-bold text-primary mb-1 font-fredoka">{currentMode.name}</h1>
        <p className="text-sm text-gray-700 font-comic">{currentMode.instructions}</p>
      </motion.div>

      {/* Conteúdo principal em grid */}
      <div className="grid grid-cols-2 gap-2 flex-grow">
        {/* Imagem da palavra */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center items-start"
        >
          <div className="bg-white p-3 rounded-xl shadow-md">
            <img 
              src={currentWord.imageUrl} 
              alt={currentWord.word} 
              className="w-48 h-48 object-cover rounded-lg"
            />
            <AudioButton 
              text={currentWord.word} 
              className="mt-2 btn w-full py-2 text-base"
              autoPlay={false}
            >
              Ouvir Palavra
            </AudioButton>
          </div>
        </motion.div>

        {/* Área para soltar as sílabas */}
        <div className="flex flex-col">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold text-gray-700 mb-2 text-center font-fredoka"
          >
            Forme a palavra:
          </motion.h2>
          <div className={`grid ${getGridColumns()} gap-2 mb-2`}>
            {dropZones.map((zone, index) => (
              <DropZone 
                key={zone.id} 
                accept="syllable"
                onDrop={(item) => handleDrop(zone.id, item)}
                isActive={zone.text !== null}
                index={index}
              >
                {zone.text ? (
                  <span className="text-2xl font-bold">{zone.text}</span>
                ) : (
                  <span className="text-gray-400">?</span>
                )}
              </DropZone>
            ))}
          </div>
          
          {/* Sílabas disponíveis */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-3 rounded-xl shadow-md mt-auto"
          >
            <h2 className="text-lg font-bold text-gray-700 mb-2 text-center font-fredoka">Sílabas:</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {dragItems.map((item) => (
                <DragItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  type="syllable"
                  isDisabled={item.used}
                  onClick={() => handleItemClick(item.text)}
                  onDragStart={() => playSyllable(item.text)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicador de sequência (streak) */}
      {playerProgress.streakCount > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="font-fredoka text-gray-700">Sequência: </span>
            <span className="font-bold text-primary">{playerProgress.streakCount} {playerProgress.streakCount >= 3 ? '🔥' : ''}</span>
          </div>
        </motion.div>
      )}

      {/* Feedback positivo */}
      {showSuccess && <PositiveFeedback onComplete={resetGame} />}

      {/* Popup de recompensa */}
      <RewardPopup 
        show={reward.show}
        type={reward.type}
        value={reward.value}
        message={reward.message}
        onClose={() => setReward(prev => ({ ...prev, show: false }))}
      />

      {/* Botão para próxima palavra */}
      {isCompleted && !showSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button 
            onClick={resetGame}
            className="btn bg-secondary"
          >
            Próxima Palavra
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CompleteWord;