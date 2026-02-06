# React gaming for MilleGrilles

This project provides multiple simple games using client-side javascript and React 19 using vite and React Router 7. 

## Development rules

* Always work within the react-games1/ project directory.
* The javascript project is under react-games1/vite-project.
* The React application source is under react-games1/vite-project/app.
* **NEVER** use git. Always ask the user if you need to use git.
* Use a timeout when starting the server with `npm run dev` to check if the application runs, you need to change to the full path of `vite-project` to run npm commands.
* Ensure project integrity when finishing a coding/bug fixing cycle
  * Verify typescript by using `npx tsc --noEmit` (with appropriate parameters, filtering and piping)
  * Use `npm run build` to verify the integrity of the project

## React Context Provider Pattern

### Common Bug: useXGame Hook Must Be Used Within Provider

**Error:** `useXGame must be used within XGameProvider`

**Cause:** When creating games using React Context for state management, components using custom hooks (like `useXGame`) must be wrapped in the corresponding Provider component.

**Solution:**
1. Create a Provider component that wraps all game state logic (see `Game.tsx` in Minesweeper)
2. Export the Provider component from the game's main directory
3. Import and wrap the game component in the route file's Provider

**Example:**

```tsx
// In route file (e.g., routes/games/minesweeper.tsx)
import { MinesweeperGameProvider } from "../../games/minesweeper";
import MinesweeperGame from "../../games/minesweeper/Game";

export default function Minesweeper() {
  return (
    <MinesweeperGameProvider>
      <MinesweeperGame />
    </MinesweeperGameProvider>
  );
}
```

### Provider Component Structure

The Provider component should:

1. Create a context using `createContext` with proper typing
2. Provide context values through `context.Provider`
3. Export the hook using `useContext` with error checking

**Example pattern:**

```tsx
// games/mygame/Game.tsx
import { createContext, useContext, useState, ... } from "react";
import type { MyGameState, MyGameContextType, ... } from "./types";

const MyGameContext = createContext<MyGameContextType | null>(null);

export function MyGameProvider({ children }: { children: React.ReactNode }) {
  // Game state and logic here
  const value: MyGameContextType = {
    state,
    actions,
    // ...
  };

  return (
    <MyGameContext.Provider value={value}>
      {children}
    </MyGameContext.Provider>
  );
}

export function useMyGame() {
  const ctx = useContext(MyGameContext);
  if (!ctx) {
    throw new Error("useMyGame must be used within MyGameProvider");
  }
  return ctx;
}

export default MyGameProvider;
```

### Route Component Structure

The route component should be simple and only handle layout/UI, not game logic:

```tsx
// routes/games/mygame.tsx
import styled from "styled-components";
import { MyGameProvider } from "../../games/mygame";
import MyGame from "../../games/mygame/Game";

export default function MyGame() {
  return (
    <PageContainer>
      <GameWrapper>
        <MyGameProvider>
          <MyGame />
        </MyGameProvider>
      </GameWrapper>
    </PageContainer>
  );
}
```

### Important Notes

- **Never** import the hook directly into the component - import the Provider instead and wrap it around the component
- The Provider should wrap all game components that need to access the context
- If using styled-components or other wrapper components, place them inside or outside the Provider as needed
- Always export the Provider from the game directory, not the hook

## Design of Super Mario game

### Game Overview

Super Mario is a classic platformer game where players control Mario, navigating through multiple levels filled with platforms, enemies, and obstacles. The goal is to reach the flagpole at the end of each level while collecting coins, avoiding enemies, and collecting power-ups to defeat enemies and reach higher areas.

### Component Structure

- `GameContext` (React Context) to manage global state (player, level, score, lives, game status)
- `GameContainer` component: main canvas container with game rendering
- `Player` component: renders Mario with animation states (idle, walk, jump, run)
- `Level` component: manages level map, platforms, pipes, gaps, and camera
- `Enemy` component: renders and animates Goombas, Koopas, and other enemies
- `Collectible` component: handles coins, power-ups (mushroom, fire flower)
- `UIOverlay` component: displays score, lives, level, time, and game state messages
- `GameLoop` using `requestAnimationFrame` for 60fps rendering and physics updates

### State Management

- Use `useReducer` to manage game state (player position, velocity, level, score, lives, game status)
- Persist high score in `localStorage`
- Player state: x/y coordinates, velocity (vx/vy), state (idle, run, jump, duck)
- Level state: current level index, camera offset, platform collision boxes
- Score state: coins collected, points from enemies, total score

### Game Engine Core

**Player Physics:**
- Gravity: constant downward acceleration (e.g., 0.5 px/frame²)
- Jump force: upward impulse (e.g., -12 px/frame)
- Running speed: horizontal velocity (e.g., 5 px/frame)
- Run boost: higher horizontal speed when moving and pressing shift
- Double jump: allows second jump when airborne (if enabled)
- Friction: gradual deceleration when not moving

**Level System:**
- Tile-based map representation (0=air, 1=ground, 2=brick, 3=question block, 4=pipe, etc.)
- Camera system: follows player horizontally with smooth scrolling
- Platform collision boxes: AABB (Axis-Aligned Bounding Box)
- Gap detection: detect drops and handle respawning at start of level

