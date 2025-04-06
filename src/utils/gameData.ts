/**
 * Dados do jogo: palavras, níveis e modos de jogo
 */

export interface WordData {
  id: string;
  word: string;
  syllables: string[];
  imageUrl: string;
  audio?: string;
  distractors?: string[]; // Sílabas adicionais para aumentar a dificuldade
  level: number; // Nível de dificuldade da palavra
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  wordsToComplete: number; // Número de palavras para completar o nível
  maxDistractors: number; // Número máximo de sílabas distrativas
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

// Definição dos níveis
export const levels: LevelData[] = [
  {
    id: 1,
    name: "Nível Iniciante",
    description: "Palavras simples com 2-3 sílabas",
    wordsToComplete: 5,
    maxDistractors: 2
  },
  {
    id: 2,
    name: "Nível Intermediário",
    description: "Palavras com 3-4 sílabas",
    wordsToComplete: 8,
    maxDistractors: 4
  },
  {
    id: 3,
    name: "Nível Avançado",
    description: "Palavras mais complexas com 4+ sílabas",
    wordsToComplete: 10,
    maxDistractors: 6
  }
];

// Definição dos modos de jogo
export const gameModes: GameMode[] = [
  {
    id: "complete-word",
    name: "Complete a Palavra",
    description: "Arraste as sílabas para formar a palavra correta",
    instructions: "Observe a imagem e complete a palavra arrastando as sílabas"
  },
  {
    id: "form-sentence",
    name: "Forme a Frase",
    description: "Organize as palavras para formar uma frase simples",
    instructions: "Arraste as palavras para formar uma frase que descreva a imagem"
  },
  {
    id: "missing-letter",
    name: "Encontre a Letra",
    description: "Complete a palavra com as letras que faltam",
    instructions: "Arraste as letras para os espaços em branco e complete a palavra"
  }
];

// Banco de palavras
export const wordsList: WordData[] = [
  {
    id: "word1",
    word: "BANANA",
    syllables: ["BA", "NA", "NA"],
    imageUrl: "https://images.pexels.com/photos/1166648/pexels-photo-1166648.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["CA", "MA", "PA"],
    level: 1
  },
  {
    id: "word2",
    word: "ABACAXI",
    syllables: ["A", "BA", "CA", "XI"],
    imageUrl: "https://images.pexels.com/photos/2469772/pexels-photo-2469772.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["PI", "TE", "LO"],
    level: 1
  },
  {
    id: "word3",
    word: "BOLA",
    syllables: ["BO", "LA"],
    imageUrl: "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["CA", "SA"],
    level: 1
  },
  {
    id: "word4",
    word: "CASA",
    syllables: ["CA", "SA"],
    imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["ME", "TA"],
    level: 1
  },
  {
    id: "word5",
    word: "CACHORRO",
    syllables: ["CA", "CHOR", "RO"],
    imageUrl: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["GA", "TO", "PA", "TO"],
    level: 2
  },
  {
    id: "word6",
    word: "BORBOLETA",
    syllables: ["BOR", "BO", "LE", "TA"],
    imageUrl: "https://images.pexels.com/photos/672142/pexels-photo-672142.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["FLO", "RES", "A", "BE", "LHA"],
    level: 2
  },
  {
    id: "word7",
    word: "ELEFANTE",
    syllables: ["E", "LE", "FAN", "TE"],
    imageUrl: "https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["GI", "RA", "FA", "LE", "ÃO"],
    level: 2
  },
  {
    id: "word8",
    word: "COMPUTADOR",
    syllables: ["COM", "PU", "TA", "DOR"],
    imageUrl: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["TE", "LE", "FO", "NE", "MO", "NI", "TOR"],
    level: 3
  },
  {
    id: "word9",
    word: "CHOCOLATE",
    syllables: ["CHO", "CO", "LA", "TE"],
    imageUrl: "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["BO", "LA", "CHA", "DO", "CE"],
    level: 3
  },
  {
    id: "word10",
    word: "DINOSSAURO",
    syllables: ["DI", "NOS", "SAU", "RO"],
    imageUrl: "https://images.pexels.com/photos/67112/pexels-photo-67112.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["A", "NI", "MAL", "PRÉ", "HIS", "TÓ", "RI", "CO"],
    level: 3
  }
];

// Função para obter palavras por nível
export const getWordsByLevel = (level: number): WordData[] => {
  return wordsList.filter(word => word.level === level);
};

// Função para obter palavra por ID
export const getWordById = (id: string): WordData | undefined => {
  return wordsList.find(word => word.id === id);
};

// Função para obter detalhes do nível
export const getLevelDetails = (levelId: number): LevelData | undefined => {
  return levels.find(level => level.id === levelId);
};

// Função para criar um array de sílabas para o jogo, incluindo distrações
export const getSyllablesForWord = (wordData: WordData, includeDistractors: boolean = true): {id: string, text: string, used: boolean}[] => {
  // Começa com as sílabas corretas
  const syllables = wordData.syllables.map((text, index) => ({
    id: `correct_${index}`,
    text,
    used: false
  }));
  
  // Adiciona distrações se solicitado e se existirem
  if (includeDistractors && wordData.distractors && wordData.distractors.length > 0) {
    const distractors = wordData.distractors.map((text, index) => ({
      id: `distractor_${index}`,
      text,
      used: false
    }));
    
    return [...syllables, ...distractors].sort(() => Math.random() - 0.5); // Embaralha as sílabas
  }
  
  return syllables.sort(() => Math.random() - 0.5); // Embaralha as sílabas
};

// Função para criar as zonas de soltar para uma palavra
export const getDropZonesForWord = (wordData: WordData): {id: string, text: string | null}[] => {
  return wordData.syllables.map((_, index) => ({
    id: `zone${index + 1}`,
    text: null
  }));
}; 