# React gaming for MilleGrilles

This project provides multiple simple games using client-side javascript and React 19 using vite and React Router 7. 

## Development rules

* Always work within the millegrilles.games.typescript/ project directory.
* The javascript project is under millegrilles.games.typescript/vite-project.
* The React application source is under millegrilles.games.typescript/vite-project/app.
* Do not use millegrilles.games.typescript/docs, this is the github pages publishing directory.
* **NEVER** use git. Always ask the user if you need to use git.
* Use a timeout when starting the server with `npm run dev` to check if the application runs, you need to change to the full path of `vite-project` to run npm commands.
* Ensure project integrity when finishing a coding/bug fixing cycle
  * The javascript project is under `millegrilles.games.typescript/vite-project`. Always `cd` to its absolute path before running `npx` or `npm`.
  * Verify typescript by using `npx tsc --noEmit --jsx react-jsx` (with appropriate parameters, filtering and piping and absolute path tp vite-project/)
  * Use `npm run build` to verify the integrity of the project (absolute paths)

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

See `PLAN.md` for current phase implementation plan.

# Super Mario Clone - High level design

## User requirements

This game is to be a side-scroller similar to the original Super Mario (1). It needs to support desktop and mobile play, multiple zones (stages), sounds, and saves the current progress in localStorage. 

## Current State
- **Route**: `/vite-project/app/routes/games/supermario.tsx` (currently shows "TODO")
- **Game Directory**: Has `constants.ts` with basic game configuration
- **Pattern Established**: Context Provider + Hook + Component structure (based on Minesweeper)

## User test after each phase

The implementation needs to be cut in phases that can be coded then loaded by the user in a browser to test that the phase is complete and working. Start with the gameloop with some logging, then keyboard handling, then increasingly complex behavior.

## Implementation Phases

### Phase 1: Basic Gameloop with Logging
**Purpose**: Establish foundation with requestAnimationFrame and state tracking

**Implementation**:
- Create `types.ts` with TypeScript interfaces
- Update `index.tsx` as GameContext.Provider with basic state
- Create `Game.tsx` component wrapper
- Implement `useSuperMario()` hook
- Add requestAnimationFrame gameloop
- Basic player sprite
- Simple ground platform
- Player position tracking (x, y)
- Console logging for frame rate, time delta, and game state

**Success Criteria**: Game runs, logs show "Starting game loop", "Frame: X, Delta: Y"

**Files to create**:
1. `vite-project/app/games/supermario/types.ts`
2. `vite-project/app/games/supermario/Game.tsx`
3. Update `vite-project/app/games/supermario/index.tsx` with Provider + hook

---

### Phase 2: Keyboard Input Handling
**Purpose**: Map keyboard commands to game actions

**Implementation**:
- Keyboard event listeners (keydown, keyup)
- Key mappings: 
  - Arrow keys for Left, Right
  - SPACE for Jump
  - SHIFT for running/fireball
  - `r` for start/restart
  - ESC for pause/resume
- Update player velocity based on input
- Input event logging
- Start screen that waits for `r` to start

**Success Criteria**: Pressing keys updates player velocity, logs show input events

**Files to update**:
- `types.ts` (keyboard state)
- `index.tsx` (keyboard handlers)
- `Game.tsx` (controls help display)

---

### Phase 3: Basic Physics & Collision
**Purpose**: Implement gravity, collision detection, platform interaction

**Implementation**:
- Gravity (falling acceleration)
- Platform collision detection (bounding box)
- Jump mechanics (force on ground)
- Ground detection
- Simple platform generation
- Collision response

**Success Criteria**: Player can jump, land on platforms, gravity pulls down

**Files to update**:
- `types.ts` (platform data structure)
- `index.tsx` (physics system)
- `constants.ts` (gravity/jump values)
- `Game.tsx` (render platforms)

---

### Phase 4: Running & Double Jump
**Purpose**: Add movement variations and advanced mechanics

**Implementation**:
- Run speed boost (Shift/Right arrow)
- Double jump capability
- Running mechanics
- Air resistance/friction
- Updated physics constants

**Success Criteria**: Player can run faster, perform double jump, responsive movement

**Files to update**:
- `types.ts` (run/air state)
- `index.tsx` (running logic)
- `constants.ts` (run speeds)

---

### Phase 5: Scrolling Camera
**Purpose**: Camera follows player through level

