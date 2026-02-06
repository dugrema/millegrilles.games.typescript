// TypeScript type definitions for Flappy Bird game

export type GameState = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

export interface Bird {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  rotation: number;
  color: string;
}

export interface Pipe {
  x: number;
  y: number;
  width: number;
  height: number;
  gap: number;
  passed: boolean;
}

export interface GameScore {
  current: number;
  highScore: number;
}

export interface GameStatus {
  state: GameState;
  gameOverReason?: string;
}

export interface GameSettings {
  gravity: number;
  jumpVelocity: number;
  pipeSpeed: number;
  pipeGap: number;
  birdSize: number;
}

export interface GameLoopConfig {
  fps: number;
  interval: number;
  framesPerSecond: number;
  requestAnimationFrame: boolean;
}

export type GameAction = {
  type:
    | "JUMP"
    | "GAME_START"
    | "PAUSE"
    | "RESUME"
    | "GAME_OVER"
    | "ADD_SCORE"
    | "RESET"
    | "UPDATE_LOCAL_STATE";
  payload?: any;
};
