import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export interface DragItemProps {
  id: string;
  text: string;
  type: string;
  onDragStart?: () => void;
  onClick?: () => void;
  isDisabled?: boolean;
}

/**
 * Componente arrastável que representa uma sílaba ou letra
 * @param id - Identificador único do item
 * @param text - Texto a ser exibido (ex: "BA", "NA")
 * @param type - Tipo do item para o sistema de drag and drop
 * @param onDragStart - Função chamada quando o arrasto inicia
 * @param onClick - Função chamada quando o item é clicado
 * @param isDisabled - Se o item está desabilitado (já foi usado)
 */
const DragItem = ({ id, text, type, onDragStart, onClick, isDisabled = false }: DragItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isDisabled,
  }));

  useEffect(() => {
    if (isDragging && onDragStart) {
      onDragStart();
    }
  }, [isDragging, onDragStart]);

  console.log(`Renderizando DragItem: ${id}, tipo: ${type}, texto: ${text}`);

  return (
    <motion.div
      ref={drag}
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