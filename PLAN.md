# Super Mario Implementation Plan - Current phase

## Overview
This plan outlines the step-by-step implementation of a Super Mario clone game using React 19, TypeScript, and styled-components. The implementation follows the existing game patterns (Minesweeper, Tetris, Snake, Flappy Bird).

---
# Super Mario Game Phase 1 Implementation Plan

Based on my exploration, here's what I need to do:

## Current State Analysis
- ✅ Super Mario folder exists with complete implementation
- ✅ types.ts created with complete TypeScript interfaces
- ✅ constants.ts expanded with physics, movement, input keys, sprites, levels
- ✅ levels/level1.ts created with tile-based map
- ✅ index.tsx Provider with SoundManager, state management, and game loop
- ✅ All UI components created (ScoreDisplay, LivesDisplay, ControlsHelp, GameOverOverlay, LevelIndicator, etc.)
- ✅ Game.tsx with canvas rendering, player rendering, and level/world rendering
- ⚠️ Route component created but has bug: START GAME button onClick handler is empty
- ⚠️ RESTART key handler incomplete: doesn't start game when status is "start"
- ❌ Testing & Quality phase not completed
- Pattern follows existing games (Minesweeper, Tetris, Snake, Flappy Bird)

## Phase 1 Goals ✅ MOSTLY COMPLETED (Need Button Fix & Testing)

Phase 1 has successfully created the foundational structure and basic gameplay mechanics for Super Mario:

1. ✅ **Core Infrastructure** - Type definitions (types.ts), constants with physics/movement/sprites/levels, tile-based level map
2. ✅ **Game State & Provider** - Provider implementation with SoundManager, player physics (gravity, jumping), collision detection, game loop with requestAnimationFrame
3. ✅ **UI Components** - ScoreDisplay, LivesDisplay, ControlsHelp, GameOverOverlay, LevelIndicator, ScoreLabel, CoinIcon
4. ✅ **Main Game Component** - Canvas rendering, player rendering with animation states, level/world rendering, keyboard input handling
5. ⚠️ **Integration & Polish** - Route component created, but START GAME button onClick handler is empty and RESTART key doesn't start game from 'start' status
6. ❌ **Testing & Quality** - Not started (TypeScript compilation, gameplay testing, responsive design, audio playback)

## Tasks for TODO.md
I need to create a comprehensive TODO.md with the following sections:

1. **Core Infrastructure** - Type definitions, constants (expand existing)
2. **Game State & Provider** - Context, state management, game logic
3. **Player System** - Movement, physics, animation
4. **Level/World System** - Map definition, collision detection
5. **Game Component** - Main game view, rendering
6. **UI Components** - Score, lives, level display
7. **Audio & Polish** - Sound effects, basic polish
8. **Routing Integration** - Route setup

For each task, I'll break down specific sub-tasks with clear acceptance criteria.


## Assistant

<thinking>
Now I'll create a comprehensive implementation plan for Phase 1 of Super Mario. This should be detailed and include all the tasks that need to be completed, organized by logical sections.

Let me structure this as a proper plan with the following sections:
1. Overview
2. Phase 1 Goals
3. Detailed Task List for TODO.md
4. Prerequisites/Requirements
5. Success Criteria

The TODO.md should have clear, actionable items with checkboxes for tracking progress.
</thinking>

# Super Mario Game Phase 1 Implementation Plan

## Overview
Phase 1 focuses on establishing the foundational structure and core gameplay mechanics for the Super Mario game, following the established pattern from other games in the project.

## Phase 1 Goals
- Create complete type definitions for the game
- Implement the Provider pattern with game state management
- Enable basic player movement and physics
- Define level structure and collision detection
- Create basic rendering components
- Implement game UI (score, lives, controls)

## Detailed Implementation Plan

### Project Structure
```
vite-project/app/games/supermario/
├── types.ts                 # Type definitions
├── constants.ts             # Expanded game constants
├── index.tsx                # Provider component (game logic)
├── Game.tsx                 # Main game component
├── components/              # UI component directory
│   ├── ScoreDisplay.tsx
│   ├── LivesDisplay.tsx
│   ├── ControlsHelp.tsx
│   └── GameOverOverlay.tsx
└── levels/                  # Level/world definitions
    └── level1.ts           # First level structure
```

### Phase 1 Task Breakdown

**1. Type Definitions (types.ts) ✅ DONE**
- [x] Define base interfaces (Position, Dimensions, Player, Tile, CollisionBox)
- [x] Define Level interface with map structure
- [x] Define Game state interfaces
- [x] Define Input state interfaces
- [x] Define Animation and Sprite interfaces

**2. Constants (constants.ts) ✅ DONE**
- [x] Keep existing physics constants
- [x] Add input key bindings
- [x] Add sprite/image path constants
- [x] Add animation timing constants
- [x] Add level map templates

**3. Level System ✅ DONE**
- [x] Create level definition format (tile-based map)
- [x] Build Level 1 map with platforms, ground, blocks
- [x] Implement map parser
- [ ] Add level switching logic (Phase 2+)

**4. Provider Implementation (index.tsx) ✅ DONE**
- [x] Initialize AudioContext for sound effects
- [x] Create SoundManager class (basic sounds)
- [x] Build Minesweeper-style Provider structure
- [x] Implement game state management
- [x] Handle keyboard input
- [x] Manage player physics (gravity, movement)
- [x] Implement collision detection
- [x] Manage score and lives
- [ ] Fix START GAME button onClick handler
- [ ] Fix RESTART key to start game from 'start' status

**5. Player System ✅ DONE**
- [x] Create Player interface and initial state
- [x] Implement horizontal movement logic
- [x] Implement vertical movement (jump)
- [x] Add gravity and physics
- [x] Add animation state management
- [x] Implement double jump capability (per existing constants)

**6. Main Game Component (Game.tsx) ✅ DONE**
- [x] Create game container with styling
- [x] Implement canvas-based rendering (or styled DOM)
- [x] Render player with animation
- [x] Render level/background
- [x] Render UI overlay
- [x] Handle status checks (only render when status === "playing")

**7. UI Components (components/) ✅ DONE**
- [x] ScoreDisplay component
- [x] LivesDisplay component
- [x] ControlsHelp component
- [x] GameOverOverlay component
- [x] Level indicator component

