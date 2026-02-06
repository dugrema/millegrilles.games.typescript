import {
  createContext,
  useReducer,
  useEffect,
  type Dispatch,
  type ReactNode,
} from "react";

/**
 * Basic types
 */
export type Cell = number; //0 = empty, >0 = block id / color index
export type Grid = Cell[][]; //20 rows × 10 columns

/**
 * Tetromino shape definitions (4×4 grid). Using 0 for empty, 1 for filled.
 */
const SHAPES: Record<number, number[]> = {
  0: Array(16).fill(0), // placeholder
  1: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  7: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

/**
 * Helper: rotate 4x4 matrix
 */
function rotateShape(shape: number[]): number[] {
  const rotated = Array(16).fill(0);
  for (let i = 0; i < 16; i++) {
    const x = i % 4;
    const y = Math.floor(i / 4);
    rotated[x * 4 + (3 - y)] = shape[i];
  }
  return rotated;
}

/**
 * Piece interface
 */
export interface Piece {
  type: number; //1-7 corresponds to SHAPES
  shape: number[]; //flattened 4x4
  rotation: number; //0-3 rotation index
  x: number; //column of the top-left corner of the 4x4 matrix
  y: number; //row of the top-left corner
}

/**
 * Game state
 */
export interface State {
  grid: Grid;
  piece: Piece | null;
  nextPiece: Piece;
  score: number;
  level: number;
  linesCleared: number;
  highScore: number;
  gameOver: boolean;
  isPaused: boolean; //new
}

/**
 * Actions
 */
export type Action =
  | { type: "SPAWN_PIECE"; payload: { piece: Piece; nextPiece: Piece } }
  | { type: "MOVE"; payload: { dx: number; dy: number } }
  | { type: "ROTATE" }
  | { type: "LOCK" }
  | { type: "CLEAR_LINES"; payload: { rows: number[] } }
  | { type: "TICK" }
  | { type: "SET_HIGH_SCORE"; payload: number }
  | { type: "HARD_DROP" }
  | { type: "GAME_OVER" }
  | { type: "RESET" }
  | { type: "PAUSE" }
  | { type: "RESUME" };

/**
 * Create a random piece
 */
function randomPiece(): Piece {
  const type = Math.floor(Math.random() * 7) + 1;
  return {
    type,
    shape: SHAPES[type],
    rotation: 0,
    x: 3,
    y: 0,
  };
}

/**
 * Grid helpers
 */
const GRID_ROWS = 20;
const GRID_COLS = 10;

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
}

/**
 * Collision detection
 */
function canMove(state: State, piece: Piece): boolean {
  const { shape, x, y } = piece;
  for (let i = 0; i < 16; i++) {
    if (!shape[i]) continue;
    const col = x + (i % 4);
    const row = y + Math.floor(i / 4);
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
      return false;
    }
    if (state.grid[row][col] !== 0) {
      return false;
    }
  }
  return true;
}

/**
 * Merge piece into grid (lock)
 */
function lockPiece(state: State, piece: Piece): Grid {
  const newGrid = state.grid.map((row) => row.slice());
  for (let i = 0; i < 16; i++) {
    if (!piece.shape[i]) continue;
    const col = piece.x + (i % 4);
    const row = piece.y + Math.floor(i / 4);
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      newGrid[row][col] = piece.type;
    }
  }
  return newGrid;
}

/**
 * Line clearing
 */
function clearLines(grid: Grid): { newGrid: Grid; cleared: number } {
  const newGrid: Grid = [];
  let cleared = 0;
  for (let row = GRID_ROWS - 1; row >= 0; row--) {
    if (grid[row].every((cell) => cell !== 0)) {
      cleared++;
      continue;
    }
    newGrid.unshift(grid[row]);
  }
  while (newGrid.length < GRID_ROWS) {
    newGrid.unshift(Array(GRID_COLS).fill(0));
  }
  return { newGrid, cleared };
}

