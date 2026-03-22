// TypeScript type definitions for Super Mario game

export type GameState =
  | "IDLE"
  | "PLAYING"
  | "PAUSED"
  | "GAME_OVER"
  | "WIN"
  | "RESPAWNING"
  | "TRANSITIONING";

export interface Mario {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isGrounded: boolean;
  isJumping: boolean;
  facingRight: boolean;
  color: string;
  isBig: boolean; // Power-up transformation state
  invulnerable: number; // Frames of invulnerability (for flashing effect)
}

export interface Pipe {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Flagpole {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Ground segment for ground with pits support
 * Each segment represents a solid ground portion; gaps between segments are pits
 */
export interface Ground {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Platform game entity (floating platforms Mario can stand on)
 */
export interface Platform {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
}

/**
 * Block game entity (brick blocks and question blocks)
 */
export interface Block {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
  type: BlockType;
  contents?: BlockContents;
  used: boolean; // true if question block has been activated
}

export interface Enemy {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number; // Vertical velocity for gravity
  walkStart: number;
  walkRange: number;
  color: string;
  alive: boolean;
}

export interface Coin {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

/**
 * Mushroom power-up entity
 * Spawns from question blocks when head-bumped
 */
export type MushroomType = "SUPER" | "1UP";

export interface Mushroom {
  id: string; // Unique ID for React keys
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number; // Vertical velocity for gravity
  active: boolean; // false when collected or timed out
  spawnTime: number; // Timestamp when spawned (for timeout)
  type: MushroomType; // SUPER or 1UP
}

export interface GameScore {
  coins: number;
  score: number;
  highScore: number;
  lives: number;
  currentTime: number; // Time remaining in seconds
}

export interface GameCamera {
  x: number;
  scrollSpeed: number;
}

export interface GameStatus {
  state: GameState;
  gameOverReason?: string;
  currentWorld?: number;
  currentLevel?: number;
}

export interface GameSettings {
  gravity: number;
  jumpVelocity: number;
  moveSpeed: number;
  friction: number;
  cameraSpeed: number;
}

export interface GameLoopConfig {
  fps: number;
  interval: number;
  framesPerSecond: number;
  requestAnimationFrame: boolean;
}

export type GameAction = {
  type:
    | "START"
    | "MOVE_LEFT"
    | "MOVE_RIGHT"
    | "STOP"
    | "JUMP"
    | "GAME_START"
    | "PAUSE"
    | "RESUME"
    | "GAME_OVER"
    | "GAME_WIN"
    | "ADD_SCORE"
    | "ADD_COIN"
    | "RESET"
    | "UPDATE_LOCAL_STATE"
    | "ACTIVATE_BLOCK"
    | "SPAWN_MUSHROOM"
    | "COLLECT_MUSHROOM"
    | "TRANSFORM_MARIO"
    | "SHRINK_MARIO"
    | "BREAK_BRICK"
    | "SPAWN_PARTICLES"
    | "REMOVE_PARTICLES"
    | "UPDATE_TIME"
    | "LOSE_LIFE"
    | "GIVE_EXTRA_LIFE"
    | "RESPAWN_MARIO"
    | "RESPAWN_DELAY"
    | "RESPAWN_COMPLETE"
    | "LEVEL_COMPLETE"
    | "NEXT_LEVEL"
    | "GAME_COMPLETE"
    | "TRANSITION_START"
    | "TRANSITION_END";
  payload?: any;
};

// ============================================================================
// Level Configuration System (Phase 4)
// ============================================================================

/**
 * Main level configuration container
 * Defines the complete layout of a level including all entities and settings
 */
export interface LevelConfig {
  id: string; // Level identifier (e.g., "1-1")
  name: string; // Display name (e.g., "World 1-1")
  width: number; // Total level width in pixels
  height: number; // Screen height (CANVAS_HEIGHT)
  groundHeight: number; // Height of ground from bottom

  // Level metadata for progression
  world: number; // World number (e.g., 1)
  level: number; // Level number within world (e.g., 1)
  nextLevelId?: string; // ID of the next level (undefined if final)
  isFinalLevel: boolean; // true if this is the final level

  // Background settings
  skyColor: {
    top: string;
    bottom: string;
  };

  // Mario starting position
  marioStart: {
    x: number;
    y: number;
  };

  // Flagpole configuration
  flagpole: {
    x: number;
    height: number;
  };

  // Level elements
  pipes: PipeConfig[];
  enemies: EnemyConfig[];
  coins: CoinConfig[];
  ground?: GroundConfig[]; // Ground segments with pits (optional, defaults to continuous ground)
  platforms?: PlatformConfig[];
  blocks?: BlockConfig[];
  oneUpMushrooms?: OneUpMushroomConfig[];
}

/**
 * Pipe configuration
 */
export interface PipeConfig {
  x: number;
  height: number; // Visible height above ground
}

/**
 * Ground segment configuration
 * Defines solid ground portions; gaps between segments create pits
 */
export interface GroundConfig {
  x: number;
  width: number;
}

/**
 * Enemy configuration
 */
export interface EnemyConfig {
  x: number;
  walkRange: number; // Patrol range from spawn
  type: "GOOMBA" | "KOOPA" | "BLOOPER"; // Enemy type
}

/**
 * Coin configuration
 */
export interface CoinConfig {
  x: number;
  y: number;
}

/**
 * OneUp mushroom configuration
 */
export interface OneUpMushroomConfig {
  x: number;
  y: number;
}

/**
 * Platform types for floating platforms
 */
export type PlatformType = "BRICK" | "HARD_BLOCK" | "QUESTION_BLOCK";

/**
 * Block types for brick/question/hard blocks
 */
export type BlockType = "BRICK" | "QUESTION" | "HARD";

/**
 * Contents that can be inside a question block
 */
export type BlockContents =
  | "MUSHROOM"
  | "COIN"
  | "SUPER_STAR"
  | "FIRE_FLOWER"
  | null;

/**
 * Platform configuration (floating platforms Mario can stand on)
 */
export interface PlatformConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: PlatformType;
}

/**
 * Block configuration (brick blocks, question blocks, hard blocks)
 */
export interface BlockConfig {
  x: number;
  y: number;
  type: BlockType;
  contents?: BlockContents;
}

/**
 * Particle system for visual effects
 */
export interface Particle {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  lifetime: number; // Frames remaining
  color: string;
  size: number;
  type: ParticleType;
}

/**
 * Particle types for different visual effects
 */
export type ParticleType =
  | "MUSHROOM_BURST" // Mushroom spawn from question block
  | "TRANSFORM_BURST" // Mario power-up transformation
  | "BRICK_BREAK" // Brick block destruction
  | "MUSHROOM_COLLECT" // Mushroom collection effect
  | "COIN_SPARKLE" // Coin collection sparkle
  | "LIFE_UPGRADE"; // Extra life gained