**8. Input Handling ✅ DONE**
- [x] Map keyboard inputs (arrow keys, space, shift, ESC)
- [ ] Handle mobile touch controls (Phase 8)
- [x] Manage input state during game

**9. Audio Implementation ✅ DONE**
- [x] Implement sound effects (jump, collect coin, death, win)
- [x] Create SoundManager class with methods
- [x] Add basic audio for Phase 1

**10. Game Loop ✅ DONE**
- [x] Implement animation frame loop
- [x] Handle game state transitions
- [ ] Implement pause/resume functionality
- [ ] Add game over/win conditions

**11. Routing Integration ✅ DONE**
- [x] Export Provider from supermario directory
- [x] Create route component in routes/games/
- [ ] Test game integration (pending button fix)
- [ ] Ensure proper context wrapping
- [ ] Fix button to start the game
- [ ] Test responsive design

### Success Criteria ✅ MOSTLY ACHIEVED (Need Testing & Button Fix)

**Completed:**
- ✅ Basic Mario character can move left/right
- ✅ Mario can jump and perform double jump
- ✅ Basic level with platforms and ground loads correctly
- ✅ Collision detection prevents falling through the world
- ✅ Score and lives display correctly
- ✅ Game controls are responsive (keyboard input working)
- ✅ Game can be accessed via routing

**Pending:**
- ⚠️ START GAME button click handler needs to call loadLevel()
- ⚠️ RESTART key needs to start game when status is "start"
- ❌ Game state transitions need testing
- ❌ No TypeScript compilation errors (needs verification)
- ❌ Basic audio plays for key actions (needs testing)

### Acceptance Criteria by Task ✅ MOSTLY ACHIEVED
**Movement:**
- [x] Player moves at maxSpeed with smooth acceleration
- [x] Jump launches player upward with GRAVITY physics
- [x] Double jump works when in air
- [x] Player accelerates/decelerates properly

**Collision:**
- [x] Player collides with level boundaries
- [x] Player collides with platforms (can stand on them)
- [x] Player collides with blocks (can break some)
- [ ] Fall detection triggers game over (needs testing)

**Graphics:**
- [x] Player rendered with simple shape/sprite
- [x] Background rendered
- [x] Level tiles rendered
- [x] UI elements visible

**Game Flow:**
- [x] Game starts in start state
- [x] Game enters playing state when started (via loadLevel)
- [x] Game can be paused/resumed (via ESC key)
- [ ] Game over screen appears on death (needs testing)
- [ ] Score updates correctly (needs testing)

### Notes 📝 PHASE 1 UPDATE - 2026-02-20
- ✅ Followed Minesweeper pattern for consistency
- ✅ Used existing constants as base, extended as needed
- ✅ Phase 1 core mechanics mostly complete:
  - Types, constants, level system ✅
  - Provider with SoundManager, physics, collision ✅
  - All UI components ✅
  - Main game component with canvas rendering ✅
  - Keyboard input handling ✅
  
- ⚠️ PENDING FIXES:
  - START GAME button onClick handler is empty - needs to call loadLevel()
  - RESTART key doesn't start game when status is "start" - needs input handler fix
  - Game state transitions need testing
  - Basic gameplay loop needs testing
  
- ❌ TESTING & QUALITY NOT COMPLETED:
  - TypeScript compilation verification
  - Movement and collision testing
  - Game flow testing
  - Responsive design testing
  - Audio playback testing
- Audio context should be handled carefully (requires user interaction)
- Touch controls mentioned in existing constants should be planned for later phase

## User (checkpoint)

Create a detailed implementation plan with code.

## Assistant

<thinking>
The user wants me to create a more detailed implementation plan with actual code examples. They want to see specific code structure, patterns, and the implementation details that would go into each file. This should be much more detailed than the previous plan, with actual code snippets showing how each component should be built.

Let me create a comprehensive implementation plan that includes:
1. Full file structure
2. Detailed code for each file
3. Step-by-step implementation guidance
4. Code patterns and best practices
5. Specific implementation details for each component
6. Error handling considerations
7. Testing strategies

I'll use the think tool first to organize this properly, then provide the detailed plan with code examples.
</thinking>

**Tool Call: Thinking**
Status: Completed


# Super Mario Game Phase 1 - Detailed Implementation Plan with Code

## File Structure

```
vite-project/app/games/supermario/
├── types.ts                 # Complete type definitions
├── constants.ts             # Expanded constants with code examples
├── index.tsx                # Provider with complete implementation
├── Game.tsx                 # Main game component
├── components/              # UI components
│   ├── ScoreDisplay.tsx
│   ├── LivesDisplay.tsx
│   ├── ControlsHelp.tsx
│   ├── GameOverOverlay.tsx
│   └── LevelIndicator.tsx
└── levels/                  # Level definitions
    └── level1.ts           # Level map with tile data
```

## Implementation Tasks by File

### 1. types.ts - Complete Type Definitions

This file should define all the interfaces needed for the game state, player, level, and interactions.

### 2. constants.ts - Expanded Constants

Add specific values for keys, sprite paths, animation timings, and level templates.

### 3. index.tsx - Provider Implementation

Full implementation with:
- Context creation
- Sound manager with specific methods
- Player state management
- Physics engine
- Collision detection
- Game loop

### 4. Game.tsx - Main Component

Canvas-based or DOM-based rendering with:
- Game loop
- Rendering logic
- Event handling

### 5. components/*.tsx - UI Components

Each component with specific functionality and styling.

### 6. levels/level1.ts - Level Data

Tile map format and level structure.

## Code Examples per File

For each file, I'll provide:
- Complete file content
- Implementation details
- Best practices
- Comments explaining key logic

## Step-by-Step Guide

1. Start with types.ts (foundation)
2. Expand constants.ts
3. Create level1.ts
4. Build index.tsx (game logic core)
5. Create components
6. Build Game.tsx (rendering)
7. Integrate with routing
8. Test and debug

Let me create a detailed plan with actual code for each file.


## Assistant

<thinking>
Now I'll create a detailed implementation plan with actual code examples. I should provide:

