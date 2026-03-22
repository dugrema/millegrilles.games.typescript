import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import type {
  Mario,
  Pipe,
  Flagpole,
  Enemy,
  Coin,
  GameScore,
  GameAction,
  GameStatus,
  GameCamera,
  LevelConfig,
  Platform,
  Block,
  Mushroom,
  Ground,
} from "./types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  MARIO_WIDTH,
  MARIO_HEIGHT,
  JUMP_VELOCITY,
} from "./constants";
import { ParticleSystemProvider } from "./ParticleSystem";
import { loadLevel } from "./LevelLoader";
import { renderLevel } from "./LevelRenderer";
import {
  getNextLevelId,
  isFinalLevel,
  getLevelInfo,
} from "./utils/levelManager";

// Helper function to safely access localStorage
function getStoredHighScore(): number {
  if (typeof window === "undefined" || !window.localStorage) {
    return 0;
  }
  return parseInt(
    window.localStorage.getItem("superMarioHighScore") || "0",
    10,
  );
}

// Initial game state
const initialState = {
  mario: {
    x: 100,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - MARIO_HEIGHT,
    width: MARIO_WIDTH,
    height: MARIO_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isGrounded: true,
    isJumping: false,
    facingRight: true,
    color: "#FF0000",
    isBig: false,
    invulnerable: 0,
  },
  pipes: [] as Pipe[],
  platforms: [] as Platform[],
  blocks: [] as Block[],
  grounds: [] as Ground[],
  enemies: [] as Enemy[],
  coins: [] as Coin[],
  mushrooms: [] as Mushroom[],
  flagpole: null as Flagpole | null,
  currentLevelId: "1-1",
  levelConfig: null as LevelConfig | null,
  score: {
    coins: 0,
    score: 0,
    highScore: getStoredHighScore(),
    lives: 3,
    currentTime: 400, // Default time limit (400 seconds = 6:40 for level 1-1)
  },
  camera: {
    x: 0,
    scrollSpeed: 5,
  },
  status: {
    state: "IDLE" as GameStatus["state"],
    currentWorld: 1,
    currentLevel: 1,
  },
};

