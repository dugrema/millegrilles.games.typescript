import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Bird, Pipe, GameScore, GameAction, GameStatus } from "./types";

// Helper function to safely access localStorage
function getStoredHighScore(): number {
  if (typeof window === "undefined" || !window.localStorage) {
    return 0;
  }
  return parseInt(
    window.localStorage.getItem("flappyBirdHighScore") || "0",
    10,
  );
}

// Initial game state
const initialState = {
  bird: {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    velocity: 0,
    rotation: 0,
    color: "#FFD700",
  },
  pipes: [],
  score: {
    current: 0,
    highScore: getStoredHighScore(),
  },
  status: "IDLE" as GameStatus["state"],
  gameOverReason: "",
};

// Game actions
function gameReducer(state: any, action: GameAction) {
  switch (action.type) {
    case "JUMP":
      if (state.status !== "PLAYING") {
        return state;
      }
      const newBird = {
        ...state.bird,
        velocity: -9,
      };
      return {
        ...state,
        bird: newBird,
      };

    case "GAME_START":
      return {
        ...initialState,
        bird: {
          ...initialState.bird,
          x: 100,
          y: 300,
          velocity: 0,
        },
        status: "PLAYING",
      };

    case "PAUSE":
      return {
        ...state,
        status: "PAUSED",
      };

    case "RESUME":
      return {
        ...state,
        status: "PLAYING",
      };

    case "GAME_OVER":
      const newGameScore = {
        ...state.score,
        current: state.score.current,
      };
      // Update high score
      if (state.score.current > state.score.highScore) {
        newGameScore.highScore = state.score.current;
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            "flappyBirdHighScore",
            state.score.current.toString(),
          );
        }
      }
      return {
        ...state,
        score: newGameScore,
        status: "GAME_OVER",
        gameOverReason: action.payload || "",
      };

    case "ADD_SCORE":
      return {
        ...state,
        score: {
          ...state.score,
          current: state.score.current + 1,
        },
      };

    case "UPDATE_LOCAL_STATE":
      return {
        ...state,
        bird: action.payload?.bird || state.bird,
        pipes: action.payload?.pipes || state.pipes,
      };

    case "RESET":
      return {
        ...initialState,
        bird: {
          ...initialState.bird,
          x: 100,
          y: 300,
        },
        status: "IDLE",
      };

    default:
      return state;
  }
}

// Game context type
interface GameContextType {
  state: any;
  dispatch: React.Dispatch<GameAction>;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  jump: () => void;
  handleGameOver: (reason: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = () => {
    console.log("GameContext: startGame called");
    dispatch({ type: "GAME_START" });
  };
  const pauseGame = () => dispatch({ type: "PAUSE" });
  const resumeGame = () => dispatch({ type: "RESUME" });
  const jump = () => dispatch({ type: "JUMP" });
  const handleGameOver = (reason: string) =>
    dispatch({ type: "GAME_OVER", payload: reason });
  const resetGame = () => dispatch({ type: "RESET" });

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        startGame,
        pauseGame,
        resumeGame,
        jump,
        handleGameOver,
        resetGame,
      }}
    >
      {children}
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
