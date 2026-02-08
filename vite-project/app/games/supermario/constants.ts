// Game constants for Super Mario

// Screen configuration
export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 480;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 480;
export const PIXEL_SCALE = 1;

// Physics constants
export const GRAVITY = {
  acceleration: 0.5, // px/frame²
  velocity: 12, // Maximum fall speed
  friction: 0.9, // Air friction
};

// Jump
export const JUMP = {
  force: -12, // Upward velocity
  height: 150, // Max jump height
  doubleJumpAvailable: true, // Enable double jump
};

// Movement
export const MOVEMENT = {
  acceleration: 0.5, // Speed increase per frame
  maxSpeed: 5, // Normal walking speed
  runSpeed: 8, // Running speed
  runBoost: 3, // Additional boost when sprinting
  friction: 0.8, // Ground friction
  airResistance: 0.95, // Air resistance
};

// Run boost
export const RUN_BOOST = {
  decayRate: 0.5, // Boost meter decays per frame when sprinting
  rechargeRate: 0.2, // Boost meter recharges per frame when not sprinting
  maxMeter: 100, // Maximum boost meter
};

// Player dimensions
export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 32;
export const TILE_SIZE = 32;

// Camera
export const CAMERA_SCROLL_SPEED = 4;
export const CAMERA_SMOOTHING = 0.1;

// Game state constants
export const INITIAL_LIVES = 3;
export const INITIAL_SCORE = 0;
export const TIME_LIMIT = 300; // seconds

// Storage keys
export const STORAGE_KEYS = {
  HIGH_SCORE: "supermario_high_score",
  LEVEL_PROGRESS: "supermario_level_progress",
  COINS_COLLECTED: "supermario_coins_collected",
} as const;

// Animation frame counts
export const ANIMATION_FRAMES = {
  idle: 6,
  walk: 8,
  run: 12,
  jump: 4,
  duck: 8,
};

// Input keys
export const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  JUMP: "Space",
  RUN: "ShiftLeft",
  RESTART: "KeyR",
  ESCAPE: "Escape",
  SPRINT: "ShiftLeft",
} as const;

// Key descriptions
export const KEY_DESCRIPTIONS = {
  [KEYS.LEFT]: "Move Left",
  [KEYS.RIGHT]: "Move Right",
  [KEYS.UP]: "Crouch / Enter Pipes",
  [KEYS.DOWN]: "Crouch / Enter Pipes",
  [KEYS.JUMP]: "Jump",
  [KEYS.RUN]: "Run",
  [KEYS.RESTART]: "Start / Restart",
  [KEYS.ESCAPE]: "Pause / Escape / Quit",
} as const;

// Mobile controls
export const MOBILE_CONTROLS = {
  upBtn: "up",
  downBtn: "down",
  leftBtn: "left",
  rightBtn: "right",
  jumpBtn: "jump",
  runBtn: "run",
  pauseBtn: "pause",
} as const;

// Level configuration
export const LEVEL_CONFIG = {
  TILE_SIZE: 32,
  LEVEL_WIDTH: 100, // number of tiles
  LEVEL_HEIGHT: 20, // number of tiles
  TIME_LIMIT: 300, // seconds
  MAX_LIVES: 3,
  COINS_PER_LIFE: 100,
} as const;

// Tile types
export const TILE_TYPES = {
  empty: { solid: false, animated: false, color: null },
  ground: { solid: true, animated: false, color: "#8B4513" },
  block: { solid: true, animated: false, color: "#A0522D" },
  question: { solid: true, animated: true, color: "#FFD700" },
  brick: { solid: true, animated: false, color: "#B22222" },
  pipe: { solid: true, animated: true, color: "#228B22" },
  coin: { solid: false, animated: true, color: "#FFD700" },
  coin_item: { solid: false, animated: true, color: "#FFD700" },
  goomba: { solid: true, animated: true, color: "#8B4513" },
  flag: { solid: true, animated: false, color: "#FFFFFF" },
  flagpole: { solid: true, animated: true, color: "#228B22" },
  cloud: { solid: false, animated: true, color: "#FFFFFF" },
  hill: { solid: false, animated: false, color: "#90EE90" },
  pipe_l: { solid: true, animated: false, color: "#228B22" },
  pipe_r: { solid: true, animated: false, color: "#228B22" },
} as const;

