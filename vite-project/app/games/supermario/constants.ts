// Game constants for Super Mario

// Screen configuration
export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 480;
export const PIXEL_SCALE = 1;

// Physics constants
// Gravity
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
} as const;

// Animation frame counts
export const ANIMATION_FRAMES = {
  idle: 6,
  walk: 8,
  run: 12,
  jump: 4,
  duck: 8,
};

// Touch controls for mobile
export const TOUCH_CONTROLS = {
  UP: "upBtn",
  DOWN: "downBtn",
  LEFT: "leftBtn",
  RIGHT: "rightBtn",
  JUMP: "jumpBtn",
  RUN: "runBtn",
  PAUSE: "pauseBtn",
} as const;
