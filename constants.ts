import { Theme, WordPair } from './types';

export const DEFAULT_PLAYERS = [
  { id: '1', name: 'Jogador 1' },
  { id: '2', name: 'Jogador 2' },
  { id: '3', name: 'Jogador 3' },
];

export const THEMES: Theme[] = [
  'ALEATÓRIO',
  'COMIDA',
  'ANIMAIS',
  'PAÍSES',
  'ESPORTES',
  'JOGOS',
  'FILMES',
  'MÚSICA',
  'OBJETOS',
  'TRANSPORTES',
];

// Offline database of related words
export const WORD_DATABASE: Record<Exclude<Theme, 'ALEATÓRIO'>, WordPair[]> = {
  COMIDA: [
    { civilian: 'Hambúrguer', impostor: 'Sanduíche' },
    { civilian: 'Pizza', impostor: 'Lasanha' },
    { civilian: 'Sushi', impostor: 'Sashimi' },
    { civilian: 'Brigadeiro', impostor: 'Beijinho' },
    { civilian: 'Café', impostor: 'Chá' },
    { civilian: 'Coxinha', impostor: 'Empada' },
    { civilian: 'Sorvete', impostor: 'Açaí' },
    { civilian: 'Macarrão', impostor: 'Nhoque' },
  ],
  ANIMAIS: [
    { civilian: 'Cachorro', impostor: 'Lobo' },
    { civilian: 'Gato', impostor: 'Tigre' },
    { civilian: 'Cavalo', impostor: 'Zebra' },
    { civilian: 'Golfinho', impostor: 'Tubarão' },
    { civilian: 'Águia', impostor: 'Falcão' },
    { civilian: 'Jacaré', impostor: 'Crocodilo' },
    { civilian: 'Abelha', impostor: 'Vespa' },
  ],
  PAÍSES: [
    { civilian: 'Brasil', impostor: 'Portugal' },
    { civilian: 'China', impostor: 'Japão' },
    { civilian: 'EUA', impostor: 'Canadá' },
    { civilian: 'Argentina', impostor: 'Uruguai' },
    { civilian: 'França', impostor: 'Itália' },
    { civilian: 'Espanha', impostor: 'México' },
  ],
  ESPORTES: [
    { civilian: 'Futebol', impostor: 'Futsal' },
    { civilian: 'Tênis', impostor: 'Ping-Pong' },
    { civilian: 'Vôlei', impostor: 'Futevôlei' },
    { civilian: 'Natação', impostor: 'Hidroginástica' },
    { civilian: 'Basquete', impostor: 'Handebol' },
    { civilian: 'Boxe', impostor: 'MMA' },
  ],
  JOGOS: [
    { civilian: 'Xadrez', impostor: 'Dama' },
    { civilian: 'Poker', impostor: 'Truco' },
    { civilian: 'Minecraft', impostor: 'Roblox' },
    { civilian: 'Fortnite', impostor: 'Free Fire' },
    { civilian: 'Mario', impostor: 'Sonic' },
  ],
  FILMES: [
    { civilian: 'Vingadores', impostor: 'Liga da Justiça' },
    { civilian: 'Star Wars', impostor: 'Star Trek' },
    { civilian: 'Harry Potter', impostor: 'Senhor dos Anéis' },
    { civilian: 'Barbie', impostor: 'Polly' },
    { civilian: 'Titanic', impostor: 'Avatar' },
  ],
  MÚSICA: [
    { civilian: 'Rock', impostor: 'Metal' },
    { civilian: 'Samba', impostor: 'Pagode' },
    { civilian: 'Funk', impostor: 'Rap' },
    { civilian: 'Violão', impostor: 'Guitarra' },
    { civilian: 'Piano', impostor: 'Teclado' },
  ],
  OBJETOS: [
    { civilian: 'Garfo', impostor: 'Colher' },
    { civilian: 'Copo', impostor: 'Taça' },
    { civilian: 'Cadeira', impostor: 'Banco' },
    { civilian: 'Lápis', impostor: 'Caneta' },
    { civilian: 'Notebook', impostor: 'Tablet' },
    { civilian: 'Mesa', impostor: 'Escrivaninha' },
  ],
  TRANSPORTES: [
    { civilian: 'Carro', impostor: 'Caminhonete' },
    { civilian: 'Ônibus', impostor: 'Trem' },
    { civilian: 'Moto', impostor: 'Bicicleta' },
    { civilian: 'Avião', impostor: 'Helicóptero' },
    { civilian: 'Barco', impostor: 'Lancha' },
  ],
};