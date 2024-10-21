interface Position {
  x: number;
  y: number;
}
  
interface GameState {
  playerPosition: Position;
  items: Position[];
  setPlayerPosition: (x: number, y: number) => void
  setItems: (items: Position[]) => void
}

export type { GameState, Position }