// Animation speed
export const ANIMATION_SPEED = {
  idle: { fps: 6, frames: 6 },
  walk: { fps: 8, frames: 8 },
  run: { fps: 12, frames: 12 },
  jump: { fps: 4, frames: 4 },
  doubleJump: { fps: 4, frames: 6 },
  land: { fps: 8, frames: 3 },
  fall: { fps: 4, frames: 4 },
  dead: { fps: 8, frames: 8 },
} as const;

// Sprites
export const SPRITES = {
  player: {
    idle: {
      normal: "🟢", // Simple emoji for player
      left: "🟡",
      right: "🟢",
    },
    walk: {
      normal: "🔵",
      left: "🟣",
      right: "🔵",
    },
    run: {
      normal: "🟠",
      left: "🔴",
      right: "🟠",
    },
    jump: {
      normal: "🟣",
      left: "🟤",
      right: "🟣",
    },
  },
  tiles: {
    ground: "🟫",
    block: "🟧",
    question: "❓",
    brick: "🟥",
    pipe: "🟢",
    coin: "🪙",
    flag: "🚩",
    cloud: "☁️",
    hill: "⛰️",
  },
} as const;

// Level 1 map
export const LEVEL_1_MAP = [
  "                                                                                                    ",
  "                                                                                                    ",
  "                                                                                                    ",
  "                                                                                                    ",
  "                                                                                                    ",
  "                                                                                                    ",
  "                                                                                                    ",
  "                                                                                                    ",
  "                    ? ? ? ? ? ? ?                                                                  ",
  "               ?   BBBBBB   ?              G                                                       ",
  "      G         ?   BBBBBB   ?              G                                                       ",
  "        G       ?                  ?  G                                                 E    E     ",
  "          G    ?    Q             B    ?  G           Q                                E        E    ",
  "            G  ?  B    B         B       ?G         B   B                              E            E   ",
  "               ?   B    B         B        ?         B   B                             E              E  ",
  "          G     ?    B    B         B            G    B   B    B                    E                 E  ",
  "        G         ?    B    B   Q               G    B   B    B                   E                    E ",
  "               G    ?    B    B   B           G    B   B    B   B        G         E                      E",
  "                                   B         G    B   B    B   B     G         E                        E",
  "               G        G        B   B      G    B   B    B   B    G        E                          E",
  "               G        G        B    B    G    B   B    B   B   G        E                            E",
  "               G        G        B     B  G    B   B    B   B  G        E                              E",
  "                     E          E      E        E                  E                               ",
  "               G        G        G      G        E                  E                              ",
  "                                                                                                    ",
  "                   🚩                                                                                   ",
];

// Level configurations
export const LEVELS = [
  {
    id: 1,
    name: "Level 1 - World 1-1",
    map: LEVEL_1_MAP,
    tileSize: 32,
    width: 200,
    height: 20,
    startPos: { x: 50, y: 10 },
    endPos: { x: 180, y: 10 },
    enemyCount: 3,
  },
] as const;

// Score values
export const SCORE_VALUES = {
  COIN: 100,
  POINT: 50,
  GOOMBA: 100,
  FLAGPOLE: 1000,
  BONUS: 500,
  DEATH: -500,
} as const;

// Debug configuration
export const DEBUG_CONFIG = {
  SHOW_COLLISION_BOXES: false,
  SHOW_GRID: false,
  PLAYER_DEBUG: false,
  SLOW_MOTION: false,
} as const;

// Time configuration
export const TIME_CONFIG = {
  TICK_RATE: 16, // ms per frame (60fps)
  GRAVITY_TICKS: 4, // Physics updates per frame
  COLLISION_CHECKS: 5, // Collision checks per frame
} as const;

// Zone configuration
export const ZONES = {
  ground: { backgroundColor: "#87CEEB", groundColor: "#8B4513" },
  air: { backgroundColor: "#87CEEB", groundColor: "#C0C0C0" },
  underground: { backgroundColor: "#4B0082", groundColor: "#2F4F4F" },
  castle: { backgroundColor: "#1E3A8A", groundColor: "#8B4513" },
} as const;
