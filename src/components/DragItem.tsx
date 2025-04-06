import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export interface DragItemProps {
  id: string;
  text: string;
  onDragStart?: () => void;
  onClick?: () => void;
  isDisabled?: boolean;
}

/**
 * Componente arrastável que representa uma sílaba ou letra
 * @param id - Identificador único do item
 * @param text - Texto a ser exibido (ex: "BA", "NA")
 * @param onDragStart - Função chamada quando o arrasto inicia
 * @param onClick - Função chamada quando o item é clicado
 * @param isDisabled - Se o item está desabilitado (já foi usado)
 */
const DragItem = ({ id, text, onDragStart, onClick, isDisabled = false }: DragItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id,
    data: { text },
    disabled: isDisabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  useEffect(() => {
    if (isDragging && onDragStart) {
      onDragStart();
    }
  }, [isDragging, onDragStart]);

  console.log(`Renderizando DragItem: ${id}, texto: ${text}`);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={`drag-item ${isDragging ? 'opacity-50' : 'opacity-100'} ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}
      onClick={!isDisabled ? onClick : undefined}
    >
      {text}
    </motion.div>
  );
};

export default DragItem;