1. File by file breakdown with complete code
2. Detailed implementation guidance
3. Specific patterns and examples
4. Step-by-step approach
5. Code explanations

Let me structure this as a comprehensive TODO.md-style plan with actual code that can be used as a reference.

I'll organize it by:
1. File structure overview
2. Detailed implementation for each file with code examples
3. Step-by-step execution guide
4. Testing checklist
5. Common patterns and best practices

Let me start creating the detailed plan.
</thinking>

# Super Mario Game Phase 1 - Detailed Implementation Plan with Code

## File Structure Overview

```
vite-project/app/games/supermario/
├── types.ts                 # Complete type definitions and interfaces
├── constants.ts             # Expanded constants with key bindings and sprites
├── index.tsx                # Provider component with game logic
├── Game.tsx                 # Main game component with rendering
├── components/              # UI component directory
│   ├── ScoreDisplay.tsx
│   ├── LivesDisplay.tsx
│   ├── ControlsHelp.tsx
│   ├── GameOverOverlay.tsx
│   └── LevelIndicator.tsx
└── levels/                  # Level/world definitions
    └── level1.ts           # Level 1 tile-based map data
```

## Detailed File Implementation Guide

### File 1: `types.ts`

**Purpose**: Define all TypeScript interfaces for type safety

**Implementation**:

```typescript
// vite-project/app/games/supermario/types.ts

// ==================== Core Types ====================

// Basic position and dimension
export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

// Player related types
export type PlayerDirection = "left" | "right" | "still";

export type PlayerState = 
  | "idle"      | "walk"    | "run"    | "jump" 
  | "doubleJump" | "land"    | "fall"   | "dead";

export type PlayerAnimation = "idle" | "walk" | "run" | "jump";

// Tile types for level mapping
export type TileType = 
  | "empty"      | "ground"   | "block"    | "question" 
  | "brick"      | "pipe"     | "coin"     | "coin_item"
  | "goomba"     | "flag"     | "flagpole" | "cloud"
  | "hill"       | "pipe_l"   | "pipe_r";

// Collision types
export type CollisionType = "none" | "platform" | "block" | "coin" | "enemy";

// ==================== Player Types ====================

export interface Player {
  // Position
  position: Position;
  
  // Dimensions
  dimensions: Dimensions;
  
  // Velocity
  velocity: {
    x: number;
    y: number;
  };
  
  // Movement flags
  isGrounded: boolean;
  isFacingLeft: boolean;
  
  // State
  state: PlayerState;
  animation: PlayerAnimation;
  animationFrame: number;
  
  // Game stats
  score: number;
  lives: number;
  coins: number;
}

export interface PlayerInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  run: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
  runHeld: boolean;
}

// ==================== Level Types ====================

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  solid: boolean;
  animated?: boolean;
  value?: number; // For question blocks
  active?: boolean; // For breakable blocks
}

export interface Level {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: Tile[][];
  startPos: Position;
  endPos: Position;
  enemyCount: number;
}

// ==================== Game State Types ====================

export type GameStatus = "idle" | "playing" | "paused" | "gameover" | "won";

export interface GameState {
  status: GameStatus;
  currentLevel: number;
  score: number;
  lives: number;
  coins: number;
  time: number;
}

// ==================== Context Types ====================

export type SuperMarioContextType = {
  state: GameState & Player;
  input: PlayerInput;
  player: Player;
  
  // Actions
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
  startJump: () => void;
  continueJump: () => void;
  stopJump: () => void;
  runStart: () => void;
  runStop: () => void;
  
  // Level actions
  loadLevel: (levelId: number) => void;
  restartLevel: () => void;
  
  // Game actions
  pauseGame: () => void;
  resumeGame: () => void;
  handleInput: (key: string, pressed: boolean) => void;
};
```

---

### File 2: `constants.ts`

**Purpose**: Define all game constants, key bindings, and level templates

**Implementation**:

