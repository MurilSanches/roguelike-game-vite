import { GameState, Position } from '../types/game';
import { create } from 'zustand';

// Criação do Zustand Store
export const useGameStore = create<GameState>((set) => ({
  playerPosition: { x: 64, y: 64 },
  items: [],
  setPlayerPosition: (x: number, y: number) => set({ playerPosition: { x, y } }),
  setItems: (items: Position[]) => set({ items }),
}));

