/**
 * Dados para o jogo "Forma a Frase"
 */

export interface SentenceData {
  id: string;
  words: string[]; // As palavras na ordem correta
  imageUrl: string;
  audio?: string;
  distractors?: string[]; // Palavras adicionais para aumentar a dificuldade
  level: number; // Nível de dificuldade da frase
}

// Banco de frases
export const sentencesList: SentenceData[] = [
  // Nível 1 - Iniciante
  {
    id: "sentence1",
    words: ["O", "GATO", "DORME"],
    imageUrl: "https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["CACHORRO", "COME"],
    level: 1
  },
  {
    id: "sentence2",
    words: ["A", "MENINA", "SORRI"],
    imageUrl: "https://images.pexels.com/photos/1062280/pexels-photo-1062280.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["MENINO", "CHORA"],
    level: 1
  },
  {
    id: "sentence3",
    words: ["O", "CÉU", "ESTÁ", "AZUL"],
    imageUrl: "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["NUBLADO", "SOL"],
    level: 1
  },
  {
    id: "sentence4",
    words: ["A", "BOLA", "É", "REDONDA"],
    imageUrl: "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["QUADRADA", "GRANDE", "PEQUENA"],
    level: 1
  },
  {
    id: "sentence5",
    words: ["EU", "GOSTO", "DE", "LIVROS"],
    imageUrl: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["BRINQUEDOS", "NÃO", "MUITO"],
    level: 1
  },
  
  // Nível 2 - Intermediário
  {
    id: "sentence6",
    words: ["O", "CACHORRO", "LATE", "NO", "QUINTAL"],
    imageUrl: "https://images.pexels.com/photos/1485637/pexels-photo-1485637.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["GATO", "MORDE", "CASA", "CORRE"],
    level: 2
  },
  {
    id: "sentence7",
    words: ["AS", "CRIANÇAS", "BRINCAM", "NO", "PARQUE"],
    imageUrl: "https://images.pexels.com/photos/3933881/pexels-photo-3933881.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["ADULTOS", "ESTUDAM", "CASA", "PRAIA"],
    level: 2
  },
  {
    id: "sentence8",
    words: ["ELA", "GOSTA", "DE", "COMER", "SORVETE"],
    imageUrl: "https://images.pexels.com/photos/5060943/pexels-photo-5060943.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["ELE", "ODEIA", "BEBER", "CHOCOLATE"],
    level: 2
  },
  {
    id: "sentence9",
    words: ["MEU", "AMIGO", "TEM", "UMA", "BICICLETA", "NOVA"],
    imageUrl: "https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["MINHA", "AMIGA", "VELHA", "CARRO", "BONITA"],
    level: 2
  },
  {
    id: "sentence10",
    words: ["A", "PROFESSORA", "ENSINA", "MATEMÁTICA", "NA", "ESCOLA"],
    imageUrl: "https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["PROFESSOR", "APRENDE", "PORTUGUÊS", "CASA", "UNIVERSIDADE"],
    level: 2
  },
  
  // Nível 3 - Avançado
  {
    id: "sentence11",
    words: ["OS", "PÁSSAROS", "CONSTROEM", "NINHOS", "NAS", "ÁRVORES", "ALTAS"],
    imageUrl: "https://images.pexels.com/photos/56618/nest-eurasian-magpie-bird-s-nest-nature-56618.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["AS", "MACACOS", "DESTROEM", "CASAS", "SOBRE", "FLORES", "BAIXAS"],
    level: 3
  },
  {
    id: "sentence12",
    words: ["QUANDO", "CHOVE", "MUITO", "O", "RIO", "TRANSBORDA", "RAPIDAMENTE"],
    imageUrl: "https://images.pexels.com/photos/5938412/pexels-photo-5938412.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["SE", "NEVA", "POUCO", "A", "LAGO", "SECA", "LENTAMENTE"],
    level: 3
  },
  {
    id: "sentence13",
    words: ["A", "MENINA", "DE", "VESTIDO", "VERMELHO", "DANÇA", "COM", "ALEGRIA"],
    imageUrl: "https://images.pexels.com/photos/8353570/pexels-photo-8353570.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["O", "MENINO", "DO", "CASACO", "AZUL", "CANTA", "SEM", "TRISTEZA"],
    level: 3
  },
  {
    id: "sentence14",
    words: ["OS", "ASTRONAUTAS", "VIAJAM", "PELO", "ESPAÇO", "EM", "GRANDES", "FOGUETES"],
    imageUrl: "https://images.pexels.com/photos/2152/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["AS", "PILOTOS", "ANDAM", "NO", "OCEANO", "COM", "PEQUENOS", "AVIÕES"],
    level: 3
  },
  {
    id: "sentence15",
    words: ["DURANTE", "O", "VERÃO", "GOSTAMOS", "DE", "NADAR", "NA", "PRAIA", "ENSOLARADA"],
    imageUrl: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["APÓS", "A", "INVERNO", "PREFERIMOS", "PARA", "ESQUIAR", "NO", "MONTANHA", "NUBLADA"],
    level: 3
  }
];

