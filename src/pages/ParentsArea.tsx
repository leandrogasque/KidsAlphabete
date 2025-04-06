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
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-primary py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <img src="/parents-icon.svg" alt="" className="w-8 h-8 mr-3" />
          <h1 className="text-white text-xl font-bold font-fredoka">Área dos Pais</h1>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          aria-label="Voltar ao jogo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {!isAuthenticated ? (
        // Tela de login
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"
          >
            <div className="text-center">
              <img src="/parents-icon.svg" alt="Área dos Pais" className="w-24 h-24 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-6 font-fredoka">
                Acesso Restrito aos Pais
              </h2>
              <p className="text-gray-600 mb-6">
                Esta área é destinada aos pais e responsáveis para acompanhar o 
                progresso e personalizar a experiência de aprendizado.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
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
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
            
            <button
              onClick={handleLogin}
              className="btn px-6 py-3 w-full"
            >
              Acessar
            </button>
            
            <p className="text-gray-500 text-sm mt-4 text-center">
              {settings.parentPin === '1234' ? 
                'PIN padrão: 1234 (Você poderá alterar depois)' : 
                'Entre com o PIN personalizado que você configurou'}
            </p>
          </motion.div>
        </div>
      ) : (
        // Conteúdo principal após autenticação
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Barra lateral de navegação */}
          <nav className="bg-white w-full md:w-64 border-b md:border-r border-gray-200 shrink-0">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center md:block">
              <h2 className="font-bold text-gray-700">Menu</h2>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-500 hover:text-gray-700 text-sm md:hidden"
              >
                Sair
              </button>
            </div>
            <ul className="p-2">
              <li>
                <button 
                  className={`w-full text-left p-3 rounded-lg flex items-center ${activeSection === 'progress' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveSection('progress')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Progresso
                </button>
              </li>
              <li className="mt-2">
                <button 
                  className={`w-full text-left p-3 rounded-lg flex items-center ${activeSection === 'settings' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveSection('settings')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurações
                </button>
              </li>
            </ul>
            
            <div className="hidden md:block mt-auto p-4">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair da Área dos Pais
              </button>
            </div>
          </nav>
          
          {/* Conteúdo principal */}
          <main className="flex-1 overflow-auto">
            {/* Seção de Progresso */}
            {activeSection === 'progress' && (
              <div className="h-full">
                <ProgressDashboard onClose={() => {}} isEmbedded={true} />
              </div>
            )}
            
            {/* Seção de Configurações */}
            {activeSection === 'settings' && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 font-fredoka">Configurações</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold mb-4 text-lg">Segurança</h4>
                    
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
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold mb-4 text-lg">Preferências</h4>
                    
                    <div className="space-y-4">
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
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold mb-4 text-lg">Dados</h4>
                    
                    <div>
                      <button 
                        onClick={() => setShowResetConfirm(true)} 
                        className="text-red-500 hover:text-red-700 flex items-center bg-red-50 p-3 rounded-lg w-full justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Reiniciar todo o progresso
                      </button>
                      <p className="text-gray-500 text-sm mt-2">
                        Esta ação irá apagar todo o progresso atual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
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
    </div>
  );
};

export default ParentsArea; 