// Game actions
function gameReducer(state: any, action: GameAction) {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "PLAYING",
      };

    case "MOVE_LEFT":
      return {
        ...state,
        mario: {
          ...state.mario,
          facingRight: false,
        },
      };

    case "MOVE_RIGHT":
      return {
        ...state,
        mario: {
          ...state.mario,
          facingRight: true,
        },
      };

    case "STOP":
      return {
        ...state,
        mario: {
          ...state.mario,
          velocityX: 0,
        },
      };

    case "JUMP":
      if (state.status !== "PLAYING" || !state.mario.isGrounded) {
        return state;
      }
      return {
        ...state,
        mario: {
          ...state.mario,
          velocityY: JUMP_VELOCITY,
          isGrounded: false,
          isJumping: true,
        },
      };

    case "GAME_START":
      if (action.payload) {
        // Handle level config-based game start
        // Merge oneUpMushrooms with regular mushrooms
        const allMushrooms = [
          ...(action.payload.mushrooms || []),
          ...(action.payload.oneUpMushrooms || []),
        ];

        return {
          ...initialState,
          mario: {
            ...initialState.mario,
            ...action.payload.marioStart,
            velocityX: 0,
            velocityY: 0,
          },
          pipes: action.payload.pipes || [],
          platforms: action.payload.platforms || [],
          blocks: action.payload.blocks || [],
          grounds: action.payload.grounds || [],
          enemies: action.payload.enemies || [],
          coins: action.payload.coins || [],
          mushrooms: allMushrooms,
          flagpole: action.payload.flagpole || null,
          currentLevelId: action.payload.currentLevelId || "1-1",
          levelConfig: action.payload.levelConfig || null,
          status: {
            state: "PLAYING",
            currentWorld: action.payload.levelConfig?.world ?? 1,
            currentLevel: action.payload.levelConfig?.level ?? 1,
          },
        };
      }
      // Fallback to default state
      return {
        ...initialState,
        status: {
          state: "PLAYING",
          currentWorld: 1,
          currentLevel: 1,
        },
        score: {
          ...initialState.score,
          currentTime: action.payload?.levelConfig?.timeLimit || 400,
        },
        mushrooms: action.payload.oneUpMushrooms || [],
      };

    case "PAUSE":
      return {
        ...state,
        status: {
          ...state.status,
          state: "PAUSED",
        },
      };

    case "RESUME":
      return {
        ...state,
        status: {
          ...state.status,
          state: "PLAYING",
        },
      };

    case "GAME_OVER":
      const newGameScore = {
        ...state.score,
        score: state.score.score,
      };
      // Update high score
      if (state.score.score > state.score.highScore) {
        newGameScore.highScore = state.score.score;
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            "superMarioHighScore",
            state.score.score.toString(),
          );
        }
      }
      return {
        ...state,
        score: newGameScore,
        status: {
          ...state.status,
          state: "GAME_OVER",
          gameOverReason: action.payload || "",
        },
      };

    case "GAME_WIN":
      const newWinScore = {
        ...state.score,
        score: state.score.score + (action.payload || 0),
      };
      // Update high score
      if (newWinScore.score > newWinScore.highScore) {
        newWinScore.highScore = newWinScore.score;
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            "superMarioHighScore",
            newWinScore.score.toString(),
          );
        }
      }
      return {
        ...state,
        score: newWinScore,
        status: {
          ...state.status,
          state: "WIN",
          gameOverReason: action.payload || "You reached the flag! You win!",
        },
      };

    case "ADD_SCORE":
      return {
        ...state,
        score: {
          ...state.score,
          score: state.score.score + (action.payload || 100),
        },
      };

    case "ADD_COIN":
      const newCoinCount = state.score.coins + 1;
      const newScore = state.score.score + 50;
      const coinsBefore = state.score.coins;
      const extraLifeThreshold = 100;

      // Grant extra life when crossing 100, 200, 300, etc. coin threshold
      const gainedExtraLife =
        coinsBefore > 0 &&
        coinsBefore < extraLifeThreshold &&
        newCoinCount >= extraLifeThreshold &&
        Math.floor(newCoinCount / extraLifeThreshold) >
          Math.floor(coinsBefore / extraLifeThreshold);

      return {
        ...state,
        score: {
          ...state.score,
          coins: newCoinCount,
          score: newScore,
          lives: gainedExtraLife ? state.score.lives + 1 : state.score.lives,
        },
      };

    case "UPDATE_LOCAL_STATE":
      return {
        ...state,
        mario: action.payload?.mario || state.mario,
        pipes: action.payload?.pipes || state.pipes,
        platforms: action.payload?.platforms || state.platforms,
        blocks: action.payload?.blocks || state.blocks,
        grounds: action.payload?.grounds || state.grounds,
        enemies: action.payload?.enemies || state.enemies,
        coins: action.payload?.coins || state.coins,
        mushrooms: action.payload?.mushrooms || state.mushrooms,
        camera: action.payload?.camera || state.camera,
      };

    case "RESET":
      return {
        ...initialState,
        mario: {
          ...initialState.mario,
          x: 100,
          y: CANVAS_HEIGHT - GROUND_HEIGHT - MARIO_HEIGHT,
        },
        status: {
          state: "IDLE",
          currentWorld: 1,
          currentLevel: 1,
        },
        mushrooms: [],
      };

    case "ACTIVATE_BLOCK":
      // Mark question block as used
      const updatedBlocks = state.blocks.map((block: any) =>
        block.x === action.payload.x && block.y === action.payload.y
          ? { ...block, used: true }
          : block,
      );
      return { ...state, blocks: updatedBlocks };

    // SPAWN_MUSHROOM removed - mushrooms are added via UPDATE_LOCAL_STATE sync from refs
    // This case is no longer needed since mushroomsRef.current is pushed to directly
    // and synced back to state at the end of each physics frame
    case "SPAWN_MUSHROOM":
      return state;

    case "COLLECT_MUSHROOM":
      // No-op - mushrooms are marked inactive in refs and synced via UPDATE_LOCAL_STATE
      return state;

    case "TRANSFORM_MARIO":
      // Transform Mario to big size
      return {
        ...state,
        mario: {
          ...state.mario,
          height: 56, // BIG_MARIO_HEIGHT
          isBig: true,
          invulnerable: 60, // 1 second invulnerability (60 frames)
        },
        score: {
          ...state.score,
          score: state.score.score + 200,
        },
      };

    case "SHRINK_MARIO":
      // Shrink Mario back to small size
      return {
        ...state,
        mario: {
          ...state.mario,
          height: 40, // MARIO_HEIGHT
          isBig: false,
          invulnerable: 90, // 1.5 seconds invulnerability (90 frames)
        },
      };

    case "BREAK_BRICK":
      // Remove brick block when broken by big Mario
      const updatedBlocks2 = state.blocks.filter(
        (block: any) =>
          !(block.x === action.payload.x && block.y === action.payload.y),
      );
      return {
        ...state,
        blocks: updatedBlocks2,
        score: {
          ...state.score,
          score: state.score.score + 100,
        },
      };

    case "UPDATE_TIME":
      // Decrease time counter
      const newTime = state.score.currentTime - (action.payload || 1 / 60);
      return {
        ...state,
        score: {
          ...state.score,
          currentTime: newTime,
        },
      };

    case "LOSE_LIFE":
      // Lose a life
      const newLives = state.score.lives - 1;

      // Check if no lives left
      if (newLives <= 0) {
        const newGameScore = {
          ...state.score,
          score: state.score.score,
        };
        if (state.score.score > state.score.highScore) {
          newGameScore.highScore = state.score.score;
          if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(
              "superMarioHighScore",
              state.score.score.toString(),
            );
          }
        }
        return {
          ...state,
          score: newGameScore,
          status: {
            ...state.status,
            state: "GAME_OVER",
            gameOverReason: "No lives left!",
          },
        };
      }

      // Otherwise, set status to RESPAWNING and trigger delayed respawn
      const respawnX = state.levelConfig?.marioStart?.x || 100;
      const respawnY =
        state.levelConfig?.marioStart?.y ||
        CANVAS_HEIGHT - GROUND_HEIGHT - MARIO_HEIGHT;

      return {
        ...state,
        score: {
          ...state.score,
          lives: newLives,
        },
        status: {
          ...state.status,
          state: "RESPAWNING", // Pause gameplay during delay
        },
        mario: {
          ...state.mario,
          x: respawnX,
          y: respawnY,
          velocityX: 0,
          velocityY: 0,
          isGrounded: true,
          isBig: false,
          height: MARIO_HEIGHT,
          invulnerable: 120, // 2 seconds invulnerability after respawn
        },
      };

    case "GIVE_EXTRA_LIFE":
      return {
        ...state,
        score: {
          ...state.score,
          lives: state.score.lives + 1,
          score: state.score.score + 1000, // Bonus points for extra life
        },
      };

    case "RESPAWN_MARIO":
      // Reset Mario to starting position with small size
      const respawnXNew = state.levelConfig?.marioStart?.x || 100;
      const respawnYNew =
        state.levelConfig?.marioStart?.y ||
        CANVAS_HEIGHT - GROUND_HEIGHT - MARIO_HEIGHT;

      return {
        ...state,
        mario: {
          ...state.mario,
          x: respawnXNew,
          y: respawnYNew,
          velocityX: 0,
          velocityY: 0,
          isGrounded: true,
          isBig: false,
          height: MARIO_HEIGHT,
          invulnerable: 120, // 2 seconds invulnerability
        },
      };

    case "RESPAWN_DELAY":
      // Set the respawn position and start countdown
      const delayX = state.levelConfig?.marioStart?.x || 100;
      const delayY =
        state.levelConfig?.marioStart?.y ||
        CANVAS_HEIGHT - GROUND_HEIGHT - MARIO_HEIGHT;

      return {
        ...state,
        mario: {
          ...state.mario,
          x: delayX,
          y: delayY,
          velocityX: 0,
          velocityY: 0,
          isGrounded: true,
          isBig: false,
          height: MARIO_HEIGHT,
          invulnerable: 120,
        },
        camera: {
          x: 0,
          scrollSpeed: 5,
        }, // Start resetting camera
      };

    case "RESPAWN_COMPLETE":
      // Complete respawn: resume gameplay
      return {
        ...state,
        status: {
          ...state.status,
          state: "PLAYING", // Resume gameplay
        },
      };

    case "LEVEL_COMPLETE":
      // Level completed - prepare for transition
      return {
        ...state,
        status: {
          ...state.status,
          state: "TRANSITIONING",
        },
      };

    case "NEXT_LEVEL":
      // Transition to next level
      if (action.payload) {
        // Merge oneUpMushrooms with regular mushrooms
        const allMushrooms = [
          ...(action.payload.mushrooms || []),
          ...(action.payload.oneUpMushrooms || []),
        ];

        return {
          ...initialState,
          mario: {
            ...initialState.mario,
            ...action.payload.marioStart,
            velocityX: 0,
            velocityY: 0,
          },
          pipes: action.payload.pipes || [],
          platforms: action.payload.platforms || [],
          blocks: action.payload.blocks || [],
          grounds: action.payload.grounds || [],
          enemies: action.payload.enemies || [],
          coins: action.payload.coins || [],
          mushrooms: allMushrooms,
          flagpole: action.payload.flagpole || null,
          currentLevelId: action.payload.currentLevelId || "1-1",
          levelConfig: action.payload.levelConfig || null,
          score: {
            ...state.score,
            // Keep score, coins, and highScore from previous level
          },
          status: {
            state: "PLAYING",
            currentWorld: action.payload.levelConfig?.world ?? 1,
            currentLevel: action.payload.levelConfig?.level ?? 1,
          },
        };
      }
      return state;

    case "GAME_COMPLETE":
      // All levels completed - game finished
      const finalScore = {
        ...state.score,
        score: state.score.score + (action.payload?.bonusScore || 0),
      };

      // Update high score
      if (finalScore.score > finalScore.highScore) {
        finalScore.highScore = finalScore.score;
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            "superMarioHighScore",
            finalScore.score.toString(),
          );
        }
      }

      return {
        ...state,
        score: finalScore,
        status: {
          ...state.status,
          state: "WIN",
          gameOverReason: "Congratulations! You completed all levels!",
        },
      };

    default:
      return state;
  }
}