```typescript
// vite-project/app/games/supermario/constants.ts

// ==================== Screen & Canvas ====================

export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 480;
export const PIXEL_SCALE = 1;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 480;

// ==================== Player Constants ====================

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 32;

// Gravity
export const GRAVITY = {
  acceleration: 0.5,
  velocity: 12,
  friction: 0.9,
};

// Jump
export const JUMP = {
  force: -12,
  height: 150,
  doubleJumpAvailable: true,
  gravityCompensation: 1.1,
};

// Movement
export const MOVEMENT = {
  acceleration: 0.5,
  maxSpeed: 5,
  runSpeed: 8,
  runBoost: 3,
  friction: 0.8,
  airResistance: 0.95,
};

// Run boost
export const RUN_BOOST = {
  decayRate: 0.5,
  rechargeRate: 0.2,
  maxMeter: 100,
};

// ==================== Key Bindings ====================

export const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  JUMP: " ",
  RUN: "ShiftLeft",
  PAUSE: "Escape",
  RESTART: "KeyR",
} as const;

export const KEY_DESCRIPTIONS = {
  ArrowLeft: "Move Left",
  ArrowRight: "Move Right",
  ArrowUp: "Jump / Double Jump",
  ArrowDown: "Crouch",
  " ": "Jump / Double Jump",
  ShiftLeft: "Run",
  Escape: "Pause / Resume",
  "KeyR": "Restart Level",
} as const;

export const MOBILE_CONTROLS = {
  upBtn: "Tap for jump/double jump",
  downBtn: "Crouch",
  leftBtn: "Move Left",
  rightBtn: "Move Right",
  jumpBtn: "Hold to jump",
  runBtn: "Hold to run",
  pauseBtn: "Pause game",
} as const;

// ==================== Level Configuration ====================

export const LEVEL_CONFIG = {
  TILE_SIZE: 32,
  LEVEL_WIDTH: 20, // tiles
  LEVEL_HEIGHT: 15, // tiles
  TIME_LIMIT: 300, // seconds
  MAX_LIVES: 3,
  COINS_PER_LIFE: 100,
} as const;

// ==================== Tile Types Configuration ====================

export const TILE_TYPES = {
  empty: { solid: false, animated: false, color: "transparent" },
  ground: { solid: true, animated: false, color: "#654321" },
  block: { solid: true, animated: false, color: "#8B4513" },
  question: { solid: true, animated: false, color: "#FFD700" },
  brick: { solid: true, animated: false, color: "#CD853F" },
  pipe: { solid: true, animated: false, color: "#228B22" },
  coin: { solid: false, animated: true, color: "#FFD700" },
  coin_item: { solid: false, animated: true, color: "#FFD700" },
  goomba: { solid: false, animated: true, color: "#8B4513" },
  flag: { solid: false, animated: false, color: "#228B22" },
  flagpole: { solid: true, animated: false, color: "#228B22" },
  cloud: { solid: false, animated: true, color: "#F0F8FF" },
  hill: { solid: false, animated: true, color: "#90EE90" },
  pipe_l: { solid: true, animated: false, color: "#228B22" },
  pipe_r: { solid: true, animated: false, color: "#228B22" },
} as const;

// ==================== Animation Constants ====================

export const ANIMATION_SPEED = {
  idle: { fps: 6, frames: 8 },
  walk: { fps: 8, frames: 12 },
  run: { fps: 12, frames: 8 },
  jump: { fps: 4, frames: 4 },
  doubleJump: { fps: 6, frames: 4 },
  land: { fps: 6, frames: 6 },
  fall: { fps: 4, frames: 4 },
  dead: { fps: 6, frames: 10 },
} as const;

// ==================== Sprite Configuration ====================

export const SPRITES = {
  // Player colors for simple implementation (will be replaced with images later)
  player: {
    idle: {
      normal: "#FF0000",      // Red
      left: "#FF0000",
      right: "#FF0000",
    },
    walk: {
      normal: "#FF6347",      // Tomato
      left: "#FF6347",
      right: "#FF6347",
    },
    run: {
      normal: "#DC143C",      // Crimson
      left: "#DC143C",
      right: "#DC143C",
    },
    jump: {
      normal: "#FF4500",      // OrangeRed
      left: "#FF4500",
      right: "#FF4500",
    },
  },
  
  // Tile colors
  tiles: {
    ground: "#654321",
    block: "#8B4513",
    question: "#FFD700",
    brick: "#CD853F",
    pipe: "#228B22",
    coin: "#FFD700",
    flag: "#228B22",
    cloud: "#F0F8FF",
    hill: "#90EE90",
  },
} as const;

// ==================== Level Maps ====================

// Level 1: Basic platforming level
// . = empty space, # = ground, ? = question block, B = brick block
// P = pipe, C = coin, G = goomba, ^ = start, F = flag end
export const LEVEL_1_MAP = [
  "                                                                                ",
  "                                                                                ",
  "                                                                                ",
  "                                                                                ",
  "                                      ?                                       ",
  "                                   ? C ?                                       ",
  "                                  B   B                                         ",
  "           ?              P       B   B   B     G                                 ",
  "                                   B   B   B    |                                ",
  "          P                    B   B   B   B   |                                ",
  "           ?                  B   B   B   B   |                                ",
  "               C  G      C              C        |      G          F            ",
  "                                C            C   |        |        ^            ",
  "         #                      #              #  |        |        |            ",
  "         #                      #              # |        |        |            ",
  "         #                      #              ##|        |        |            ",
];

export const LEVELS = {
  1: {
    id: "1-1",
    name: "Overworld 1-1",
    map: LEVEL_1_MAP,
    tileSize: 32,
    width: 20,
    height: 15,
    startPos: { x: 64, y: 32 },
    endPos: { x: 640, y: 32 },
    enemyCount: 3,
  },
} as const;

// ==================== Score & Progress ====================

export const SCORE_VALUES = {
  COIN: 100,
  POINT: 50,
  GOOMBA: 100,
  FLAGPOLE: 1000,
  BONUS: 500,
  DEATH: 0,
} as const;

export const STORAGE_KEYS = {
  HIGH_SCORE: "supermario_high_score",
  LEVEL_PROGRESS: "supermario_level_progress",
  COINS_COLLECTED: "supermario_coins_collected",
} as const;

// ==================== Debug & Development ====================

export const DEBUG_CONFIG = {
  SHOW_COLLISION_BOXES: true,
  SHOW_GRID: false,
  PLAYER_DEBUG: false,
  SLOW_MOTION: false,
} as const;

// ==================== Time Constants ====================

export const TIME_CONFIG = {
  TICK_RATE: 60, // frames per second
  GRAVITY_TICKS: 3, // gravity applied every N frames
  COLLISION_CHECKS: 4, // N times per frame
} as const;
```

---

### File 3: `levels/level1.ts`

**Purpose**: Define Level 1 with tile-based map data

**Implementation**:

```typescript
// vite-project/app/games/supermario/levels/level1.ts

import type { Level } from "../types";
import { TILE_TYPES } from "../constants";

export const LEVEL_1: Level = {
  id: "1-1",
  name: "Overworld 1-1",
  width: 20,
  height: 15,
  tileSize: 32,
  startPos: { x: 64, y: 32 },
  endPos: { x: 640, y: 32 },
  enemyCount: 3,
  tiles: (function() {
    // Parse the level map string into tile objects
    const map: string[] = [
      "                                                                                ",
      "                                                                                ",
      "                                                                                ",
      "                                                                                ",
      "                                      ?                                       ",
      "                                   ? C ?                                       ",
      "                                  B   B                                         ",
      "           ?              P       B   B   B     G                                 ",
      "                                   B   B   B    |                                ",
      "          P                    B   B   B   B   |                                ",
      "           ?                  B   B   B   B   |                                ",
      "               C  G      C              C        |      G          F            ",
      "                                C            C   |        |        ^            ",
      "         #                      #              #  |        |        |            ",
      "         #                      #              # |        |        |            ",
      "         #                      #              ##|        |        |            ",
    ];
    
    const tiles: any[][] = [];
    
    for (let row = 0; row < map.length; row++) {
      const rowTiles: any[] = [];
      const mapRow = map[row];
      
      for (let col = 0; col < mapRow.length; col++) {
        const char = mapRow[col];
        
        if (char === "#") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "ground" as const,
            solid: true,
            animated: false,
          });
        } else if (char === "?") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "question" as const,
            solid: true,
            animated: false,
            value: 100, // Coin worth
          });
        } else if (char === "B") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "block" as const,
            solid: true,
            animated: false,
          });
        } else if (char === "P") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "pipe" as const,
            solid: true,
            animated: false,
          });
        } else if (char === "C") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "coin_item" as const,
            solid: false,
            animated: true,
          });
        } else if (char === "G") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "goomba" as const,
            solid: false,
            animated: true,
          });
        } else if (char === "^") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "flagpole" as const,
            solid: true,
            animated: false,
          });
        } else if (char === "F") {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "flag" as const,
            solid: false,
            animated: false,
          });
        } else {
          rowTiles.push({
            x: col * 32,
            y: row * 32,
            type: "empty" as const,
            solid: false,
            animated: false,
          });
        }
      }
      
      tiles.push(rowTiles);
    }
    
    return tiles;
  })(),
};
```

