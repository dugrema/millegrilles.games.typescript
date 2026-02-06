// Game constants for Flappy Bird

// Canvas dimensions
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

// Bird constants
export const BIRD_SIZE = 40; // Width and height of bird
export const BIRD_COLOR = "#FFD700"; // Yellow bird
export const GRAVITY = 0.5; // Downward acceleration (px/frame²)
export const JUMP_VELOCITY = -9; // Upward velocity impulse (px/frame)
export const BIRD_ROTATION = 0.15; // Rotation speed (radians per frame)

// Pipe constants
export const PIPE_WIDTH = 60;
export const PIPE_GAP = 160; // Space between top and bottom pipes
export const PIPE_MIN_HEIGHT = 100;
export const PIPE_MAX_HEIGHT = 300;
export const PIPE_SPAWN_X = CANVAS_WIDTH;
export const PIPE_SPAWN_DISTANCE = 300; // Distance between pipe pairs
export const BASE_PIPE_SPEED = 3; // Base horizontal pipe speed

// Game speed control
export const START_SPEED = 1.0;
export const MAX_SPEED = 3.0;
export const GAME_SPEED_INCREASE_INTERVAL = 100; // Frames between speed increases

// Game states
export enum GameState {
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
}

// Colors
export const COLORS = {
  SKY_TOP: "#70c5ce",
  SKY_BOTTOM: "#4fc3f7",
  GROUND: "#ded895",
  GROUND_GRASS: "#73bf2e",
  PIPE_GREEN: "#73bf2e",
  PIPE_DARK_GREEN: "#2e7d32",
  PIPE_LIGHT_GREEN: "#aed581",
  BIRD_BODY: "#FFD700",
  PIPE_BORDER: "#2e7d32",
} as const;

// Audio constants
export const AUDIO_CONSTANTS = {
  JUMP_FREQUENCY: 440, // Hz for jump sound
  SCORE_FREQUENCY: 880, // Hz for score sound
  COLLISION_FREQUENCY: 150, // Hz for collision sound
  JUMP_DURATION: 0.1, // seconds
  SCORE_DURATION: 0.15, // seconds
  COLLISION_DURATION: 0.3, // seconds
} as const;
