import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import React, { ReactNode } from 'react';

export interface DropZoneProps {
  accept: string;
  onDrop: (item: any) => void;
  children: ReactNode;
  isActive: boolean;
  index: number;
}

/**
 * Componente que representa uma zona onde as sílabas podem ser soltas
 * @param accept - Tipo de item que pode ser solto nesta zona
 * @param onDrop - Função chamada quando um item é solto
 * @param children - Conteúdo da zona (sílaba ou placeholder)
 * @param isActive - Se a zona está ativa (com uma sílaba)
 * @param index - Índice da zona na palavra
 */
const DropZone = ({ accept, onDrop, children, isActive, index }: DropZoneProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: () => !isActive,
  }));

  // Atraso para animações baseado no índice
  const animationDelay = index * 0.1;

  console.log(`Renderizando DropZone: ${index}, aceita: ${accept}, ativo: ${isActive}`);

  // Determinar a classe CSS com base no estado da zona
  const getZoneClass = () => {
    if (isOver && canDrop) return 'drop-zone-hover';
    if (isActive) return 'drop-zone-active';
    return '';
  };

  return (
    <motion.div
      ref={drop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className={`drop-zone ${getZoneClass()}`}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              boxShadow: ["0px 0px 0px rgba(255,230,109,0)", "0px 0px 15px rgba(255,230,109,0.7)", "0px 0px 0px rgba(255,230,109,0)"]
            }}
            transition={{ 
              duration: 0.3,
              boxShadow: { repeat: 0, duration: 0.8 }
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            animate={{ 
              scale: isOver && canDrop ? 1.1 : 1,
              backgroundColor: isOver && canDrop ? "var(--color-accent-light)" : "transparent"
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DropZone;