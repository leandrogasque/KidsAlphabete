import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DragItem from './DragItem';
import DropZone from './DropZone';
import { playSyllable } from '../utils/speech';

interface TutorialProps {
  onComplete: () => void;
}

/**
 * Componente de tutorial interativo que ensina as crianças a jogar
 */
const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  // Estado para controlar o passo atual do tutorial
  const [step, setStep] = useState(0);
  // Estado para simular ações do tutorial
  const [demoDropZone, setDemoDropZone] = useState<{ id: string, text: string | null }>({ id: 'demo', text: null });
  
  // Passos do tutorial
  const tutorialSteps = [
    {
      title: "Bem-vindo ao AlfaBeta!",
      description: "Vamos aprender como jogar? Clique em 'Próximo' para continuar.",
      image: "🎮",
    },
    {
      title: "Observe a imagem",
      description: "Primeiro, olhe para a imagem e tente identificar qual é a palavra.",
      image: "🍎",
    },
    {
      title: "Ouça a palavra",
      description: "Você pode clicar no botão 'Ouvir Palavra' para escutar como a palavra é pronunciada.",
      image: "🔊",
    },
    {
      title: "Arraste as sílabas",
      description: "Arraste as sílabas para os espaços em branco para formar a palavra correta.",
      image: "👆",
    },
    {
      title: "Ouça as sílabas",
      description: "Clique em uma sílaba para ouvir como ela é pronunciada.",
      image: "👂",
    },
    {
      title: "Parabéns!",
      description: "Quando você completar a palavra corretamente, ganhará pontos e poderá passar para a próxima palavra!",
      image: "🎉",
    },
  ];

  // Configuração do passo atual
  const currentStep = tutorialSteps[step];

  // Avançar para o próximo passo
  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  // Voltar para o passo anterior
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Demonstração de arrastar e soltar para o passo 3
  const handleDemoClick = () => {
    if (step === 3) {
      // Simular arrastar e soltar
      setTimeout(() => {
        setDemoDropZone({ id: 'demo', text: 'MA' });
        playSyllable('MA');
      }, 300);
    }
    
    if (step === 4) {
      // Simular clique na sílaba
      playSyllable('ÇÃ');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
      >
        {/* Indicador de progresso */}
        <div className="bg-primary h-2 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-secondary"
            initial={{ width: `${(step / (tutorialSteps.length - 1)) * 100}%` }}
            animate={{ width: `${(step / (tutorialSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Conteúdo do tutorial */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  className="text-6xl mb-4 inline-block"
                >
                  {currentStep.image}
                </motion.div>
                <h2 className="text-2xl font-bold text-primary mb-2 font-fredoka">{currentStep.title}</h2>
                <p className="text-gray-700 font-comic">{currentStep.description}</p>
              </div>
              
              {/* Demonstração interativa para o passo 3 e 4 */}
              {step === 3 && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="flex justify-center mb-4">
                    <DropZone 
                      accept="tutorial"
                      onDrop={() => {}}
                      isActive={demoDropZone.text !== null}
                      index={0}
                    >
                      {demoDropZone.text ? (
                        <span className="text-3xl font-bold">{demoDropZone.text}</span>
                      ) : (
                        <span className="text-gray-400">?</span>
                      )}
                    </DropZone>
                    
                    <DropZone 
                      accept="tutorial"
                      onDrop={() => {}}
                      isActive={false}
                      index={1}
                    >
                      <span className="text-gray-400">?</span>
                    </DropZone>
                  </div>
                  
                  <div className="flex space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDemoClick}
                      className="drag-item pulse-animation"
                    >
                      MA
                    </motion.div>
                    <motion.div className="drag-item opacity-60">ÇÃ</motion.div>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Clique na sílaba "MA" para ver como funciona!
                  </div>
                </div>
              )}
              
              {/* Demonstração para o passo 4 */}
              {step === 4 && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="flex space-x-4">
                    <motion.div className="drag-item opacity-60">MA</motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDemoClick}
                      className="drag-item pulse-animation"
                    >
                      ÇÃ
                    </motion.div>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Clique na sílaba "ÇÃ" para ouvir como ela é pronunciada!
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Botões de navegação */}
        <div className="p-4 bg-gray-50 flex justify-between">
          <button 
            onClick={prevStep}
            disabled={step === 0}
            className={`py-2 px-4 rounded-lg font-fredoka ${
              step === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary'
            }`}
          >
            Voltar
          </button>
          
          <div className="text-gray-500 font-fredoka">
            {step + 1} de {tutorialSteps.length}
          </div>
          
          <button 
            onClick={nextStep}
            className="btn py-2"
          >
            {step === tutorialSteps.length - 1 ? 'Começar' : 'Próximo'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Tutorial; 