---

### File 4: `components/ScoreDisplay.tsx`

**Purpose**: Display current score and coins

**Implementation**:

```typescript
// vite-project/app/games/supermario/components/ScoreDisplay.tsx

import styled from "styled-components";

// Styled components for score display
const ScoreContainer = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 24px;
  font-family: "Courier New", monospace;
  font-weight: bold;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ScoreItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScoreLabel = styled.span`
  font-size: 16px;
  color: #ddd;
`;

const ScoreValue = styled.span`
  color: #FFD700;
`;

const CoinIcon = styled.span`
  font-size: 24px;
`;

// Score Display Component
export default function ScoreDisplay({ 
  score, 
  coins 
}: { 
  score: number; 
  coins: number 
}) {
  return (
    <ScoreContainer>
      <ScoreItem>
        <CoinIcon>🪙</CoinIcon>
        <div>
          <ScoreLabel>COINS</ScoreLabel>
          <ScoreValue>{coins}</ScoreValue>
        </div>
      </ScoreItem>
      <ScoreItem>
        <ScoreLabel>SCORE</ScoreLabel>
        <ScoreValue>{score.toString().padStart(8, '0')}</ScoreValue>
      </ScoreItem>
    </ScoreContainer>
  );
}
```

---

### File 5: `components/LivesDisplay.tsx`

**Purpose**: Display current lives

**Implementation**:

```typescript
// vite-project/app/games/supermario/components/LivesDisplay.tsx

import styled from "styled-components";

const LivesContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  font-family: "Courier New", monospace;
  font-weight: bold;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const HeartIcon = styled.span`
  font-size: 28px;
`;

// Lives Display Component
export default function LivesDisplay({ 
  lives 
}: { 
  lives: number 
}) {
  return (
    <LivesContainer>
      <HeartIcon>❤️</HeartIcon>
      <span>{lives}</span>
    </LivesContainer>
  );
}
```

---

### File 6: `components/ControlsHelp.tsx`

**Purpose**: Display controls help

**Implementation**:

```typescript
// vite-project/app/games/supermario/components/ControlsHelp.tsx

import styled from "styled-components";

const ControlsContainer = styled.div`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 24px;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  font-size: 14px;
  color: white;
  z-index: 10;
`;

const KeyHint = styled.code`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  color: #FFD700;
`;

const ControlsHelp = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    font-size: 12px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlLabel = styled.span`
  color: #ddd;
`;

// Controls Help Component
export default function ControlsHelp() {
  return (
    <ControlsContainer>
      <ControlsHelp>
        <ControlGroup>
          <ControlLabel>Controls:</ControlLabel>
          <KeyHint>← →</KeyHint> Move • 
          <KeyHint>Space</KeyHint> Jump
        </ControlGroup>
        <ControlGroup>
          <ControlLabel>Run:</ControlLabel>
          <KeyHint>Shift</KeyHint> Hold
        </ControlGroup>
        <ControlGroup>
          <ControlLabel>Pause:</ControlLabel>
          <KeyHint>Esc</KeyHint>
        </ControlGroup>
        <ControlGroup>
          <ControlLabel>Restart:</ControlLabel>
          <KeyHint>R</KeyHint>
        </ControlGroup>
      </ControlsHelp>
    </ControlsContainer>
  );
}
```

---

### File 7: `components/GameOverOverlay.tsx`

**Purpose**: Display game over screen

**Implementation**:

```typescript
// vite-project/app/games/supermario/components/GameOverOverlay.tsx

import styled from "styled-components";

const Overlay = styled.div<{ isWin: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const GameOverTitle = styled.h1<{ isWin: boolean }>`
  font-size: 64px;
  font-weight: bold;
  color: ${props => props.isWin ? '#4CAF50' : '#FF4500'};
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 32px;
`;

const FinalScore = styled.div`
  font-size: 32px;
  font-family: "Courier New", monospace;
  color: white;
  margin-bottom: 16px;
`;

const ScoreLabel = styled.span`
  color: #FFD700;
`;

const Instructions = styled.p`
  font-size: 24px;
  color: #ddd;
  margin-top: 32px;
`;

// Game Over / Win Overlay Component
export default function GameOverOverlay({ 
  isWin, 
  score, 
  onRestart 
}: { 
  isWin: boolean; 
  score: number;
  onRestart: () => void;
}) {
  return (
    <Overlay isWin={isWin}>
      <GameOverTitle isWin={isWin}>
        {isWin ? "YOU WIN!" : "GAME OVER"}
      </GameOverTitle>
      
      <FinalScore>
        <ScoreLabel>SCORE: {score}</ScoreLabel>
      </FinalScore>
      
      <Instructions>
        Press {isWin ? "Space" : "R"} to Restart
      </Instructions>
    </Overlay>
  );
}
```

---

### File 8: `components/LevelIndicator.tsx`

**Purpose**: Display current level name

**Implementation**:

```typescript
// vite-project/app/games/supermario/components/LevelIndicator.tsx

import styled from "styled-components";

const LevelContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 50%;
  transform: translateX(50%);
  font-family: "Courier New", monospace;
  font-size: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const LevelLabel = styled.span`
  color: #FFD700;
`;

// Level Indicator Component
export default function LevelIndicator({ 
  levelName 
}: { 
  levelName: string 
}) {
  return (
    <LevelContainer>
      <LevelLabel>LEVEL: {levelName}</LevelLabel>
    </LevelContainer>
  );
}
```

---

### File 9: `index.tsx` (Provider Implementation)

