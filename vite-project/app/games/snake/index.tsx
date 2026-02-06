import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import type { Position } from "./types";

type GameStatus = "playing" | "paused" | "gameover";

interface SnakeGameContextType {
  status: GameStatus;
  score: number;
  arenaSize: number;
  snake: Position[];
  direction: Position;
  food: Position | null;
  gameOver: boolean;
  gameWon: boolean;
  addScore: (points: number) => void;
  setDirection: (dir: Position) => void;
  togglePause: () => void;
  resetGame: () => void;
}

const SnakeGameContext = createContext<SnakeGameContextType | null>(null);

export function SnakeGameProvider({ children }: { children: React.ReactNode }) {
  // State
  const [status, setStatus] = useState<GameStatus>("playing");
  const [score, setScore] = useState(0);
  const arenaSize = 20;
  const [snake, setSnake] = useState<Position[]>([]);
  const [direction, setDirectionState] = useState<Position>({ x: 1, y: 0 });
  const [food, setFood] = useState<Position | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Refs for stable values
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const directionQueue = useRef<Position[]>([]);
  const snakeRef = useRef<Position[]>(snake);
  const directionRef = useRef<Position>(direction);
  const foodRef = useRef<Position | null>(food);
  const statusRef = useRef<GameStatus>(status);
  const gameOverRef = useRef<boolean>(gameOver);
  // Track if we just ate in the last tick
  const justEatenRef = useRef(false);

  // Sync refs when state changes
  useEffect(() => {
    snakeRef.current = snake;
    directionRef.current = direction;
    foodRef.current = food;
    statusRef.current = status;
    gameOverRef.current = gameOver;
  }, [snake, direction, food, status, gameOver]);

  // Random food placement with 1‑cell margin
  const placeFood = useCallback(
    (snakePositions: Position[]) => {
      const maxAttempts = 100;
      let attempts = 0;
      let newFood: Position;
      do {
        newFood = {
          x: Math.floor(Math.random() * (arenaSize - 2)) + 1,
          y: Math.floor(Math.random() * (arenaSize - 2)) + 1,
        };
        attempts++;
      } while (
        snakePositions.some(
          (pos) => pos.x === newFood.x && pos.y === newFood.y,
        ) &&
        attempts < maxAttempts
      );
      setFood(newFood);
    },
    [arenaSize],
  );

  // Start or restart the game
  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setStatus("playing");
    const initialSnake: Position[] = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(initialSnake);
    setDirectionState({ x: 1, y: 0 });
    placeFood(initialSnake);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateGame, 150);
  }, [placeFood]);

  // Main loop
  const updateGame = useCallback(() => {
    if (statusRef.current !== "playing" || gameOverRef.current) return;
    const currentSnake = snakeRef.current;
    if (currentSnake.length === 0) return;

    // Process queued direction changes
    while (directionQueue.current.length > 0) {
      const nextDir = directionQueue.current.shift()!;
      const curDir = directionRef.current;
      if (nextDir.x !== -curDir.x || nextDir.y !== -curDir.y) {
        setDirectionState(nextDir);
      }
    }

    const head = currentSnake[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y,
    };

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= arenaSize ||
      newHead.y < 0 ||
      newHead.y >= arenaSize
    ) {
      setGameOver(true);
      return;
    }

    // Self collision
    if (
      currentSnake.some((pos) => pos.x === newHead.x && pos.y === newHead.y)
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...currentSnake];
    let ateFood = false;
    const currentFood = foodRef.current;
    if (
      currentFood &&
      newHead.x === currentFood.x &&
      newHead.y === currentFood.y
    ) {
      ateFood = true;
      setScore((prev) => prev + 10);
      placeFood(newSnake);
    }

    // Determine final snake: grow if ate, otherwise drop last segment
    const finalSnake = ateFood
      ? newSnake
      : newSnake.slice(0, newSnake.length - 1);
    setSnake(finalSnake);
    justEatenRef.current = ateFood;
  }, [placeFood]);

  // Score helper
  const addScore = useCallback(
    (points: number) => setScore((s) => s + points),
    [],
  );

  // Direction queue helper
  const enqueueDirectionChange = useCallback((newDir: Position) => {
    const curDir = directionRef.current;
    if (newDir.x !== -curDir.x || newDir.y !== -curDir.y) {
      directionQueue.current.push(newDir);
    }
  }, []);

  // Reset
  const resetGame = useCallback(() => {
    setGameOver(false);
    setGameWon(false);
    setStatus("paused");
    startGame();
  }, [startGame]);

  // Pause toggle
  const togglePause = useCallback(() => {
    if (gameOver || gameWon) {
      resetGame();
      return;
    }
    const newStatus = status === "playing" ? "paused" : "playing";
    setStatus(newStatus);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (newStatus === "playing") {
      intervalRef.current = setInterval(updateGame, 150);
    }
  }, [status, gameOver, gameWon, resetGame, updateGame]);

  // Mount effect
  useEffect(() => {
    startGame();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startGame]);

  const value: SnakeGameContextType = {
    status,
    score,
    arenaSize,
    snake,
    direction,
    food,
    gameOver,
    gameWon,
    addScore,
    setDirection: enqueueDirectionChange,
    togglePause,
    resetGame,
  };

  return (
    <SnakeGameContext.Provider value={value}>
      {children}
    </SnakeGameContext.Provider>
  );
}

export function useSnakeGame() {
  const ctx = useContext(SnakeGameContext);
  if (!ctx) {
    throw new Error("useSnakeGame must be used within SnakeGameProvider");
  }
  return ctx;
}

export default SnakeGameProvider;
