import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface GameContextType {
  activeGame: string | null;
  setActiveGame: (gameName: string) => void;
  currentScore: number;
  highScore: number;
  addScore: (points: number) => void;
  gameStarted: boolean;
  gamePaused: boolean;
  resumeGame: () => void;
}

interface GameProviderProps {
  children: React.ReactNode;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameStateType = {
  activeGame: string | null;
  currentScore: number;
  highScore: number;
  gameStarted: boolean;
  gamePaused: boolean;
};

type GameActionType =
  | { type: 'SET_ACTIVE_GAME'; payload: string }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'GAME_OVER' }
  | { type: 'SET_GAME_STATUS'; payload: { started: boolean; paused: boolean } };

function gameReducer(state: GameStateType, action: GameActionType): GameStateType {
  switch (action.type) {
    case 'SET_ACTIVE_GAME':
      return {
        ...state,
        activeGame: action.payload,
        currentScore: 0,
        highScore: state.highScore,
        gameStarted: false,
        gamePaused: false
      };
    case 'ADD_SCORE':
      return {
        ...state,
        currentScore: state.currentScore + action.payload
      };
    case 'GAME_OVER':
      return {
        ...state,
        currentScore: 0,
        gameStarted: false
      };
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStarted: action.payload.started,
        gamePaused: action.payload.paused
      };
    default:
      return state;
  }
}

function persistHighScore(score: number) {
  localStorage.setItem('gameHighScore', score.toString());
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, {
    activeGame: null,
    currentScore: 0,
    highScore: Number(localStorage.getItem('gameHighScore')) || 0,
    gameStarted: false,
    gamePaused: false
  });

  const setActiveGame = (gameName: string) => {
    dispatch({ type: 'SET_ACTIVE_GAME', payload: gameName });
  };

  const addScore = (points: number) => {
    dispatch({ type: 'ADD_SCORE', payload: points });
    if (state.currentScore + points > state.highScore) {
      persistHighScore(state.currentScore + points);
    }
  };

  const resumeGame = () => {
    dispatch({
      type: 'SET_GAME_STATUS',
      payload: { started: true, paused: false }
    });
  };

  return (
    <GameContext.Provider value={{
      activeGame: state.activeGame,
      setActiveGame,
      currentScore: state.currentScore,
      highScore: state.highScore,
      addScore,
      gameStarted: state.gameStarted,
      gamePaused: state.gamePaused,
      resumeGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
