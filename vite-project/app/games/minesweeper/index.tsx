import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import type {
  MinesweeperState,
  MinesweeperContextType,
  Difficulty,
  GameStatus,
  Cell,
  Position,
} from "./types";
import { DIFFICULTIES, STORAGE_KEYS } from "./constants";

interface MinesweeperGameProviderProps {
  children: React.ReactNode;
}

// Audio contexts for sound effects
class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return this.audioContext;
  }

  playTone(frequency: number, duration: number, type: OscillatorType = "sine") {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration,
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  playFirstClick() {
    this.playTone(440, 0.1, "sine");
  }

  playRevealEmpty() {
    this.playTone(523.25, 0.15, "sine"); // C5
    setTimeout(() => this.playTone(659.25, 0.15, "sine"), 50); // E5
  }

  playRevealNumber() {
    this.playTone(330, 0.1, "sine"); // E4
  }

  playFlag() {
    this.playTone(880, 0.08, "square");
  }

  playUnflag() {
    this.playTone(440, 0.08, "square");
  }

  playGameOver() {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const frequencies = [392, 349, 330, 294];
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, "sawtooth"), i * 100);
    });
  }

  playWin() {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const frequencies = [523.25, 659.25, 783.99, 1046.5];
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "triangle"), i * 100);
    });
  }
}

const soundManager = new SoundManager();

const MinesweeperContext = createContext<MinesweeperContextType | null>(null);