// Função para obter frases por nível
export const getSentencesByLevel = (level: number): SentenceData[] => {
  console.log(`getSentencesByLevel - Buscando frases para nível ${level}`);
  
  try {
    // Verificar se temos frases para este nível
    const sentencesForLevel = sentencesList.filter(sentence => sentence.level === level);
    
    console.log(`getSentencesByLevel - Encontradas ${sentencesForLevel.length} frases para nível ${level}`);
    
    // Log de debug para mostrar as frases encontradas
    if (sentencesForLevel.length > 0) {
      console.log('Frases encontradas:', sentencesForLevel.map(s => ({
        id: s.id,
        palavras: s.words.join(' '),
        nivel: s.level
      })));
    }
    
    return sentencesForLevel;
  } catch (error) {
    console.error(`Erro ao buscar frases para nível ${level}:`, error);
    return [];
  }
};

// Função para obter frase por ID
export const getSentenceById = (id: string): SentenceData | undefined => {
  return sentencesList.find(sentence => sentence.id === id);
};

// Função para criar um array de palavras para o jogo, incluindo distrações
export const getWordsForSentence = (sentenceData: SentenceData, includeDistractors: boolean = true): {id: string, text: string, used: boolean}[] => {
  // Começa com as palavras corretas
  const words = sentenceData.words.map((text, index) => ({
    id: `correct_${index}`,
    text,
    used: false
  }));
  
  // Adiciona distrações se solicitado e se existirem
  if (includeDistractors && sentenceData.distractors && sentenceData.distractors.length > 0) {
    const distractors = sentenceData.distractors.map((text, index) => ({
      id: `distractor_${index}`,
      text,
      used: false
    }));
    
    // Combinamos todas as palavras, mas usamos um seed baseado no ID da frase para manter consistência
    const combined = [...words, ...distractors];
    
    // Usar um método consistente de embaralhamento baseado no ID da frase
    // Isso garante que toda vez que a mesma frase for carregada, 
    // a ordem das palavras será a mesma
    const seed = sentenceData.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Fisher-Yates shuffle com seed
    const shuffled = [...combined];
    let currentIndex = shuffled.length;
    let randomIndex;
    
    // Usamos um gerador pseudo-aleatório determinístico
    const seededRandom = (max: number) => {
      const x = Math.sin(seed + currentIndex++) * 10000;
      return Math.floor((x - Math.floor(x)) * max);
    };
    
    // Embaralhamento de Fisher-Yates
    while (currentIndex !== 0) {
      randomIndex = seededRandom(currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    
    return shuffled;
  }
  
  // Se não houver distrações, ainda embaralhamos de forma consistente
  const seed = sentenceData.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...words];
  let currentIndex = shuffled.length;
  let randomIndex;
  
  const seededRandom = (max: number) => {
    const x = Math.sin(seed + currentIndex++) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  
  while (currentIndex !== 0) {
    randomIndex = seededRandom(currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  return shuffled;
};

// Função para criar as zonas de soltar para uma frase
export const getDropZonesForSentence = (sentenceData: SentenceData): {id: string, text: string | null}[] => {
  return sentenceData.words.map((_, index) => ({
    id: `drop_${index}`,
    text: null // Inicialmente vazio
  }));
}; 