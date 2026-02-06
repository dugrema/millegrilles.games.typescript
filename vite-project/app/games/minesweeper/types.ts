export type GameStatus = "idle" | "playing" | "paused" | "gameover" | "won";

export type Difficulty = "easy" | "medium" | "hard";

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  mine: boolean;
  value: number;
  revealed: boolean;
  flagged: boolean;
  hidden: boolean;
}

export interface Board {
  grid: Cell[][];
  rows: number;
  cols: number;
}

export interface MinesweeperState {
  grid: Cell[][];
  revealedCells: Position[];
  flaggedCells: Position[];
  mineCount: number;
  timer: number;
  gameStatus: GameStatus;
  isPaused: boolean;
  highScores: Record<Difficulty, number>;
  difficulty: Difficulty;
}

export interface MinesweeperContextType {
  state: MinesweeperState;
  startGame: () => void;
  revealCell: (x: number, y: number) => void;
  flagCell: (x: number, y: number) => void;
  toggleDifficulty: () => void;
  togglePause: () => void;
  restartGame: () => void;
}
