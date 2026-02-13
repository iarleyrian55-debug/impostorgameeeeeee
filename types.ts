export type GameStage = 
  | 'MENU' 
  | 'SETUP' 
  | 'SETTINGS' 
  | 'PASSING' 
  | 'REVEALING' 
  | 'DISCUSSION' 
  | 'RESULTS';

export type WordMode = 'CLASSIC' | 'RELATED';

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  word: string;
}

export type Theme = 
  | 'ALEATÓRIO'
  | 'COMIDA'
  | 'ANIMAIS'
  | 'PAÍSES'
  | 'ESPORTES'
  | 'JOGOS'
  | 'FILMES'
  | 'MÚSICA'
  | 'OBJETOS'
  | 'TRANSPORTES';

export interface WordPair {
  civilian: string;
  impostor: string;
}

export interface GameSettings {
  impostorCount: number;
  wordMode: WordMode;
  theme: Theme;
  viewTimeSeconds: number;
  soundEnabled: boolean;
}