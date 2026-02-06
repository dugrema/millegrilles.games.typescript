// Type definitions for Super Mario game

// UI Overlay Props
export interface UIOverlayProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  time: number;
  cameraPosition: { x: number; y: number } | undefined;
}

// Game state enum
export enum GameState {
  IDLE = "idle",
  PLAYING = "playing",
  PAUSED = "paused",
  GAME_OVER = "gameover",
  VICTORY = "victory",
  LEVEL_TRANSITION = "levelTransition",
}

// Player state
export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  state: PlayerStateType;
  isGrounded: boolean;
  isSmall: boolean;
  isBig: boolean;
  isFire: boolean;
  isPowerUpActive: boolean;
  powerUpType: PowerUpType;
  isJumping: boolean;
  canJump: boolean;
  isDucking: boolean;
  facingLeft: boolean;
  isRunning: boolean;
  isSprinting: boolean;
  boostMeter: number;
  animationFrame: number;
  animationState: string;
  platformsCollided: PlatformType[];
  lives: number;
}

export type PlayerStateType =
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "fall"
  | "duck";

export type PowerUpType = "none" | "mushroom" | "fire-flower";

// Platform types
export enum PlatformType {
  AIR = 7,
  GROUND = 1,
  BRICK = 2,
  QUESTION_BLOCK = 3,
  FLAG_POLE = 6,
  PIPE = 4,
  BLOCK = 5,
}

// Level definitions
export interface Level {
  id: string;
  map: number[][];
  width: number;
  height: number;
  startX: number;
  startY: number;
  gravity: number;
  jumpForce: number;
  moveSpeed: number;
}

// Enemy types
export enum EnemyType {
  GOOMBA = "goomba",
  KOOPA = "koopa",
}

// Collectible types
export enum CollectibleType {
  COIN = "coin",
  MUSHROOM = "mushroom",
  FIRE_FLOWER = "fire-flower",
}

// Collectible state
export interface Collectible {
  x: number;
  y: number;
  type: CollectibleType;
  collected: boolean;
}

// Enemy state
export interface Enemy {
  x: number;
  y: number;
  type: EnemyType;
  vx: number;
  vy: number;
  direction: number;
  alive: boolean;
  deathAnimation: boolean;
  facingLeft?: boolean;
  frame?: number;
}

// Input state
export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  run: boolean;
  duck: boolean;
  pause: boolean;
  restart: boolean;
  start: boolean;
}

// Camera state
export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

// Camera context type
export interface CameraContextType {
  camera: CameraState;
  setCamera: React.Dispatch<React.SetStateAction<CameraState>>;
  getCameraPosition: () => { x: number; y: number };
  updateCamera: (playerX: number, playerY: number) => void;
  clampCamera: (cameraX: number, cameraY: number) => void;
  ensurePlayerVisible: (playerX: number, playerY: number) => void;
  getViewport: () => {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  isInView: (
    objectX: number,
    objectY: number,
    width: number,
    height: number,
  ) => boolean;
}

// Game state for context
export interface MarioGameContextType {
  state: MarioGameState;
  actions: MarioGameActions;
}

// Complete game state
export interface MarioGameState {
  currentLevel: string;
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameState: GameState;
  player: PlayerState;
  platforms: PlatformType[][];
  enemies: Enemy[];
  collectibles: Collectible[];
  camera: CameraState;
  input: InputState;
  time: number;
  isPaused: boolean;
}

// Game actions
export interface MarioGameActions {
  startGame: () => void;
  restartLevel: () => void;
  resumeGame: () => void;
  pauseGame: () => void;
  setInput: (newInput: Partial<InputState>) => void;
  updatePlayer: () => void;
  checkCollisions: () => void;
  updateEnemies: () => void;
  checkWinCondition: () => void;
  checkLoseCondition: () => void;
  nextLevel: () => void;
  addScore: (points: number) => void;
}