export function MinesweeperGameProvider({
  children,
}: MinesweeperGameProviderProps) {
  const [difficulty, setDifficultyState] = useState<Difficulty>("easy");
  const [isPaused, setIsPaused] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [mineCount, setMineCount] = useState(-1);
  const [timer, setTimer] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [revealedCells, setRevealedCells] = useState<Position[]>([]);
  const [flaggedCells, setFlaggedCells] = useState<Position[]>([]);
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartedRef = useRef(false);
  const [isGridGenerated, setIsGridGenerated] = useState(false);

  useEffect(() => {
    const savedHighScores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    const savedDifficulty = localStorage.getItem(
      STORAGE_KEYS.PREFERRED_DIFFICULTY,
    );

    if (savedHighScores) {
      try {
        setHighScores(JSON.parse(savedHighScores));
      } catch (e) {
        console.error("Failed to parse high scores", e);
      }
    }

    if (
      savedDifficulty &&
      ["easy", "medium", "hard"].includes(savedDifficulty)
    ) {
      setDifficultyState(savedDifficulty as Difficulty);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(highScores));
  }, [highScores]);

  const loadDifficulty = useCallback((newDifficulty: Difficulty) => {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_DIFFICULTY, newDifficulty);
    setDifficultyState(newDifficulty);
  }, []);

  const generateSafeGrid = useCallback(
    (firstClickPos: Position | null) => {
      const config = DIFFICULTIES[difficulty];
      const newGrid: Cell[][] = [];
      const mines: Position[] = [];

      for (let row = 0; row < config.rows; row++) {
        const rowArray: Cell[] = [];
        for (let col = 0; col < config.cols; col++) {
          rowArray.push({
            x: col,
            y: row,
            mine: false,
            value: 0,
            revealed: false,
            flagged: false,
            hidden: true,
          });
        }
        newGrid.push(rowArray);
      }

      const safePositions = firstClickPos
        ? Array.from({ length: config.rows * config.cols }, (_, i) => i).filter(
            (i) => {
              const pos: Position = {
                x: i % config.cols,
                y: Math.floor(i / config.cols),
              };
              return !(pos.x === firstClickPos.x && pos.y === firstClickPos.y);
            },
          )
        : [];

      let minesPlaced = 0;
      while (minesPlaced < config.mines && safePositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * safePositions.length);
        const index = safePositions.splice(randomIndex, 1)[0];
        const pos = {
          x: index % config.cols,
          y: Math.floor(index / config.rows),
        };
        mines.push(pos);
        newGrid[pos.y][pos.x].mine = true;
        minesPlaced++;
      }

      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          if (!newGrid[row][col].mine) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (
                  newRow >= 0 &&
                  newRow < config.rows &&
                  newCol >= 0 &&
                  newCol < config.cols
                ) {
                  if (newGrid[newRow][newCol].mine) {
                    count++;
                  }
                }
              }
            }
            newGrid[row][col].value = count;
          }
        }
      }

      return newGrid;
    },
    [difficulty],
  );

  const floodFill = useCallback(
    (
      grid: Cell[][],
      x: number,
      y: number,
      newRevealed: Position[],
    ): Cell[][] => {
      const config = DIFFICULTIES[difficulty];

      if (x < 0 || x >= config.cols || y < 0 || y >= config.rows) {
        return grid;
      }

      const cell = grid[y][x];
      if (cell.revealed || cell.flagged) {
        return grid;
      }

      let newGrid = grid.map((row) => [...row]);
      newGrid[y][x] = {
        ...cell,
        revealed: true,
        hidden: false,
      };

      if (cell.value > 0) {
        return newGrid;
      }

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          newGrid = floodFill(newGrid, x + dc, y + dr, newRevealed);
        }
      }

      return newGrid;
    },
    [difficulty],
  );

  const checkWin = useCallback(
    (currentGrid: Cell[][]): boolean => {
      const config = DIFFICULTIES[difficulty];
      const totalSafeCells = config.rows * config.cols - config.mines;
      const revealedCount = currentGrid
        .flat()
        .filter((c) => c.revealed && !c.mine).length;
      return revealedCount === totalSafeCells;
    },
    [difficulty],
  );

  const startGame = useCallback(() => {
    setGameStatus("playing");
    setTimer(0);
    setRevealedCells([]);
    setFlaggedCells([]);
    timerStartedRef.current = false;
    setIsGridGenerated(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const config = DIFFICULTIES[difficulty];
    const emptyGrid: Cell[][] = [];
    for (let row = 0; row < config.rows; row++) {
      const rowArray: Cell[] = [];
      for (let col = 0; col < config.cols; col++) {
        rowArray.push({
          x: col,
          y: row,
          mine: false,
          value: 0,
          revealed: false,
          flagged: false,
          hidden: true,
        });
      }
      emptyGrid.push(rowArray);
    }
    setGrid(emptyGrid);
    setMineCount(config.mines);

    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t >= 999) return t;
        if (!timerStartedRef.current) {
          timerStartedRef.current = true;
          soundManager.playFirstClick();
          return 0;
        }
        return t + 1;
      });
    }, 1000);
  }, [difficulty]);

  const restartGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    soundManager.playFirstClick();
    startGame();
  }, [startGame]);

  const toggleDifficulty = useCallback(() => {
    const difficulties: Difficulty[] = ["easy", "medium", "hard"];
    const currentIndex = difficulties.indexOf(difficulty);
    const nextDifficulty = difficulties[(currentIndex + 1) % 3];
    loadDifficulty(nextDifficulty);
    restartGame();
  }, [difficulty, loadDifficulty, restartGame]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
    if (intervalRef.current) {
      if (isPaused) {
        intervalRef.current = setInterval(() => {
          setTimer((t) => {
            if (t >= 999) return t;
            if (!timerStartedRef.current) {
              timerStartedRef.current = true;
              soundManager.playFirstClick();
              return 0;
            }
            return t + 1;
          });
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  }, [isPaused]);

  const revealCell = useCallback(
    (x: number, y: number) => {
      const config = DIFFICULTIES[difficulty];
      if (x < 0 || x >= config.cols || y < 0 || y >= config.rows) return;
      const cell = grid[y][x];
      if (cell.revealed || cell.flagged) return;
      if (!timerStartedRef.current) timerStartedRef.current = true;
      if (!isGridGenerated) {
        const safePos: Position = { x, y };
        const newGrid = generateSafeGrid(safePos);
        setGrid(newGrid);
        setRevealedCells((prev) => [...prev, { x, y }]);
        setIsGridGenerated(true);
        const firstCell = newGrid[y][x];
        const newRevealed = [...revealedCells, { x, y }];
        if (checkWin(newGrid)) {
          setGameStatus("won");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          soundManager.playWin();
          const currentScore = timer;
          setHighScores((prev) => {
            const newScores = {
              ...prev,
              [difficulty]: Math.max(prev[difficulty], currentScore),
            };
            localStorage.setItem(
              STORAGE_KEYS.HIGH_SCORES,
              JSON.stringify(newScores),
            );
            return newScores;
          });
        } else {
          const floodedGrid = floodFill(newGrid, x, y, newRevealed);
          setGrid(floodedGrid);
          if (firstCell.value === 0) soundManager.playRevealEmpty();
          else soundManager.playRevealNumber();
        }
        return;
      }
      if (cell.mine) {
        const gameOverGrid = grid.map((row) =>
          row.map((c) => ({ ...c, revealed: true, hidden: false })),
        );
        setGrid(gameOverGrid);
        setRevealedCells((prev) => [...prev, { x, y }]);
        setGameStatus("gameover");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        soundManager.playGameOver();
        setHighScores((prev) => {
          const newScores = { ...prev, [difficulty]: 0 };
          localStorage.setItem(
            STORAGE_KEYS.HIGH_SCORES,
            JSON.stringify(newScores),
          );
          return newScores;
        });
      } else {
        const newRevealed = [...revealedCells, { x, y }];
        const newGrid = floodFill(grid, x, y, newRevealed);
        setGrid(newGrid);
        setRevealedCells(newRevealed);
        if (cell.value === 0) soundManager.playRevealEmpty();
        else soundManager.playRevealNumber();
        if (checkWin(newGrid)) {
          setGameStatus("won");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          soundManager.playWin();
          const currentScore = timer;
          setHighScores((prev) => {
            const newScores = {
              ...prev,
              [difficulty]: Math.max(prev[difficulty], currentScore),
            };
            localStorage.setItem(
              STORAGE_KEYS.HIGH_SCORES,
              JSON.stringify(newScores),
            );
            return newScores;
          });
        }
      }
    },
    [
      grid,
      difficulty,
      revealedCells,
      isGridGenerated,
      floodFill,
      checkWin,
      intervalRef,
      timerStartedRef,
      timer,
    ],
  );

  const flagCell = useCallback(
    (x: number, y: number) => {
      const config = DIFFICULTIES[difficulty];

      if (x < 0 || x >= config.cols || y < 0 || y >= config.rows) {
        return;
      }

      const cell = grid[y][x];

      if (cell.revealed) {
        return;
      }

      const isFlagged = flaggedCells.some((p) => p.x === x && p.y === y);
      if (!isFlagged && mineCount <= 0) {
        return;
      }
      const newFlaggedCells = isFlagged
        ? flaggedCells.filter((p) => p.x !== x || p.y !== y)
        : [...flaggedCells, { x, y }];

      setFlaggedCells(newFlaggedCells);
      setMineCount((prev) => prev + (isFlagged ? 1 : -1));

      const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
      newGrid[y][x].flagged = !isFlagged;
      setGrid(newGrid);

      if (isFlagged) {
        soundManager.playUnflag();
      } else {
        soundManager.playFlag();
      }
    },
    [grid, difficulty, flaggedCells, mineCount],
  );

  const state: MinesweeperState = useMemo(
    () => ({
      grid,
      revealedCells,
      flaggedCells,
      mineCount,
      timer,
      gameStatus,
      isPaused,
      highScores,
      difficulty,
    }),
    [
      grid,
      revealedCells,
      flaggedCells,
      mineCount,
      timer,
      gameStatus,
      isPaused,
      highScores,
      difficulty,
    ],
  );

  const value: MinesweeperContextType = {
    state,
    startGame,
    revealCell,
    flagCell,
    toggleDifficulty,
    togglePause,
    restartGame,
  };

  return (
    <MinesweeperContext.Provider value={value}>
      {children}
    </MinesweeperContext.Provider>
  );
}

export function useMinesweeper() {
  const ctx = useContext(MinesweeperContext);
  if (!ctx) {
    throw new Error(
      "useMinesweeper must be used within MinesweeperGameProvider",
    );
  }
  return {
    ...ctx,
    ...ctx.state,
  };
}
