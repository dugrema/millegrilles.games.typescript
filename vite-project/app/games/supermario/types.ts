// Type definitions for Super Mario game

// Basic position and dimension interfaces
export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

// Player direction and animation types
export type PlayerDirection = "left" | "right";

export type PlayerState =
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "doubleJump"
  | "land"
  | "fall"
  | "dead";

export type PlayerAnimation = "normal" | "left" | "right";

// Tile types for level maps
export type TileType =
  | "empty"
  | "ground"
  | "block"
  | "question"
  | "brick"
  | "pipe"
  | "coin"
  | "coin_item"
  | "goomba"
  | "flag"
  | "flagpole"
  | "cloud"
  | "hill"
  | "pipe_l"
  | "pipe_r";

// Collision type for physics
export type CollisionType = "player" | "enemy" | "coin" | "powerup" | "block";

// Player interface
export interface Player {
  id: string;
  position: Position;
  velocity: Position;
  dimensions: Dimensions;
  direction: PlayerDirection;
  state: PlayerState;
  animation: PlayerAnimation;
  animationFrame: number;
  isGrounded: boolean;
  isFacingLeft: boolean;
  isRunning: boolean;
  canDoubleJump: boolean;
  isDead: boolean;
  score: number;
  lives: number;
  coins: number;
}

// Player input state
export interface PlayerInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
  runHeld: boolean;
  runPressed: boolean;
}

// Tile interface for level data
export interface Tile {
  id: string;
  position: Position;
  dimensions: Dimensions;
  type: TileType;
  solid: boolean;
  animated: boolean;
  value?: number; // For question blocks (coins)
  frame?: number; // For animated tiles
}

// Level interface
export interface Level {
  id: number;
  name: string;
  map: string[];
  tileSize: number;
  width: number;
  height: number;
  startPos: Position;
  endPos: Position;
  enemyCount: number;
  tiles: Tile[];
  tilesByPosition: Map<string, Tile>;
}

// Game status
export type GameStatus =
  | "start"
  | "playing"
  | "paused"
  | "gameover"
  | "win"
  | "transition";

// Game state
export interface GameState {
  status: GameStatus;
  currentLevel: number;
  score: number;
  lives: number;
  coins: number;
  time: number;
  player: Player;
  level: Level | null;
  tiles: Tile[];
  input: PlayerInput;
  camera: Position;
  animationFrame: number;
  isPaused: boolean;
  gameOverReason: string | null;
}

// Super Mario context type
export type SuperMarioContextType = {
  state: GameState;
  actions: {
    restartLevel: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    restartGame: () => void;
  };
} | null;