**Purpose**: Main Provider with game logic, physics, and state management

**Implementation**:

```typescript
// vite-project/app/games/supermario/index.tsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import type {
  Player,
  PlayerInput,
  GameState,
  Level,
  CollisionType,
  CollisionType,
} from "./types";
import {
  GRAVITY,
  JUMP,
  MOVEMENT,
  LEVEL_1,
  TILE_TYPES,
  SCORE_VALUES,
  DEBUG_CONFIG,
  TIME_CONFIG,
  TILE_SIZE: TILE_SIZE,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from "./constants";

interface SuperMarioGameProviderProps {
  children: React.ReactNode;
}

// ==================== Sound Manager ====================

class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return this.audioContext;
  }

  playTone(frequency: number, duration: number, type: OscillatorType = "sine") {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration,
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  playJump() {
    this.playTone(440, 0.15, "sine");
    setTimeout(() => this.playTone(554, 0.15, "sine"), 100);
  }

  playDoubleJump() {
    this.playTone(554, 0.1, "square");
    setTimeout(() => this.playTone(659, 0.15, "square"), 80);
  }

  playCoin() {
    this.playTone(988, 0.1, "sine");
    setTimeout(() => this.playTone(1318, 0.15, "sine"), 100);
  }

  playBreakBlock() {
    this.playTone(440, 0.1, "sawtooth");
  }

  playDie() {
    const frequencies = [440, 392, 349, 330, 294];
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "sawtooth"), i * 200);
    });
  }

  playWin() {
    const frequencies = [523.25, 659.25, 783.99, 1046.5];
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "triangle"), i * 150);
    });
  }
}

const soundManager = new SoundManager();

// ==================== Context & Provider ====================

const SuperMarioContext = createContext<any>(null);

export function SuperMarioGameProvider({
  children,
}: SuperMarioGameProviderProps) {
  // ==================== State ====================
  
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "gameover" | "won">("idle");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);

  // ==================== Player State ====================
  
  const [player, setPlayer] = useState<Player>({
    position: { x: LEVEL_1.startPos.x, y: LEVEL_1.startPos.y },
    dimensions: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
    velocity: { x: 0, y: 0 },
    isGrounded: false,
    isFacingLeft: false,
    state: "idle",
    animation: "idle",
    animationFrame: 0,
    score,
    lives,
    coins,
  });

  // ==================== Level & Tiles ====================
  
  const [level, setLevel] = useState<Level | null>(null);
  
  const [tiles, setTiles] = useState<Player['position' | any][]>(
    LEVEL_1.tiles.flat()
  );

  // ==================== Input State ====================
  
  const [input, setInput] = useState<PlayerInput>({
    left: false,
    right: false,
    up: false,
    down: false,
    run: false,
    jumpPressed: false,
    jumpHeld: false,
    runHeld: false,
  });

  // ==================== Game Loop Refs ====================
  
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const tickAccumulatorRef = useRef<number>(0);

  // ==================== Level Loading ====================
  
  const loadLevel = useCallback((levelId: number) => {
    const levelData = Object.values(LEVELS)[levelId];
    if (!levelData) return;
    
    setLevel(levelData);
    setCurrentLevel(levelId);
    
    // Reset player for new level
    setPlayer(prev => ({
      ...prev,
      position: { x: levelData.startPos.x, y: levelData.startPos.y },
      velocity: { x: 0, y: 0 },
      isGrounded: false,
      state: "idle",
      animation: "idle",
      lives: prev.lives,
      score: prev.score,
      coins: prev.coins,
    }));
    
    setTiles(levelData.tiles.flat());
    setStatus("idle");
  }, []);

  // ==================== Input Handling ====================
  
  const handleInput = useCallback((key: string, pressed: boolean) => {
    setInput(prev => {
      const newInput = { ...prev };
      
      switch (key) {
        case "ArrowLeft":
          newInput.left = pressed;
          break;
        case "ArrowRight":
          newInput.right = pressed;
          break;
        case "ArrowUp":
          if (pressed) newInput.up = true;
          break;
        case "ArrowDown":
          newInput.down = pressed;
          break;
        case " ":
          newInput.jumpPressed = pressed;
          break;
        case "ShiftLeft":
          newInput.runHeld = pressed;
          break;
        case "Escape":
          setStatus(prev => prev === "paused" ? "playing" : "paused");
          return newInput;
        case "KeyR":
          if (pressed && status !== "playing") {
            loadLevel(currentLevel);
          }
          return newInput;
      }
      
      return newInput;
    });
  }, [status, currentLevel, loadLevel]);

  // ==================== Movement Actions ====================
  
  const moveLeft = useCallback(() => setInput(prev => ({ ...prev, left: true })), []);
  const moveRight = useCallback(() => setInput(prev => ({ ...prev, right: true })), []);
  const moveUp = useCallback(() => setInput(prev => ({ ...prev, up: true })), []);
  const moveDown = useCallback(() => setInput(prev => ({ ...prev, down: true })), []);
  
  const startJump = useCallback(() => {
    if (player.state === "jump" && JUMP.doubleJumpAvailable) {
      setPlayer(prev => ({
        ...prev,
        state: "doubleJump",
        velocity: {
          x: prev.isFacingLeft ? -MOVEMENT.runSpeed : MOVEMENT.runSpeed,
          y: JUMP.force * JUMP.gravityCompensation,
        },
      }));
      soundManager.playDoubleJump();
    }
  }, [player]);
  
  const continueJump = useCallback(() => {
    // Keep jump velocity applied during jump
  }, []);
  
  const stopJump = useCallback(() => {
    setPlayer(prev => {
      if (prev.state === "doubleJump" || prev.state === "jump") {
        // Apply ground friction when landing
        return {
          ...prev,
          state: prev.isGrounded ? "idle" : "fall",
          velocity: {
            x: prev.velocity.x * MOVEMENT.friction,
            y: prev.velocity.y * MOVEMENT.airResistance,
          },
        };
      }
      return prev;
    });
  }, [input.isGrounded]);
  
  const runStart = useCallback(() => setInput(prev => ({ ...prev, runHeld: true })), []);
  const runStop = useCallback(() => setInput(prev => ({ ...prev, runHeld: false })), []);

  // ==================== Physics Engine ====================
  
  const applyPhysics = useCallback(() => {
    if (status !== "playing") return;

    // Get current player position and velocity
    const { x, y } = player.position;
    const { width, height } = player.dimensions;
    const { x: vx, y: vy } = player.velocity;

    // Handle Input
    if (input.left) {
      player.isFacingLeft = true;
    }
    if (input.right) {
      player.isFacingLeft = false;
    }

    // Calculate movement acceleration
    const isMovingHorizontally = input.left || input.right;
    const isRunning = input.runHeld;
    
    if (isMovingHorizontally) {
      const targetSpeed = isRunning ? MOVEMENT.runSpeed : MOVEMENT.maxSpeed;
      const direction = input.left ? -1 : 1;
      
      player.velocity.x = player.velocity.x + (direction * MOVEMENT.acceleration);
      player.velocity.x = Math.max(Math.min(player.velocity.x, targetSpeed), -targetSpeed);
      player.state = isRunning ? "run" : "walk";
    } else {
      // Apply friction
      player.velocity.x = player.velocity.x * MOVEMENT.friction;
      player.state = player.isGrounded ? "idle" : "fall";
    }

    // Apply Gravity
    player.velocity.y = player.velocity.y + GRAVITY.acceleration;
    player.velocity.y = Math.min(player.velocity.y, GRAVITY.velocity);

    // Jump handling
    if (input.jumpPressed && player.isGrounded) {
      player.velocity.y = JUMP.force;
      player.isGrounded = false;
      player.state = "jump";
      soundManager.playJump();
    }
    
    if (input.jumpHeld) {
      continueJump();
    }

    // Predict next position
    let nextX = x + player.velocity.x;
    let nextY = y + player.velocity.y;

    // Collision Detection - X Axis
    if (input.left) {
      for (let tile of tiles) {
        if (tile.x < nextX && tile.x + TILE_SIZE > nextX &&
            tile.y < y + height && tile.y + TILE_SIZE > y) {
          nextX = tile.x + TILE_SIZE;
          player.velocity.x = -player.velocity.x * 0.3; // Bounce back
          break;
        }
      }
    }
    
    if (input.right) {
      for (let tile of tiles) {
        if (tile.x < nextX + width && tile.x + TILE_SIZE > nextX &&
            tile.y < y + height && tile.y + TILE_SIZE > y) {
          nextX = tile.x - width;
          player.velocity.x = -player.velocity.x * 0.3;
          break;
        }
      }
    }

    // Collision Detection - Y Axis
    if (player.velocity.y > 0) {
      // Falling down
      for (let tile of tiles) {
        if (tile.x < x + width && tile.x + TILE_SIZE > x &&
            tile.y < nextY + height && tile.y + TILE_SIZE > nextY) {
          nextY = tile.y - height;
          player.velocity.y = 0;
          player.isGrounded = true;
          player.state = player.velocity.x !== 0 ? "walk" : "idle";
          break;
        }
      }
    } else if (player.velocity.y < 0) {
      // Jumping up
      for (let tile of tiles) {
        if (tile.x < x + width && tile.x + TILE_SIZE > x &&
            tile.y < nextY + height && tile.y + TILE_SIZE > nextY) {
          nextY = tile.y + TILE_SIZE;
          player.velocity.y = 0;
          // Break block logic here
          break;
        }
      }
    }

    // Check boundaries
    nextY = Math.max(nextY, 0);

    // Check for falling off level
    if (nextY > CANVAS_HEIGHT) {
      handlePlayerDeath();
      return;
    }

    // Update player
    setPlayer(prev => ({
      ...prev,
      position: { x: nextX, y: nextY },
      state,
      animationFrame: prev.animationFrame + 1,
    }));
  }, [player, input, tiles, status]);

  // ==================== Player Death ====================
  
  const handlePlayerDeath = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setStatus("gameover");
        soundManager.playDie();
      } else {
        setStatus("paused");
      }
      return newLives;
    });
    
    setPlayer(prev => ({
      ...prev,
      state: "dead",
      velocity: { x: 0, y: 0 },
    }));
  }, []);

  // ==================== Game Loop ====================
  
  useEffect(() => {
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      tickAccumulatorRef.current += deltaTime;

      // Apply physics at fixed time step
      while (tickAccumulatorRef.current >= TIME_CONFIG.TICK_RATE) {
        applyPhysics();
        tickAccumulatorRef.current -= TIME_CONFIG.TICK_RATE;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (status === "playing") {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, applyPhysics]);

  // ==================== Cleanup ====================
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.repeat) {
        handleInput(e.code, true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      handleInput(e.code, false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", () => {/* Handle window resize */});

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", () => {});
    };
  }, [handleInput]);

  // ==================== Context Value ====================
  
  const contextValue: any = useMemo(() => ({
    state,
    player,
    currentLevel,
    loadLevel,
    restartLevel: () => loadLevel(currentLevel),
    pauseGame: () => setStatus("paused"),
    resumeGame: () => setStatus("playing"),
    handleInput,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    startJump,
    continueJump,
    stopJump,
    runStart,
    runStop,
  }), [state, player, currentLevel, loadLevel, handleInput]);

  return (
    <SuperMarioContext.Provider value={contextValue}>
      {children}
    </SuperMarioContext.Provider>
  );
}

// ==================== Hook ====================
  
export function useSuperMario() {
  const ctx = useContext(SuperMarioContext);
  if (!ctx) {
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  }
  return ctx;
}
```

