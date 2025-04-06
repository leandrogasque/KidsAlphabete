import React, { useState } from 'react';
import { getFallbackImage } from '../utils/imageFallback';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  keyword?: string; // Palavra-chave para buscar no Unsplash
}

/**
 * Componente que exibe uma imagem com sistema de fallback em camadas:
 * 1. Tenta a URL original
 * 2. Tenta o Unsplash com a palavra-chave
 * 3. Usa uma imagem fixa de nosso banco de imagens
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  keyword = '',
}) => {
  // Estado para rastrear a URL atual e o nível de fallback
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackLevel, setFallbackLevel] = useState(0);
  
  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    console.log(`Erro ao carregar imagem (nível ${fallbackLevel}): ${currentSrc}`);
    
    // Determinar a próxima URL de fallback com base no nível atual
    if (fallbackLevel === 0) {
      // Primeiro fallback: tentar Unsplash com a palavra-chave
      if (keyword) {
        const safeKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const unsplashUrl = `https://source.unsplash.com/featured/?${safeKeyword}`;
        setCurrentSrc(unsplashUrl);
        setFallbackLevel(1);
        return;
      }
      // Se não houver palavra-chave, pular para o segundo fallback
      setFallbackLevel(2);
      handleImageError();
    } 
    else if (fallbackLevel === 1) {
      // Segundo fallback: usar nossa biblioteca de imagens local
      const localFallback = getFallbackImage(keyword || alt);
      setCurrentSrc(localFallback);
      setFallbackLevel(2);
    }
    // No nível 2, já estamos usando o último fallback possível,
    // então não há mais nada a fazer se falhar novamente
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback; 