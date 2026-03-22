// Game constants for Super Mario

// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Mario physics constants
export const GRAVITY = 0.5; // Downward acceleration (px/frame²)
export const JUMP_VELOCITY = -10; // Upward velocity impulse (px/frame)
export const MOVE_SPEED = 5; // Horizontal movement speed (px/frame)
export const RUN_SPEED = 9; // Running speed when holding shift (px/frame)
export const FRICTION = 0.8; // Horizontal friction factor (0-1)
export const MAX_FALL_SPEED = 15; // Terminal velocity for falling

// Mario dimensions
export const TILE_SIZE = 40; // Standard tile/pixel block size
export const MARIO_WIDTH = 32;
export const MARIO_HEIGHT = 40;
export const MARIO_COLOR = "#FF0000"; // Red for Mario

// Ground constants
export const GROUND_HEIGHT = 80; // Height of ground platform from bottom
export const GROUND_COLOR = "#8B4513"; // Brown ground
export const GROUND_GRASS_COLOR = "#73BF2E"; // Grass on top

// Ground segment constants (for pits)
export const PIT_WIDTH = 120; // Width of pits (gap in ground)
export const MIN_GROUND_SEGMENT = 200; // Minimum width of ground segments

// Level design
export const LEVEL_WIDTH = 3000; // Total level width for scrolling
export const PIPE_WIDTH = 50;
export const PIPE_HEIGHT_BASE = 60; // Base pipe height
export const PIPE_COLOR = "#4CAF50"; // Green pipes
export const PIPE_GAP_MIN = 200; // Minimum gap between pipes
export const PIPE_GAP_MAX = 400; // Maximum gap between pipes
export const PIPE_HEIGHT_VARIATIONS = [60, 80, 100, 120]; // Different pipe heights

// Flagpole constants
export const FLAGPOLE_WIDTH = 10;
export const FLAGPOLE_HEIGHT = 250;
export const FLAG_WIDTH = 30;
export const FLAG_HEIGHT = 20;
export const FLAG_COLOR = "#FF0000"; // Red flag
export const FLAGPOLE_BASE_WIDTH = 30;
export const FLAGPOLE_BASE_HEIGHT = 20;
export const FLAGPOLE_BASE_COLOR = "#6B8E23"; // Olive green base
export const FLAGPOLE_COLOR = "#6B8E23"; // Olive green pole

// Platform constants (floating platforms)
export const PLATFORM_HEIGHT = 20;
export const PLATFORM_WIDTH_MIN = 60;
export const PLATFORM_WIDTH_MAX = 120;
export const PLATFORM_COLOR = "#DEB887"; // Burlywood (light brown)
export const PLATFORM_TOP_COLOR = "#73BF2E"; // Grass top

// Block constants (brick blocks, question blocks, hard blocks)
export const BLOCK_WIDTH = 40;
export const BLOCK_HEIGHT = 40;
export const BRICK_BLOCK_COLOR = "#CD853F"; // Peru (brick orange)
export const QUESTION_BLOCK_COLOR = "#FFD700"; // Gold
export const HARD_BLOCK_COLOR = "#D3D3D3"; // Light gray (used blocks)

// Mushroom power-up constants
export const MUSHROOM_WIDTH = 32;
export const MUSHROOM_HEIGHT = 32;
export const MUSHROOM_SPEED = 2; // Horizontal movement speed
export const MUSHROOM_LIFETIME = 7000; // 7 seconds before disappearing (milliseconds)
export const MUSHROOM_CAP_COLOR = "#FF0000"; // Red cap
export const MUSHROOM_STEM_COLOR = "#F5DEB3"; // Wheat (beige stem)
export const MUSHROOM_SPOT_COLOR = "#FFFFFF"; // White spots

// 1UP Mushroom constants
export const MUSHROOM_1UP_COLOR = "#00FF00"; // Bright green for 1UP
export const MUSHROOM_1UP_TEXT_COLOR = "#FFFFFF";

// Big Mario constants
export const BIG_MARIO_HEIGHT = 56; // Increased height when powered up
export const BIG_MARIO_WIDTH = 32; // Same width as small Mario

/**
 * Generate level layout with pipes that extend to screen bottom
 */
export function generateLevelPipes(): Array<{
  x: number;
  y: number;
  width: number;
  height: number;
}> {
  const pipes = [];
  let currentX = 400; // Start placing pipes after Mario's starting position

  while (currentX < LEVEL_WIDTH - 300) {
    // Random pipe height (visible portion)
    const visibleHeight =
      PIPE_HEIGHT_VARIATIONS[
        Math.floor(Math.random() * PIPE_HEIGHT_VARIATIONS.length)
      ];

    // Pipe extends from top of ground to screen bottom
    const y = CANVAS_HEIGHT - GROUND_HEIGHT - visibleHeight;
    const fullHeight = CANVAS_HEIGHT - GROUND_HEIGHT - y;

    pipes.push({
      x: currentX,
      y: y,
      width: PIPE_WIDTH,
      height: fullHeight,
    });

    // Random gap before next pipe
    const gap = PIPE_GAP_MIN + Math.random() * (PIPE_GAP_MAX - PIPE_GAP_MIN);
    currentX += PIPE_WIDTH + gap;
  }

  return pipes;
}

/**
 * Get flagpole position at the end of the level
 * Returns a complete Flagpole object with x, y, width, and height
 */