// Game context type
interface GameContextType {
  state: any;
  dispatch: React.Dispatch<GameAction>;
  startGame: (levelId?: string) => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  jump: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  stop: () => void;
  handleGameOver: (reason: string) => void;
  handleGameWin: (reason: string, bonusScore?: number) => void;
  handleLevelComplete: () => Promise<void>;
  checkNextLevel: () => Promise<boolean>;
  resetGame: () => void;
  switchLevel: (levelId: string) => Promise<void>;
  loseLife: () => void;
  updateTime: (delta: number) => void;
  getTransitionState: () => {
    isVisible: boolean;
    levelInfo: {
      world: number;
      level: number;
      nextWorld?: number;
      nextLevel?: number;
    };
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [transitionState, setTransitionState] = useState<{
    isVisible: boolean;
    levelInfo: {
      world: number;
      level: number;
      nextWorld?: number;
      nextLevel?: number;
    };
  }>({ isVisible: false, levelInfo: { world: 1, level: 1 } });

  const loseLife = () => dispatch({ type: "LOSE_LIFE" });

  const updateTime = (delta: number) =>
    dispatch({ type: "UPDATE_TIME", payload: delta });

  const startGame = async (levelId?: string) => {
    // Load the level configuration
    const loadedConfig = await loadLevel(levelId || "1-1");
    const levelData = renderLevel(loadedConfig);

    // Dispatch action with level data
    dispatch({
      type: "GAME_START",
      payload: {
        pipes: levelData.pipes,
        platforms: levelData.platforms,
        blocks: levelData.blocks,
        grounds: levelData.grounds,
        enemies: levelData.enemies,
        coins: levelData.coins,
        mushrooms: levelData.mushrooms || [],
        oneUpMushrooms: levelData.oneUpMushrooms || [],
        flagpole: levelData.flagpole,
        marioStart: levelData.marioStart,
        currentLevelId: levelId || "1-1",
        levelConfig: loadedConfig,
      },
    });
  };

  const switchLevel = async (levelId: string) => {
    const loadedConfig = await loadLevel(levelId);
    const levelData = renderLevel(loadedConfig);

    dispatch({
      type: "GAME_START",
      payload: {
        pipes: levelData.pipes,
        platforms: levelData.platforms,
        blocks: levelData.blocks,
        grounds: levelData.grounds,
        enemies: levelData.enemies,
        coins: levelData.coins,
        mushrooms: levelData.mushrooms || [],
        oneUpMushrooms: levelData.oneUpMushrooms || [],
        flagpole: levelData.flagpole,
        marioStart: levelData.marioStart,
        currentLevelId: levelId,
        levelConfig: loadedConfig,
      },
    });
  };

  const pauseGame = () => {
    if (state.status.state === "PLAYING") {
      dispatch({ type: "PAUSE" });
    } else if (state.status.state === "PAUSED") {
      dispatch({ type: "RESUME" });
    }
  };

  const resumeGame = () => dispatch({ type: "RESUME" });

  const jump = () => dispatch({ type: "JUMP" });

  const moveLeft = () => dispatch({ type: "MOVE_LEFT" });

  const moveRight = () => dispatch({ type: "MOVE_RIGHT" });

  const stop = () => dispatch({ type: "STOP" });

  const handleGameOver = (reason: string) =>
    dispatch({ type: "GAME_OVER", payload: reason });

  const checkNextLevel = async (): Promise<boolean> => {
    const { getNextLevelId, isFinalLevel } =
      await import("./utils/levelManager");

    const nextLevelId = await getNextLevelId(state.currentLevelId);
    const finalLevel = await isFinalLevel(state.currentLevelId);

    return !finalLevel && !!nextLevelId;
  };

  const handleLevelComplete = async () => {
    const hasNextLevel = await checkNextLevel();

    if (!hasNextLevel) {
      // No more levels - game complete
      setTransitionState({
        isVisible: true,
        levelInfo: {
          world: state.status.currentWorld || 1,
          level: state.status.currentLevel || 1,
        },
      });
      dispatch({ type: "GAME_COMPLETE" });
      // Hide transition after 3 seconds
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
      return;
    }

    // Load next level
    const nextLevelId = await import("./utils/levelManager").then((m) =>
      m.getNextLevelId(state.currentLevelId),
    );

    if (!nextLevelId) return;

    const { loadLevel } = await import("./LevelLoader");
    const { renderLevel } = await import("./LevelRenderer");

    const loadedConfig = await loadLevel(nextLevelId);
    const levelData = renderLevel(loadedConfig);

    // Set transition state - get next level info from levelManager
    const { getLevelInfo } = await import("./utils/levelManager");
    const nextLevelInfo = await getLevelInfo(nextLevelId);
    const nextWorld = nextLevelInfo?.world || 1;
    const nextLevel = nextLevelInfo?.level || 1;

    setTransitionState({
      isVisible: true,
      levelInfo: {
        world: state.status.currentWorld || 1,
        level: state.status.currentLevel || 1,
        nextWorld,
        nextLevel,
      },
    });

    // Dispatch next level action after short delay
    setTimeout(() => {
      dispatch({
        type: "NEXT_LEVEL",
        payload: {
          pipes: levelData.pipes,
          platforms: levelData.platforms,
          blocks: levelData.blocks,
          grounds: levelData.grounds,
          enemies: levelData.enemies,
          coins: levelData.coins,
          mushrooms: levelData.mushrooms || [],
          oneUpMushrooms: levelData.oneUpMushrooms || [],
          flagpole: levelData.flagpole,
          marioStart: levelData.marioStart,
          currentLevelId: nextLevelId,
          levelConfig: loadedConfig,
        },
      });
    }, 500);

    // Hide transition after level loads
    setTimeout(() => {
      setTransitionState((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleGameWin = (reason: string, bonusScore?: number) =>
    dispatch({ type: "GAME_WIN", payload: reason });

  const resetGame = () => dispatch({ type: "RESET" });

  const getTransitionState = () => ({ ...transitionState });

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        startGame,
        pauseGame,
        resumeGame,
        jump,
        moveLeft,
        moveRight,
        stop,
        handleGameOver,
        handleGameWin,
        handleLevelComplete,
        checkNextLevel,
        resetGame,
        switchLevel,
        loseLife,
        updateTime,
        getTransitionState,
      }}
    >
      <ParticleSystemProvider>{children}</ParticleSystemProvider>
    </GameContext.Provider>
  );
}

// Custom hook for accessing game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
