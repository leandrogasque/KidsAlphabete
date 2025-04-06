import React from 'react';
import { useGameContext } from '../contexts/GameContext';

const SimpleAudioPlayer: React.FC = () => {
  const { settings, updateSettings } = useGameContext();

  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white p-4 rounded-xl shadow-xl text-center">
        <h3 className="text-lg font-bold mb-2">🎵 Sons do Jogo</h3>
        
        {/* Elemento de áudio nativo com controles visíveis do navegador */}
        <audio 
          src="https://cdn.pixabay.com/download/audio/2022/02/22/audio_67c89907e1.mp3?filename=happy-children-111912.mp3"
          controls
          loop
          className="w-full mb-2"
        />
        
        <p className="text-sm text-gray-600 mt-1">
          Use os controles acima para reproduzir a música
        </p>
      </div>
    </div>
  );
};

export default SimpleAudioPlayer; 