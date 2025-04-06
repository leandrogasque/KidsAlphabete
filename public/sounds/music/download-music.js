/**
 * Script para baixar automaticamente as músicas para o jogo
 * 
 * Como usar:
 * 1. Certifique-se de ter Node.js instalado
 * 2. Execute o script com: node download-music.js
 * 
 * Este script baixará automaticamente as músicas necessárias do Pixabay
 * e as salvará com os nomes corretos na pasta atual.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// URLs das músicas
const MUSIC_URLS = {
  'happy-kids.mp3': 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_67c89907e1.mp3?filename=happy-children-111912.mp3', // Happy Children by FASSounds
  'victory.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c204e69023.mp3?filename=success-1-6297.mp3' // Success by Lesiakower
};

// Função para baixar um arquivo
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Baixando ${outputPath}...`);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Falha ao baixar. Código de status: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Download completo: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Remover arquivo parcial
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Remover arquivo parcial
      reject(err);
    });
  });
}

async function main() {
  console.log('Iniciando download das músicas para o jogo...');
  
  // Criar diretório se não existir
  const currentDir = path.dirname(__filename);
  
  // Baixar cada música
  const downloads = Object.entries(MUSIC_URLS).map(([filename, url]) => {
    const outputPath = path.join(currentDir, filename);
    return downloadFile(url, outputPath);
  });
  
  try {
    await Promise.all(downloads);
    console.log('Todos os downloads foram concluídos com sucesso!');
    console.log('\nAgora você pode iniciar o jogo com música. Divirta-se!');
  } catch (error) {
    console.error('Erro durante o download:', error.message);
  }
}

// Executar o script
main(); 