**Enemy System:**
- Goomba behavior: patrol back and forth, turn when hitting obstacle
- Koopa behavior: moves in patterns, can be stomped
- Enemy collision: Player kills enemy by jumping on top, enemy kills by touching side
- Death animation: enemies fall when defeated

**Collectibles:**
- Coins: spawn from question blocks, reward points
- Power-ups: Mushroom (makes player big), Fire Flower (shoots fireballs)
- Power-up states: Small, Big, Fire (with increased size, hitbox)
- Power-up spawning: from question blocks at specific locations

**Physics Constants:**
- Gravity: 0.5 px/frame²
- Jump velocity: -12 px/frame
- Run velocity: 5 px/frame
- Maximum fall speed: 12 px/frame
- Collision box dimensions: player height ~32px, width ~32px

**Level Design:**
- Multiple levels with increasing difficulty
- Level boundaries: screen width scales, camera scrolls
- Flag pole: win condition at level end
- Bonus coin areas

### Game States

- **Idle**: Waiting for player to start
- **Playing**: Game actively running
- **Paused**: Game temporarily stopped
- **LevelTransition**: Moving between levels
- **GameOver**: Player lost all lives
- **Victory**: All levels completed

### User Controls

- **Left/Right Arrow**: Move player left/right
- **Up Arrow**: Jump
- **X or Z**: Run (hold while moving)
- **Down Arrow**: Duck / Enter pipe
- **Space**: Pause/Resume
- **Enter**: Restart after Game Over
- **Shift**: Boost run
- **R**: Restart current level

### Visual Design

- Canvas size: 800x480 pixels (4:3 aspect ratio, typical Mario scale)
- Player character: Mario sprite with animations
  - Small Mario: Red hat, blue overalls
  - Big Mario: Larger sprite
  - Fire Mario: Hat and shirt color changes
- Platforms:
  - Ground: Brown bricks with texture
  - Brick block: Red with question marks
  - Stone blocks: Gray with patterns
  - Pipe: Green with darker top
- Environment:
  - Sky background with clouds
  - Hills in background
  - Bush decorations
- Enemies:
  - Goomba: Brown mushroom-like
  - Koopa: Green turtle shell
- Coins: Gold discs with sparkle animation
- UI overlay:
  - Score display: Top left
  - Lives display: Top left (with icons)
  - Level indicator: Top right
  - Time indicator: Top right

### Audio Effects

- Jump sound: "Whoosh" sound with pitch modulation
- Coin pickup: Classic "Ding" sound
- Enemy defeat: "Stomp" sound
- Power-up collection: Ascending chime
- Game over: Sad descending melody
- Level completion: Fanfare sound
- Hit by enemy: "Ouch" sound
- Music: Classic Mario-style background music

### Implementation Notes

- Use functional components with hooks
- Canvas rendering for smooth game loop
- AABB collision detection for platforms and enemies
- Camera system with smooth scrolling
- Tile-based level parsing for different level types
- Sprite animations based on frame counters and action states
- Touch controls for mobile (left/right/tap jump buttons)
- Physics simulation frame-based
- Level reset on death
- Lives system (typically 3-5 lives)
- High score tracking across levels
- Save progress system (optional)
- Handle edge cases: falling off level, stuck in gaps

### Directory Structure

```
react-games1/vite-project/app/
├── games/
│   └── supermario/
│       ├── index.tsx               # Main game entry point
│       ├── types.ts                 # TypeScript type definitions
│       ├── constants.ts             # Game constants (physics, sizes)
│       ├── level-data.ts             # Level definitions and maps
│       ├── Game.tsx                 # React Context for global state
│       └── components/
│           ├── index.tsx            # Component exports
│           ├── GameContainer.tsx    # Main canvas container
│           ├── GameOverlay.tsx      # Start/Game Over/Level complete UI
│           ├── Player.tsx           # Mario rendering and physics
│           ├── Level.tsx            # Level map and camera
│           ├── Platforms.tsx        # Platform rendering and collision
│           ├── Enemies.tsx          # Enemy entities and AI
│           ├── Collectibles.tsx     # Coins and power-ups
│           ├── UIOverlay.tsx        # Score, lives, level display
│           ├── Background.tsx       # Background rendering
│           ├── Camera.tsx           # Camera system
│           ├── InputHandler.tsx     # Keyboard and touch input
│           ├── Particles.tsx        # Visual effects
│           └── TouchControls.tsx    # Mobile touch buttons
├── routes/
│   └── games/
│       └── supermario.tsx           # Route component for the game
└── Game.tsx                         # Global game context provider
```

Note: 
+ When using tools, use relative paths from react-games1, e.g. `react-games1/vite-project/games/supermario/index.tsx`.
+ When using shell commands, use absolute paths or change to the proper directory first.

### Key Features

- Platforming gameplay with smooth physics
- Multiple playable characters (Small, Big, Fire Mario)
- Diverse level design with platforms, pipes, gaps, and hazards
- Enemy AI with different behaviors (patrol, chase, turn)
- Coin collection system with scoring
- Power-ups: Mushroom and Fire Flower
- Lives system with respawn mechanics
- Multiple levels with increasing difficulty
- Smooth camera scrolling
- Classic retro-style graphics and animations
- Keyboard and touch controls
- Sound effects and background music
- High score persistence
- Pause functionality
- Level restart capability
- Responsive design with scalable canvas