export function getFlagpolePosition() {
  const x = LEVEL_WIDTH - 100;
  const y = CANVAS_HEIGHT - GROUND_HEIGHT - FLAGPOLE_HEIGHT;
  return { x, y, width: FLAGPOLE_WIDTH, height: FLAGPOLE_HEIGHT };
}

// Enemy constants
export const ENEMY_WIDTH = 32;
export const ENEMY_HEIGHT = 32;
export const ENEMY_COLOR = "#8B4513"; // Brown enemies (like Goombas)
export const ENEMY_SPEED = 2;
export const ENEMY_WALK_RANGE = 150;

// Coin constants
export const COIN_WIDTH = 20;
export const COIN_HEIGHT = 20;
export const COIN_COLOR = "#FFD700"; // Gold color

/**
 * Generate enemies for the level
 * Places 3-5 enemies at strategic positions throughout level
 * Ensures enemies don't spawn inside pipes
 */
export function generateLevelEnemies(
  pipes: Array<{ x: number; y: number; width: number; height: number }>,
): Array<{
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  walkStart: number;
  walkRange: number;
  color: string;
  alive: boolean;
}> {
  const enemies = [];

  // Use the pipes passed in parameter (already generated)
  const pipePositions = pipes;

  // Strategic positions, adjusted to avoid pipe areas
  const potentialPositions = [
    550, 750, 950, 1200, 1450, 1650, 1850, 2100, 2350, 2550, 2750,
  ];

  // Place 3-5 enemies
  const numEnemies = 3 + Math.floor(Math.random() * 3);
  let positionIndex = 0;
  let enemiesPlaced = 0;

  while (
    enemiesPlaced < numEnemies &&
    positionIndex < potentialPositions.length
  ) {
    let walkStart = potentialPositions[positionIndex];

    // Check if this position overlaps with any pipe
    for (const pipe of pipePositions) {
      // Check if enemy spawn position would overlap with pipe
      if (
        walkStart < pipe.x + pipe.width + ENEMY_WIDTH &&
        walkStart + ENEMY_WIDTH > pipe.x
      ) {
        // Move position to right of pipe with buffer
        walkStart = pipe.x + pipe.width + 50;
      }
    }

    // Also check patrol range doesn't overlap with pipes
    for (const pipe of pipePositions) {
      // Check if the entire patrol range overlaps with pipe
      if (
        walkStart - ENEMY_WALK_RANGE < pipe.x + pipe.width &&
        walkStart + ENEMY_WALK_RANGE > pipe.x
      ) {
        // Adjust walkStart so patrol range doesn't include this pipe
        // Either place patrol entirely to left or right of pipe
        if (walkStart < pipe.x) {
          // Patrol is to left of pipe - adjust to stay left
          walkStart = pipe.x - ENEMY_WALK_RANGE - 20;
        } else {
          // Patrol is to right of pipe - adjust to stay right
          walkStart = pipe.x + pipe.width + ENEMY_WALK_RANGE + 20;
        }
      }
    }

    const y = CANVAS_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT;

    enemies.push({
      x: walkStart,
      y: y,
      width: ENEMY_WIDTH,
      height: ENEMY_HEIGHT,
      velocityX: ENEMY_SPEED,
      walkStart: walkStart,
      walkRange: ENEMY_WALK_RANGE,
      color: ENEMY_COLOR,
      alive: true,
    });

    enemiesPlaced++;
    positionIndex++;
  }

  return enemies;
}

/**
 * Generate coins for the level
 * Places coins above pipes and at strategic locations
 */
export function generateLevelCoins(): Array<{
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}> {
  const coins = [];

  // Place coins at strategic locations throughout level
  const coinPositions = [
    { x: 300, y: 400 },
    { x: 500, y: 420 },
    { x: 900, y: 400 },
    { x: 1300, y: 420 },
    { x: 1700, y: 400 },
    { x: 2000, y: 420 },
    { x: 2300, y: 400 },
    { x: 2600, y: 420 },
  ];

  for (const pos of coinPositions) {
    coins.push({
      x: pos.x,
      y: pos.y,
      width: COIN_WIDTH,
      height: COIN_HEIGHT,
      collected: false,
    });
  }

  return coins;
}

// Game states
export enum GameState {
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
}

// Colors
export const COLORS = {
  SKY_TOP: "#5c94fc",
  SKY_BOTTOM: "#87ceeb",
  MARIO_RED: "#FF0000",
  MARIO_OVERALL: "#4169E1",
  GROUND_BROWN: "#8B4513",
  GROUND_GRASS: "#73BF2E",
  PIPE_GREEN: "#4CAF50",
  PIPE_DARK_GREEN: "#2E7D32",
  BRICK_ORANGE: "#CD853F",
  QUESTION_BLOCK: "#FFD700",
} as const;

// UI constants
export const MOBILE_HEADER_HEIGHT = 40; // Height of mobile header
export const PAUSE_BUTTON_SIZE = 32; // Size of pause button

// Time limit constants
export const LEVEL_1_1_TIME_LIMIT = 400; // 6:40 for level 1-1
export const LEVEL_DEFAULT_TIME_LIMIT = 400; // Default fallback

// Audio constants
export const AUDIO_VOLUME = 0.3; // Default volume (30%)
export const AUDIO_ENABLED = true; // Default audio state
