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
  // Nível 1 - Iniciante
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
    id: "word11",
    word: "PATO",
    syllables: ["PA", "TO"],
    imageUrl: "https://images.pexels.com/photos/660266/pexels-photo-660266.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["GA", "LO"],
    level: 1
  },
  {
    id: "word12",
    word: "SAPO",
    syllables: ["SA", "PO"],
    imageUrl: "https://images.pexels.com/photos/674318/pexels-photo-674318.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["PE", "LO"],
    level: 1
  },
  {
    id: "word13",
    word: "MACACO",
    syllables: ["MA", "CA", "CO"],
    imageUrl: "/images/macaco.svg",
    distractors: ["BI", "CHO"],
    level: 1
  },
  {
    id: "word14",
    word: "LEITE",
    syllables: ["LEI", "TE"],
    imageUrl: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["QUE", "JO"],
    level: 1
  },
  {
    id: "word15",
    word: "TOMATE",
    syllables: ["TO", "MA", "TE"],
    imageUrl: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["SA", "LA", "DA"],
    level: 1
  },
  {
    id: "word16",
    word: "PICOLÉ",
    syllables: ["PI", "CO", "LÉ"],
    imageUrl: "/images/picole.svg",
    distractors: ["SO", "VE", "TE"],
    level: 1
  },
  
  // Nível 2 - Intermediário
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
    id: "word17",
    word: "TELEFONE",
    syllables: ["TE", "LE", "FO", "NE"],
    imageUrl: "https://images.pexels.com/photos/163007/phone-old-year-built-1955-bakelite-163007.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["CE", "LU", "LAR", "DIS", "CAR"],
    level: 2
  },
  {
    id: "word18",
    word: "BICICLETA",
    syllables: ["BI", "CI", "CLE", "TA"],
    imageUrl: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["MO", "TO", "CI", "LE", "DA"],
    level: 2
  },
  {
    id: "word19",
    word: "CARROSSEL",
    syllables: ["CAR", "ROS", "SEL"],
    imageUrl: "/images/carrossel.svg",
    distractors: ["PAR", "QUE", "DI", "VER", "SÃO"],
    level: 2
  },
  {
    id: "word20",
    word: "TARTARUGA",
    syllables: ["TAR", "TA", "RU", "GA"],
    imageUrl: "https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["A", "NI", "MAL", "LEN", "TO"],
    level: 2
  },
  {
    id: "word21",
    word: "MORANGO",
    syllables: ["MO", "RAN", "GO"],
    imageUrl: "https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["FRU", "TA", "DO", "CE"],
    level: 2
  },
  {
    id: "word22",
    word: "FOGUETE",
    syllables: ["FO", "GUE", "TE"],
    imageUrl: "https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["A", "VI", "ÃO", "ES", "PA", "ÇO"],
    level: 2
  },
  
  // Nível 3 - Avançado
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
    imageUrl: "/images/dinossauro.svg",
    distractors: ["A", "NI", "MAL", "PRÉ", "HIS", "TÓ", "RI", "CO"],
    level: 3
  },
  {
    id: "word23",
    word: "HELICÓPTERO",
    syllables: ["HE", "LI", "CÓP", "TE", "RO"],
    imageUrl: "https://images.pexels.com/photos/12569903/pexels-photo-12569903.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["A", "VI", "ÃO", "VO", "AR", "PI", "LO", "TO"],
    level: 3
  },
  {
    id: "word24",
    word: "BIBLIOTECA",
    syllables: ["BI", "BLI", "O", "TE", "CA"],
    imageUrl: "https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["LI", "VRO", "ES", "TU", "DO", "LER", "SA", "LA"],
    level: 3
  },
  {
    id: "word25",
    word: "BORBOLETA",
    syllables: ["BOR", "BO", "LE", "TA"],
    imageUrl: "https://images.pexels.com/photos/1488507/pexels-photo-1488507.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["IN", "SE", "TO", "VO", "AR", "CO", "LO", "RI", "DO"],
    level: 3
  },
  {
    id: "word26",
    word: "ESPANTALHO",
    syllables: ["ES", "PAN", "TA", "LHO"],
    imageUrl: "https://images.pexels.com/photos/14815069/pexels-photo-14815069.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["FA", "ZEN", "DA", "PÁS", "SA", "RO", "MI", "LHO"],
    level: 3
  },
  {
    id: "word27",
    word: "CALENDÁRIO",
    syllables: ["CA", "LEN", "DÁ", "RIO"],
    imageUrl: "https://images.pexels.com/photos/273153/pexels-photo-273153.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["DA", "TA", "DI", "A", "ME", "SES", "HO", "RAS"],
    level: 3
  },
  {
    id: "word28",
    word: "ASTRONAUTA",
    syllables: ["AS", "TRO", "NAU", "TA"],
    imageUrl: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["ES", "PA", "ÇO", "FO", "GUE", "TE", "LU", "A"],
    level: 3
  },
  {
    id: "word29",
    word: "GIRASSOL",
    syllables: ["GI", "RAS", "SOL"],
    imageUrl: "https://images.pexels.com/photos/46216/sunflower-flowers-bright-yellow-46216.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["FLOR", "A", "MA", "RE", "LO", "CAM", "PO"],
    level: 3
  },
  {
    id: "word30",
    word: "ABACATE",
    syllables: ["A", "BA", "CA", "TE"],
    imageUrl: "https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=600",
    distractors: ["FRU", "TA", "VER", "DE", "SA", "LA", "DA"],
    level: 3
  }
];

/**
 * Retorna as palavras disponíveis para o nível especificado
 * @param levelId O ID do nível para filtrar as palavras
 * @param disabledWords Array opcional com IDs de palavras desabilitadas
 * @returns Array de palavras filtradas pelo nível
 */
export const getWordsByLevel = (levelId: number, disabledWords: string[] = []): WordData[] => {
  // Filtrar pelo nível e remover palavras desabilitadas
  return wordsList.filter(word => 
    word.level === levelId && 
    !disabledWords.includes(word.id)
  );
};

// Função para obter palavra por ID
export const getWordById = (id: string): WordData | undefined => {
  return wordsList.find(word => word.id === id);
};

// Função para obter detalhes do nível
export const getLevelDetails = (levelId: number): LevelData | undefined => {
  return levels.find(level => level.id === levelId);
};

/**
 * Função para embaralhar um array usando o algoritmo Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Função para obter sílabas a partir de uma palavra
export function getSyllablesForWord(word: WordData, shuffle: boolean = false): { id: string; text: string; used: boolean }[] {
  let syllables = [...word.syllables];
  
  // Adicionar sílabas distrativas (distractors)
  if (word.distractors && word.distractors.length > 0) {
    syllables = [...syllables, ...word.distractors];
  }

  // Transformar em objetos
  let result = syllables.map((syllable, index) => ({
    id: `syllable-${word.id}-${index}`,
    text: syllable,
    used: false
  }));

  // Embaralhar se necessário
  if (shuffle) {
    result = shuffleArray(result);
  }

  return result;
}

// Função para obter zonas de soltar para uma palavra
export function getDropZonesForWord(word: WordData): { id: string; text: string | null }[] {
  return word.syllables.map((_, index) => ({
    id: `dropzone-${word.id}-${index}`,
    text: null
  }));
} 