---

### File 10: `Game.tsx` (Main Component)

**Purpose**: Canvas-based game rendering component

**Implementation**:

```typescript
// vite-project/app/games/supermario/Game.tsx

import styled from "styled-components";
import { useSuperMario } from "./index";
import ScoreDisplay from "./components/ScoreDisplay";
import LivesDisplay from "./components/LivesDisplay";
import ControlsHelp from "./components/ControlsHelp";
import GameOverOverlay from "./components/GameOverOverlay";
import LevelIndicator from "./components/LevelIndicator";

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #5c94fc 0%, #5c94fc 20%, #0099ff 20%, #0099ff 100%);
  overflow: hidden;
`;

const GameCanvas = styled.canvas`
  display: block;
`;

const Overlay = styled.div<{ isWin: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 50;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Title = styled.h1<{ isWin: boolean }>`
  font-size: 64px;
  font-weight: bold;
  color: ${props => props.isWin ? '#4CAF50' : '#FF4500'};
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 32px;
`;

const StartButton = styled.button`
  padding: 16px 32px;
  font-size: 24px;
  font-family: "Courier New", monospace;
  font-weight: bold;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #45a049;
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 12px 24px;
  }
`;

// Main Game Component
export default function Game() {
  const {
    state,
    player,
    currentLevel,
    loadLevel,
    restartLevel,
    pauseGame,
    resumeGame,
  } = useSuperMario();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load initial level on mount
  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  // Handle start game
  const startGame = () => {
    loadLevel(currentLevel);
    pauseGame();
    setTimeout(() => {
      resumeGame();
    }, 100);
  };

  // Handle canvas resize
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    
    const container = canvasRef.current.parentElement;
    if (container) {
      canvasRef.current.width = container.offsetWidth;
      canvasRef.current.height = container.offsetHeight;
    }
  }, []);

  // Render tiles
  const renderTiles = useCallback((ctx: CanvasRenderingContext2D) => {
    const tileSize = TILE_SIZE;
    
    tiles.forEach(tile => {
      ctx.fillStyle = TILE_TYPES[(tile.type as keyof typeof TILE_TYPES)]?.color || "transparent";
      
      switch (tile.type) {
        case "ground":
          // Draw ground texture
          ctx.fillRect(tile.x, tile.y, tileSize, tileSize);
          ctx.fillStyle = "#4a3728";
          ctx.fillRect(tile.x, tile.y + tileSize - 4, tileSize, 4);
          break;
          
        case "block":
          ctx.fillStyle = "#8B4513";
          ctx.fillRect(tile.x, tile.y, tileSize, tileSize);
          ctx.strokeStyle = "#654321";
          ctx.lineWidth = 2;
          ctx.strokeRect(tile.x, tile.y, tileSize, tileSize);
          break;
          
        case "question":
          ctx.fillStyle = "#FFD700";
          ctx.fillRect(tile.x, tile.y, tileSize, tileSize);
          ctx.fillStyle = "#DAA520";
          ctx.font = "bold 24px Arial";
          ctx.fillText("?", tile.x + 8, tile.y + 24);
          break;
          
        case "coin":
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(tile.x + tileSize/2, tile.y + tileSize/2, tileSize/2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#FFA500";
          ctx.beginPath();
          ctx.arc(tile.x + tileSize/2, tile.y + tileSize/2, tileSize/3, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        default:
          ctx.fillRect(tile.x, tile.y, tileSize, tileSize);
      }
    });
  }, []);

  // Render player
  const renderPlayer = useCallback((ctx: CanvasRenderingContext2D) => {
    const { x, y } = player.position;
    const { width, height } = player.dimensions;
    
    // Draw shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height + 4, width/3, height/6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw body
    ctx.fillStyle = player.state === "run" 
      ? "#DC143C" 
      : player.state === "jump" 
        ? "#FF4500"
        : player.state === "dead"
          ? "#FF6347"
          : SPRITES.player.idle[player.isFacingLeft ? "left" : "right"];
    
    ctx.fillRect(x, y, width, height);
    
    // Draw face
    ctx.fillStyle = "#FFF";
    ctx.fillRect(
      x + (player.isFacingLeft ? 4 : width - 16), 
      y + 4, 
      8, 
      8
    );
    
    // Draw eyes
    ctx.fillStyle = "#000";
    ctx.fillRect(
      x + (player.isFacingLeft ? 6 : width - 14), 
      y + 6, 
      4, 
      4
    );
    
    // Debug: Draw collision box
    if (DEBUG_CONFIG.SHOW_COLLISION_BOXES) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    }
  }, [player]);

  // Main render function
  const render = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render tiles
    if (level) {
      renderTiles(ctx);
    }
    
    // Render player
    renderPlayer(ctx);
    
    // Render overlay for game over/win
    if (state.status === "gameover") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [level, player, state.status, renderTiles, renderPlayer]);

  // Game loop for rendering
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      render();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [render, level, player]);

  return (
    <GameContainer>
      <ScoreDisplay score={state.score} coins={state.coins} />
      <LivesDisplay lives={state.lives} />
      <LevelIndicator levelName={currentLevel > 0 ? LEVELS[currentLevel].name : "LEVEL 1"} />
      <ControlsHelp />
      <GameCanvas 
        ref={canvasRef}
        style={{ 
          width: "100%", 
          height: "100%" 
        }}
      />
      
      {/* Start Screen Overlay */}
      {state.status === "idle" && currentLevel === 0 && (
        <Overlay isWin={false}>
          <Title>Super Mario</Title>
          <StartButton onClick={startGame}>
            START GAME
          </StartButton>
        </Overlay>
      )}
      
      {/* Game Over / Win Overlay */}
      {(state.status === "gameover" || state.status === "won") && (
        <Overlay isWin={state.status === "won"}>
          {state.status === "gameover" ? (
            <>
              <Title isWin={false}>GAME OVER</Title>
              <div style={{ fontSize: "28px", color: "#ddd", marginBottom: "32px" }}>
                Final Score: {state.score}
              </div>
              <StartButton onClick={() => {
                setLives(3);
                setScore(0);
                setCoins(0);
                loadLevel(currentLevel);
              }}>
                TRY AGAIN
              </StartButton>
            </>
          ) : (
            <>
              <Title isWin={true}>YOU WIN!</Title>
              <div style={{ fontSize: "28px", color: "#FFD700", marginBottom: "32px" }}>
                Final Score: {state.score}
              </div>
              <StartButton onClick={() => {
                setLives(3);
                setScore(0);
                setCoins(0);
                loadLevel(0);
              }}>
                PLAY AGAIN
              </StartButton>
            </>
          )}
        </Overlay>
      )}
    </GameContainer>
  );
}

// meta export for React Router
export function meta() {
  return [
    { title: "Super Mario – Browser Game" },
    { name: "description", content: "Play Super Mario on the web" },
  ];
}

// Add missing imports
import { useRef, useEffect, useCallback } from "react";
```
