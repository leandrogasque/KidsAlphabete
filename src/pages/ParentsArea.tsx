import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';
import ProgressDashboard from '../components/ProgressDashboard';

interface ParentsAreaProps {
  onClose: () => void;
}

const ParentsArea: React.FC<ParentsAreaProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'progress' | 'settings'>('progress');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Configurações
  const [newPin, setNewPin] = useState('');
  
  const { resetProgress, settings, updateSettings } = useGameContext();

  const handleLogin = () => {
    if (password === settings.parentPin) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('PIN incorreto. Tente novamente.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Função para confirmar reset
  const confirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };
  
  // Função para alterar PIN
  const handleChangePin = () => {
    if (newPin.length === 4) {
      updateSettings({ parentPin: newPin });
      setNewPin('');
      alert('PIN atualizado com sucesso!');
    } else {
      alert('O PIN deve ter 4 dígitos.');
    }
  };
  
  // Função para atualizar configurações
  const handleToggleSetting = (setting: 'soundEffects' | 'backgroundMusic' | 'hapticFeedback') => {
    updateSettings({
      [setting]: !settings[setting]
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full h-[90vh] shadow-2xl flex flex-col"
      >
        <div className="p-4 md:p-6 bg-primary text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl md:text-2xl font-bold font-fredoka">Área dos Pais</h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        
        {!isAuthenticated ? (
          // Tela de login
          <div className="p-8 text-center overflow-y-auto flex-grow">
            <div className="max-w-md mx-auto">
              <img src="/parents-icon.svg" alt="Área dos Pais" className="w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-6 font-fredoka">
                Acesso Restrito aos Pais
              </h3>
              <p className="text-gray-600 mb-6">
                Esta área é destinada aos pais e responsáveis para acompanhar o 
                progresso e personalizar a experiência de aprendizado.
              </p>
              
              <div className="mb-4">
                <label className="block text-left text-gray-700 text-sm font-bold mb-2">
                  Digite o PIN de acesso:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleKeyPress}
                  placeholder="Digite o PIN (padrão: 1234)"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={4}
                />
                {error && <p className="text-red-500 text-left mt-2 text-sm">{error}</p>}
              </div>
              
              <button
                onClick={handleLogin}
                className="btn px-6 py-3 w-full"
              >
                Acessar
              </button>
              
              <p className="text-gray-500 text-sm mt-4">
                {settings.parentPin === '1234' ? 
                  'PIN padrão: 1234 (Você poderá alterar depois)' : 
                  'Entre com o PIN personalizado que você configurou'}
              </p>
            </div>
          </div>
        ) : (
          // Conteúdo da área dos pais após autenticação
          <div className="flex flex-col overflow-hidden flex-grow">
            {/* Navegação entre seções */}
            <div className="flex border-b overflow-x-auto shrink-0">
              <button 
                className={`py-3 px-6 font-fredoka ${activeSection === 'progress' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveSection('progress')}
              >
                Progresso
              </button>
              <button 
                className={`py-3 px-6 font-fredoka ${activeSection === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveSection('settings')}
              >
                Configurações
              </button>
            </div>
            
            {/* Seção de Progresso */}
            {activeSection === 'progress' && (
              <div className="overflow-y-auto flex-grow">
                <ProgressDashboard onClose={() => {}} isEmbedded={true} />
              </div>
            )}
            
            {/* Seção de Configurações */}
            {activeSection === 'settings' && (
              <div className="p-4 md:p-6 overflow-y-auto flex-grow">
                <h3 className="text-xl font-bold mb-4 font-fredoka">Configurações</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold mb-3">Segurança</h4>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Alterar PIN de acesso:
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Novo PIN"
                          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          maxLength={4}
                        />
                        <button 
                          onClick={handleChangePin}
                          className="btn-outline px-4 py-2"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold mb-3">Preferências</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="soundEffects"
                          checked={settings.soundEffects}
                          onChange={() => handleToggleSetting('soundEffects')}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="soundEffects" className="select-none">
                          Efeitos sonoros
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="backgroundMusic"
                          checked={settings.backgroundMusic}
                          onChange={() => handleToggleSetting('backgroundMusic')}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="backgroundMusic" className="select-none">
                          Música de fundo
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hapticFeedback"
                          checked={settings.hapticFeedback}
                          onChange={() => handleToggleSetting('hapticFeedback')}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="hapticFeedback" className="select-none">
                          Vibração ao acertar
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-bold mb-3">Dados</h4>
                  
                  <div className="mb-3">
                    <button 
                      onClick={() => setShowResetConfirm(true)} 
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <span className="mr-2">↺</span> Reiniciar todo o progresso
                    </button>
                    <p className="text-gray-500 text-sm mt-1">
                      Esta ação irá apagar todo o progresso atual.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Sair da Área dos Pais
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Modal de confirmação para reset */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="font-bold text-lg mb-4">Confirmar Reset</h3>
              <p className="mb-6">
                Você tem certeza que deseja reiniciar todo o progresso? Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-3 justify-end">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-outline py-2 px-4"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmReset}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ParentsArea; 