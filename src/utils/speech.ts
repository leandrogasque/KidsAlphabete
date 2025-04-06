/**
 * Utilitário para trabalhar com a Web Speech API
 */

/**
 * Reproduz um texto usando a Web Speech API
 * @param text - Texto a ser falado
 * @param options - Opções de configuração da fala
 * @returns Promise que resolve quando a fala terminar
 */
export const speakText = (text: string, options?: {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurações padrão para voz infantil em português
    utterance.lang = options?.lang || 'pt-BR';
    utterance.rate = options?.rate || 0.9; // Velocidade um pouco mais lenta para crianças
    utterance.pitch = options?.pitch || 1.2; // Tom um pouco mais alto (infantil)
    utterance.volume = options?.volume || 1.0;
    
    utterance.onend = () => {
      resolve();
    };
    
    // Cancela qualquer fala em andamento
    window.speechSynthesis.cancel();
    
    // Inicia a nova fala
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Verifica se a Web Speech API está disponível no navegador
 * @returns true se a API estiver disponível
 */
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

/**
 * Reproduz um som de feedback positivo
 */
export const playPositiveFeedback = async (): Promise<void> => {
  await speakText("Muito bem!", {
    rate: 1.0,
    pitch: 1.3,
  });
};

/**
 * Reproduz o som de uma sílaba
 * @param syllable - Sílaba a ser reproduzida
 */
export const playSyllable = async (syllable: string): Promise<void> => {
  await speakText(syllable, {
    rate: 0.8, // Mais lento para enfatizar a sílaba
    pitch: 1.2,
  });
};