/**
 * Reducer
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SPAWN_PIECE":
      return {
        ...state,
        piece: action.payload.piece,
        nextPiece: action.payload.nextPiece,
      };

    case "MOVE": {
      if (!state.piece) return state;
      const moved = {
        ...state.piece,
        x: state.piece.x + action.payload.dx,
        y: state.piece.y + action.payload.dy,
      };
      return canMove(state, moved) ? { ...state, piece: moved } : state;
    }

    case "ROTATE": {
      if (!state.piece) return state;
      const rotatedShape = rotateShape(state.piece.shape);
      const rotatedPiece: Piece = {
        ...state.piece,
        shape: rotatedShape,
        rotation: (state.piece.rotation + 1) % 4,
      };
      return canMove(state, rotatedPiece)
        ? { ...state, piece: rotatedPiece }
        : state;
    }

    case "LOCK":
    case "HARD_DROP": {
      if (!state.piece) return state;
      const activePiece =
        action.type === "HARD_DROP"
          ? (() => {
              let y = state.piece.y;
              while (canMove(state, { ...state.piece, y: y + 1 })) {
                y++;
              }
              return { ...state.piece, y };
            })()
          : state.piece;

      const lockedGrid = lockPiece(state, activePiece);
      const { newGrid, cleared } = clearLines(lockedGrid);
      const newScore = state.score + cleared * 100;
      const newLevel = Math.floor(state.linesCleared / 10) + 1;
      const newHighScore = Math.max(newScore, state.highScore);
      const newLines = state.linesCleared + cleared;

      const tempState: State = {
        ...state,
        grid: newGrid,
        score: newScore,
        level: newLevel,
        linesCleared: newLines,
        highScore: newHighScore,
        piece: null,
        gameOver: false,
        isPaused: false,
      };

      if (!canMove(tempState, state.nextPiece)) {
        return {
          ...tempState,
          gameOver: true,
          piece: null,
        };
      }

      return {
        ...tempState,
        piece: state.nextPiece,
        nextPiece: randomPiece(),
      };
    }

    case "TICK":
      if (!state.piece || state.isPaused) return state;
      const moved = { ...state.piece, y: state.piece.y + 1 };
      return canMove(state, moved)
        ? { ...state, piece: moved }
        : reducer(state, { type: "LOCK" });

    case "SET_HIGH_SCORE":
      return { ...state, highScore: action.payload };

    case "GAME_OVER":
      return { ...state, gameOver: true };

    case "RESET":
      return {
        grid: createEmptyGrid(),
        piece: null,
        nextPiece: randomPiece(),
        score: 0,
        level: 1,
        linesCleared: 0,
        highScore: state.highScore,
        gameOver: false,
        isPaused: false,
      };

    case "PAUSE":
      return { ...state, isPaused: true };

    case "RESUME":
      return { ...state, isPaused: false };

    default:
      return state;
  }
}

/**
 * Context
 */
export const GameContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: {
    grid: createEmptyGrid(),
    piece: null,
    nextPiece: randomPiece(),
    score: 0,
    level: 1,
    linesCleared: 0,
    highScore: 0,
    gameOver: false,
    isPaused: false,
  },
  dispatch: () => {},
});

/**
 * Provider
 */
export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    grid: createEmptyGrid(),
    piece: null,
    nextPiece: randomPiece(),
    score: 0,
    level: 1,
    linesCleared: 0,
    highScore: 0,
    gameOver: false,
    isPaused: false,
  });

  /**
   * Load high score
   */
  useEffect(() => {
    const stored = localStorage.getItem("tetris-high-score");
    if (stored)
      dispatch({ type: "SET_HIGH_SCORE", payload: parseInt(stored, 10) });
  }, []);

  /**
   * Persist high score
   */
  useEffect(() => {
    localStorage.setItem("tetris-high-score", state.highScore.toString());
  }, [state.highScore]);

  /**
   * Periodic tick
   */
  useEffect(() => {
    if (state.gameOver || state.isPaused) return;
    const interval = setInterval(
      () => {
        dispatch({ type: "TICK" });
      },
      Math.max(100, 800 - (state.level - 1) * 50),
    );
    return () => clearInterval(interval);
  }, [state.level, state.gameOver, state.isPaused]);

  /**
   * Spawn first piece on init
   */
  useEffect(() => {
    if (!state.piece && !state.gameOver) {
      const next = randomPiece();
      dispatch({
        type: "SPAWN_PIECE",
        payload: { piece: next, nextPiece: randomPiece() },
      });
    }
  }, [state.piece, state.gameOver]);

  /**
   * Keyboard input handling
   */
  useEffect(() => {
    if (state.gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle pause with 'p' regardless of piece presence
      if (e.key.toLowerCase() === "p") {
        dispatch(state.isPaused ? { type: "RESUME" } : { type: "PAUSE" });
        return;
      }

      if (state.isPaused) return;

      if (!state.piece) return;

      switch (e.key) {
        case "ArrowLeft":
          dispatch({ type: "MOVE", payload: { dx: -1, dy: 0 } });
          break;
        case "ArrowRight":
          dispatch({ type: "MOVE", payload: { dx: 1, dy: 0 } });
          break;
        case "ArrowDown":
          dispatch({ type: "MOVE", payload: { dx: 0, dy: 1 } });
          break;
        case "ArrowUp":
          dispatch({ type: "ROTATE" });
          break;
        case " ":
        case "Spacebar":
          dispatch({ type: "HARD_DROP" });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, state.piece, state.gameOver, state.isPaused]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
