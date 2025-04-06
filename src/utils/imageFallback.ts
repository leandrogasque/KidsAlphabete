/**
 * Mapeamento de palavras para URLs de imagens de fallback
 * Usado como última alternativa se tanto a URL original quanto o Unsplash falharem
 */
export const imageFallbacks: Record<string, string> = {
  // Nível 1
  "BANANA": "https://cdn.pixabay.com/photo/2017/06/27/22/21/banana-2449019_1280.jpg",
  "ABACAXI": "https://cdn.pixabay.com/photo/2017/03/11/18/13/pineapple-2135676_1280.jpg",
  "BOLA": "https://cdn.pixabay.com/photo/2013/07/12/13/57/soccer-147854_1280.png",
  "CASA": "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_1280.png",
  "PATO": "https://cdn.pixabay.com/photo/2016/04/01/09/40/duck-1299576_1280.png",
  "SAPO": "https://cdn.pixabay.com/photo/2014/04/03/10/28/frog-310607_1280.png",
  "MACACO": "https://cdn.pixabay.com/photo/2021/01/30/16/35/monkey-5964549_1280.png",
  "LEITE": "https://cdn.pixabay.com/photo/2016/12/18/12/49/cyber-monday-1915737_1280.png",
  "TOMATE": "https://cdn.pixabay.com/photo/2018/06/10/17/50/tomato-3466050_1280.jpg",
  "PICOLÉ": "https://cdn.pixabay.com/photo/2017/07/25/13/17/ice-cream-2537436_1280.jpg",
  
  // Nível 2
  "CACHORRO": "https://cdn.pixabay.com/photo/2016/12/13/00/13/rabbit-1903016_1280.png",
  "BORBOLETA": "https://cdn.pixabay.com/photo/2017/07/27/18/21/butterfly-2546228_1280.png",
  "ELEFANTE": "https://cdn.pixabay.com/photo/2016/03/31/21/41/elephant-1296551_1280.png",
  "TELEFONE": "https://cdn.pixabay.com/photo/2013/07/12/13/57/telephone-147733_1280.png",
  "BICICLETA": "https://cdn.pixabay.com/photo/2014/04/03/00/35/bike-308761_1280.png",
  "CARROSSEL": "https://cdn.pixabay.com/photo/2017/01/11/14/56/carousel-1971682_1280.png",
  "TARTARUGA": "https://cdn.pixabay.com/photo/2014/12/22/00/05/turtle-576871_1280.png",
  "MORANGO": "https://cdn.pixabay.com/photo/2016/04/01/09/51/strawberry-1300150_1280.png",
  "FOGUETE": "https://cdn.pixabay.com/photo/2014/04/02/14/12/rocket-306202_1280.png",
  
  // Nível 3
  "COMPUTADOR": "https://cdn.pixabay.com/photo/2016/03/27/18/55/laptop-1283697_1280.png",
  "CHOCOLATE": "https://cdn.pixabay.com/photo/2013/07/12/18/23/cocoa-beans-154043_1280.png",
  "DINOSSAURO": "https://cdn.pixabay.com/photo/2017/01/31/17/10/dinosaur-2025362_1280.png",
  "HELICÓPTERO": "https://cdn.pixabay.com/photo/2016/03/31/21/43/aircraft-1296605_1280.png",
  "BIBLIOTECA": "https://cdn.pixabay.com/photo/2014/12/21/23/49/library-576058_1280.png",
  "ESPANTALHO": "https://cdn.pixabay.com/photo/2016/04/01/09/56/ghost-1300225_1280.png",
  "CALENDÁRIO": "https://cdn.pixabay.com/photo/2013/07/12/12/53/date-146375_1280.png",
  "ASTRONAUTA": "https://cdn.pixabay.com/photo/2017/06/10/12/45/astronaut-2389894_1280.png",
  "GIRASSOL": "https://cdn.pixabay.com/photo/2016/04/01/09/51/sunflower-1300130_1280.png",
  "ABACATE": "https://cdn.pixabay.com/photo/2017/05/30/23/17/avocado-2359204_1280.png"
};

/**
 * Função para obter a URL de fallback de uma palavra
 * @param word Palavra para a qual buscar imagem de fallback
 * @returns URL da imagem de fallback ou URL de uma imagem aleatória
 */
export const getFallbackImage = (word: string): string => {
  // Converter para maiúsculas para corresponder às chaves do mapeamento
  const upperWord = word.toUpperCase();
  
  // Retornar a imagem de fallback se existir
  if (imageFallbacks[upperWord]) {
    return imageFallbacks[upperWord];
  }
  
  // Se não houver fallback específico, retornar uma imagem genérica do Pixabay
  return "https://cdn.pixabay.com/photo/2016/10/09/00/18/star-1724439_1280.png";
}; 