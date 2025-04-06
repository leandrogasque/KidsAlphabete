import React, { useState, useEffect, useCallback, memo } from 'react';
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

// Componente memoizado para a barra de status
const StatusBar = memo(({ level, score, onShowProgress }: { 
  level: { id: number, name: string }, 
  score: number, 
  onShowProgress?: () => void 
}) => (
  <div className="flex justify-between items-center mb-2 bg-white p-2 rounded-lg shadow-sm">
    <div>
      <span className="font-fredoka text-gray-700">Nível: </span>
      <span className="font-bold text-primary">{level.name}</span>
    </div>
    <div className="tooltip group">
      <div 
        className="cursor-pointer"
        onClick={onShowProgress}
      >
        <span className="font-fredoka text-gray-700">Pontos: </span>
        <span className="font-bold text-accent bg-primary/10 px-2 py-1 rounded-md">{score}</span>
      </div>
      <span className="tooltip-text">Clique para ver detalhes</span>
    </div>
  </div>
));

// Componente memoizado para a imagem da palavra
const WordImage = memo(({ imageUrl, word, onAudioPlay }: {
  imageUrl: string,
  word: string,
  onAudioPlay: () => void
}) => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="flex justify-center items-start"
  >
    <div className="bg-white p-3 rounded-xl shadow-md">
      <img 
        src={imageUrl} 
        alt={word} 
        className="w-48 h-48 object-cover rounded-lg"
      />
      <AudioButton 
        text={word} 
        className="mt-2 btn w-full py-2 text-base"
        autoPlay={false}
        onPlay={onAudioPlay}
      >
        Ouvir Palavra
      </AudioButton>
    </div>
  </motion.div>
));

console.log('CompleteWord: Componente está sendo carregado');

