/**
 * Formata um valor em segundos para uma string de tempo no formato mm:ss
 * @param seconds Número de segundos para formatar
 * @returns String formatada no formato mm:ss
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 