**Implementation**:
- Camera x-position tracking
- Smooth camera movement (lerp)
- Camera constraints
- Level boundaries
- Camera offset calculation

**Success Criteria**: Camera follows player, smooth pan effect

**Files to update**:
- `types.ts` (camera state)
- `index.tsx` (camera system)
- `Game.tsx` (apply camera offset)

---

### Phase 6: Game Elements
**Purpose**: Add interactive game objects

**Implementation**:
- Coins (collectibles)
- Enemies (Goomba-style, moving back/forth)
- Power-ups (mushrooms)
- Collectible tracking (score, coins, lives)
- Enemy collision (hurt player)
- Item pickup mechanics

**Success Criteria**: Can collect coins, enemies move, mushroom appears, collision works

**Files to create**:
- `components/Enemy.tsx`, `Coin.tsx`, `PowerUp.tsx`, `Platform.tsx`

---

### Phase 7: Multiple Zones/Stages
**Purpose**: Implement multiple game levels

**Implementation**:
- Level data structure (platforms, enemies, coins)
- Level switching system
- Level progress tracking
- Zone definitions (ground, air, underground, castle)
- 3 zones with different environments
- Background colors/textures per zone

**Success Criteria**: Can switch levels, different environments, progress saves

**Files to create**:
- `levels/` directory with level data files
- Update `types.ts`, `index.tsx`, `Game.tsx`

---

### Phase 8: Mobile Controls
**Purpose**: Touch controls for mobile devices

**Implementation**:
- Virtual joystick for movement
- Jump button
- Pause/Menu button
- Touch event handling
- Responsive layout
- Button styling
- Controls visibility toggle

**Success Criteria**: Touch buttons work, virtual joystick controls player, responsive on mobile

**Files to create**:
- `components/TouchControls.tsx`
- Update `Game.tsx`

---

### Phase 9: Save/Load System
**Purpose**: Persist game progress in localStorage

**Implementation**:
- Save current level
- Save score and lives
- Save high scores
- Save coin count
- Load function on game start
- Auto-save on level completion

**Success Criteria**: Progress saves to localStorage, loads correctly

**Files to update**:
- `types.ts` (save data structure)
- `index.tsx` (localStorage operations)
- `constants.ts` (storage keys)

---

### Phase 10: Audio System
**Purpose**: Sound effects and music

**Implementation**:
- AudioContext based sound system
- Jump, coin, enemy defeat, power-up sounds
- Win/Lose sounds
- Background music per zone
- Sound volume control

**Success Criteria**: Audio plays on events, music changes per zone

**Files to update**:
- `index.tsx` (SoundManager class)

---

### Phase 11: UI & Polish
**Purpose**: Complete UI and visual polish

**Implementation**:
- HUD (score, coins, lives, level)
- Start screen
- Pause menu
- Game over screen
- Win screen
- Level transition animations
- Sprite animations (idle, walk, jump, run)
- Visual effects (particles, trails)

**Files to create**:
- `components/HUD.tsx`, `StartScreen.tsx`, `PauseMenu.tsx`, `GameOver.tsx`, `WinScreen.tsx`
- Update `Game.tsx` for screen management

**Success Criteria**: Complete UI flow, smooth transitions, readable text

---

### Phase 12: Final Integration
**Purpose**: Test and verify entire game

**Implementation**:
- Full game flow testing
- Performance optimization
- Bug fixes
- Device compatibility testing
- Accessibility improvements

**Files to update**:
- Documentation in README
- Code refinements

**Success Criteria**: Game fully playable, responsive across devices, good performance

## File Structure Overview

```
vite-project/app/games/supermario/
├── index.tsx            (Provider + Hook - core, Phase 1+3+4+5+6+7+8+9+10)
├── Game.tsx             (Component - Phase 1+5+11)
├── types.ts             (TypeScript interfaces - Phase 1)
├── constants.ts         (Game constants - exists, Phase 4)
├── levels/              (Level data - Phase 7)
│   ├── level1.ts
│   ├── level2.ts
│   └── level3.ts
└── components/          (UI and game objects - Phase 6+8+11)
    ├── HUD.tsx
    ├── StartScreen.tsx
    ├── PauseMenu.tsx
    ├── GameOver.tsx
    ├── WinScreen.tsx
    ├── TouchControls.tsx
    ├── Enemy.tsx
    ├── Coin.tsx
    ├── PowerUp.tsx
    └── Platform.tsx
```