const CompleteWord: React.FC<CompleteWordProps> = memo(({ onShowProgress }) => {
  console.log('CompleteWord: Renderizando componente');
  
  const { 
    currentWord, 
    nextWord, 
    completeWord, 
    currentLevel,
    playerProgress, 
    currentMode 
  } = useGameContext();
  
  console.log('CompleteWord: GameContext carregado', { 
    hasCurrentWord: !!currentWord, 
    currentLevel, 
    currentMode 
  });

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
    console.log('CompleteWord: useEffect para palavra atual', currentWord);
    if (currentWord) {
      try {
        // Inicializar as sílabas disponíveis
        const syllables = getSyllablesForWord(currentWord, true);
        console.log('CompleteWord: Sílabas geradas', syllables);
        setDragItems(syllables);
        
        // Inicializar as zonas de soltar
        const zones = getDropZonesForWord(currentWord);
        console.log('CompleteWord: Zonas geradas', zones);
        setDropZones(zones);
        
        // Resetar os estados de conclusão
        setShowSuccess(false);
        setIsCompleted(false);
      } catch (error) {
        console.error('Erro ao inicializar palavra:', error);
      }
    } else {
      console.warn('CompleteWord: Sem palavra atual');
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
      console.log('CompleteWord: Palavra completada corretamente');
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
            }, 1500);
          } else if (completedCount === 10) {
            setTimeout(() => {
              setReward({
                show: true,
                type: 'badge',
                value: 'Aprendiz',
                message: 'Você completou 10 palavras! Você está indo muito bem!'
              });
            }, 1500);
          }
        }
      }, 500);
    }
  }, [dropZones, isCompleted, currentWord, completeWord, currentLevel.id, playerProgress.completedWords.length, playerProgress.streakCount]);

  // Função chamada quando um item é solto em uma zona - memoizado com useCallback
  const handleDrop = useCallback((zoneId: string, item: { id: string; text: string }) => {
    console.log('CompleteWord: Item solto', { zoneId, item });
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
  }, []);

  // Função para reiniciar o jogo - memoizado com useCallback
  const resetGame = useCallback(() => {
    console.log('CompleteWord: Reiniciando jogo');
    // Limpar os estados antes de passar para a próxima palavra
    setDragItems([]);
    setDropZones([]);
    setShowSuccess(false);
    setIsCompleted(false);
    
    // Passar para a próxima palavra
    nextWord();
  }, [nextWord]);

  // Função chamada quando um item é clicado - memoizado com useCallback
  const handleItemClick = useCallback((text: string) => {
    playSyllable(text);
  }, []);

  // Determinar número de colunas com base no número de zonas - memoizado com useCallback
  const getGridColumns = useCallback(() => {
    const count = dropZones.length;
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-4";
    return "grid-cols-4"; // Máximo de 4 colunas, para palavras mais longas
  }, [dropZones.length]);

  // Fechar popup de recompensa - memoizado com useCallback
  const handleCloseReward = useCallback(() => {
    setReward(prev => ({ ...prev, show: false }));
  }, []);

  // Play audio callback - memoizado com useCallback
  const handlePlayAudio = useCallback(() => {
    if (currentWord) {
      playSyllable(currentWord.word);
    }
  }, [currentWord]);

  // Se não houver palavra atual, exiba uma mensagem com botão para tentar novamente
  if (!currentWord) {
    console.warn('CompleteWord: Renderizando estado de loading');
    return (
      <div className="container-game py-8 flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-primary mb-4 font-fredoka">Carregando...</h1>
        <p className="text-xl mb-6 text-gray-700 font-comic">Aguarde enquanto preparamos o jogo.</p>
        <button 
          className="btn px-8 py-3 text-lg"
          onClick={() => {
            console.log('Tentando reiniciar o jogo...');
            window.location.reload();
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  console.log('CompleteWord: Renderizando jogo com palavra', currentWord.word);
  
  return (
    <div className={`container-game py-2 h-screen overflow-hidden flex flex-col level-${currentLevel.id}`}>
      {/* Barra de status - agora usa o componente memoizado */}
      <StatusBar 
        level={currentLevel} 
        score={playerProgress.score} 
        onShowProgress={onShowProgress} 
      />

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
        {/* Imagem da palavra - agora usa o componente memoizado */}
        <WordImage 
          imageUrl={currentWord.imageUrl} 
          word={currentWord.word} 
          onAudioPlay={handlePlayAudio}
        />

        {/* Área de jogo */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-md">
          {/* Palavra a ser completada */}
          <div className="text-center mb-4">
            <h2 className="font-fredoka text-xl text-gray-700">Complete a palavra:</h2>
            <div className={`mt-2 grid gap-2 ${getGridColumns()}`}>
              {dropZones.map((zone, index) => (
                <DropZone
                  key={zone.id}
                  accept="syllable"
                  isActive={!!zone.text}
                  index={index}
                  onDrop={(item) => handleDrop(zone.id, item)}
                >
                  {zone.text || '_'}
                </DropZone>
              ))}
            </div>
          </div>

          {/* Sílabas disponíveis */}
          <div className="mt-auto">
            <h3 className="font-fredoka text-lg text-gray-700 mb-2">Sílabas:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {dragItems.map(item => !item.used && (
                <DragItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  type="syllable"
                  onClick={() => handleItemClick(item.text)}
                />
              ))}
            </div>
          </div>

          {/* Botão para próxima palavra */}
          {isCompleted && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="btn mt-4 px-8 py-2"
              onClick={resetGame}
            >
              Próxima Palavra
            </motion.button>
          )}
        </div>
      </div>

      {/* Feedback de sucesso */}
      {showSuccess && (
        <PositiveFeedback onComplete={() => {
          // Opcional: ação adicional após mostrar o feedback
          console.log('Feedback de sucesso concluído');
        }} />
      )}

      {/* Popup de recompensa */}
      {reward.show && (
        <RewardPopup
          show={reward.show}
          type={reward.type}
          value={reward.value}
          message={reward.message}
          onClose={handleCloseReward}
        />
      )}
    </div>
  );
});

export default CompleteWord;