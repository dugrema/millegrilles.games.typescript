# Super Mario Implementation Plan - Complete

## Overview
This plan outlines the step-by-step implementation of a Super Mario clone game using React 19, TypeScript, and styled-components. The implementation follows the existing game patterns (Minesweeper, Tetris, Snake, Flappy Bird).

---

## Phase 1: Project Structure (DONE)

**Goal:** Set up basic file structure for Super Mario clone to ensure the page loads via router.

### Phase 2: Player Physics & Movement (DONE)
**File:** `components/Player.tsx`

```typescript
// Basic player rendering and movement
// Implement gravity, jumping, horizontal movement, friction, run boost
// Simple sprite rendering with animation states
```

### Phase 3: Camera System (DONE)
**File:** `components/Camera.tsx`

```typescript
// Camera following logic
// Smooth horizontal scrolling
// Level boundaries
```

### Phase 4: Platform System (DONE)
**File:** `components/Platforms.tsx`

```typescript
// Tile-based map parsing
// Platform collision detection
// Platform types: ground, bricks, question blocks, pipes, blocks
```

### Phase 5: UI Elements (DONE)
**File:** `components/UIOverlay.tsx`, `components/GameOverlay.tsx`

```typescript
// Score, lives, level display
// Time counter
// Start/game over/victory screens
```

### Phase 6: Game Loop & Canvas Rendering (DONE)
**File:** `components/GameContainer.tsx`

```typescript
// Canvas-based rendering
// requestAnimationFrame game loop
// Main state management
```

### Phase 7: Controls & Input
**File:** Update `index.tsx` and `Game.tsx`

```typescript
// Keyboard event listeners (arrow keys, X/Z, Enter, Space, Shift)
// Touch controls for mobile
// Pause functionality
// Restart functionality
```

### Phase 8: Enemy System
**File:** `components/Enemies.tsx`

```typescript
// Goomba AI (patrol back and forth, turn at obstacles)
// Koopa AI (move in patterns, can be stomped)
// Enemy death animation
// Player vs enemy collision
```

### Phase 9: Collectibles System
**File:** `components/Collectibles.tsx`

```typescript
// Coin spawning and collection
// Power-up types: Mushroom, Fire Flower
// Power-up spawning from question blocks
```

### Phase 10: Sound Effects
**File:** Update `index.tsx` to include sound implementations

```typescript
// Web Audio API implementation
// Jump sound, coin sound, enemy defeat, power-up, game over, level complete
// Background music
```

### Phase 11: Lives & Scoring
**File:** Update `index.tsx` and `Game.tsx`

```typescript
// Lives system with 3-5 lives
// Score tracking
// Respawn mechanics
// High score in localStorage
```

### Phase 12: Level Progression
**File:** Update `constants.ts` and `index.tsx`

```typescript
// Multiple level definitions with increasing difficulty
// Flag pole at level end
// Level transition screens
```

### Phase 13: Power-Up Mechanics
**File:** Update `index.tsx`, `Player.tsx`, `Collectibles.tsx`

```typescript
// Power-up states: small, big, fire
// Size changes and hit detection
// Fire flower shooting
// Power-up duration and expiration
```

### Phase 14: Visual Polish
**File:** Update all components

```typescript
// Sprite animations (walk, idle, jump, duck)
// Particle effects (sparkles, dust)
// Background elements (clouds, hills, bushes)
// Responsive design adjustments
```

### Phase 15: Save Progress (Optional)
**File:** Update `index.tsx`

```typescript
// Save game state to localStorage
// Load progress on restart
// Persist level completion
```

---
# Implementation Plan: Fix Super Mario Game Startup & Input Issues

## Root Cause Analysis

The game has **three critical issues**:

1. **Type Mismatch**: `types.ts` defines `space: boolean` in `InputState`, but `InputHandler` uses `start: boolean` → Keyboard Space doesn't trigger game start
2. **Overlay Click Doesn't Set Input**: Clicking start screen doesn't set `start: true` before calling `startGame` → No interaction state
3. **Game Loop Unclear**: Need to verify game loop runs after state changes → Game may not start

---

## Phase 1: Fix Input State Type Definition (Critical)

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/types.ts`

**Line**: ~102 (`InputState` interface)

**Change**:
```tsx
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
  start: boolean;  // ✅ Changed from: space: boolean
}
```

---

## Phase 2: Update InputHandler (Critical)

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/components/InputHandler.tsx`

**Location**: Lines 24-36

**Status**: ✅ Already correct! The `Space` key is mapped to `"start"` which now matches the updated `InputState`.

**No changes needed** - the INPUT_KEYS mapping is correct.

---

## Phase 3: Update GameOverlay Interface & Handler (Critical)

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/components/GameOverlay.tsx`

**Change 1**: Update interface (around line 19)

**Before**:
```tsx
interface GameOverlayProps {
  gameState: GameState;
  score: number;
  highScore?: number;
  level: number;
  onRestart?: () => void;
  onResume?: () => void;
  onNextLevel?: () => void;
  onStart?: () => void;
}
```

**After**:
```tsx
interface GameOverlayProps {
  gameState: GameState;
  score: number;
  highScore?: number;
  level: number;
  inputActions?: { setInput?: (state: Partial<InputState>) => void };
  onRestart?: () => void;
  onResume?: () => void;
  onNextLevel?: () => void;
  onStart?: () => void;
}
```

**Change 2**: Update function signature (around line 44)

**Before**:
```tsx
export default function GameOverlay({
  gameState,
  score,
  highScore = 0,
  level,
  onRestart,
  onResume,
  onNextLevel,
  onStart,
}: GameOverlayProps) {
```

**After**:
```tsx
export default function GameOverlay({
  gameState,
  score,
  highScore = 0,
  level,
  inputActions = {},
  onRestart,
  onResume,
  onNextLevel,
  onStart,
}: GameOverlayProps) {
```

**Change 3**: Add helper function before renderStartScreen (around line 314)

**After** renderStartScreen: Add:
```tsx
const handleOverlayClick = () => {
  // Set input state first to track user interaction
  if (inputActions?.setInput) {
    inputActions.setInput({ start: true });
  }
  // Then trigger game start
  if (onStart) {
    onStart();
  }
};
```

**Change 4**: Update onClick handler (line 326)

**Before**:
```tsx
<ContainerWrapper onClick={onStart}>
```

**After**:
```tsx
<ContainerWrapper onClick={handleOverlayClick}>
```

---

## Phase 4: Pass Input Actions to GameOverlay (Critical)

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx`

**Location**: Lines 115-125

**Before**:
```tsx
<GameOverlay
  gameState={gameState}
  score={score}
  highScore={highScore}
  level={level}
  onRestart={actions.restartLevel}
  onResume={actions.resumeGame}
  onNextLevel={actions.nextLevel}
  onStart={actions.startGame}
/>
```

**After**:
```tsx
<GameOverlay
  gameState={gameState}
  score={score}
  highScore={highScore}
  level={level}
  inputActions={{ setInput: actions.setInput }}
  onRestart={actions.restartLevel}
  onResume={actions.resumeGame}
  onNextLevel={actions.nextLevel}
  onStart={actions.startGame}
/>
```

---

## Phase 5: Update startGame Function (Quality of Life)

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx`

**Location**: Lines 632-638

**Before**:
```tsx
const startGame = () => {
  gameState = GameState.PLAYING;
  isPaused = false;
};
```

**After**:
```tsx
const startGame = () => {
  gameState = GameState.PLAYING;
  isPaused = false;
  // Reset input state to clean start
  input.left = false;
  input.right = false;
  input.up = false;
  input.down = false;
  input.jump = false;
  input.run = false;
  input.duck = false;
  input.pause = false;
  input.restart = false;
  input.start = false;
};
```

---

## Phase 6: Verify Game Loop (Important)

**File**: `millegrilles.games.typescript/vite-project/app/games/supermario/Game.tsx`

**Check**: The game loop should automatically start when `gameState` changes to PLAYING.

**Verification needed**:
1. The `gameLoop` function (lines 492-619) is called repeatedly
2. It checks `if (gameState === GameState.PLAYING)` before processing
3. The `useEffect` should be watching `gameState` and `isPaused` to control loop execution

**Status**: ✅ The game loop structure is correct and should work once the state is properly set.

---

## Execution Sequence

When user interacts:

1. **User clicks overlay** → `handleOverlayClick` → `inputActions.setInput({ start: true })` → `actions.startGame()`
2. **User presses SPACE** → InputHandler receives event → `INPUT_KEYS["Space"] = "start"` → `onInputChange({ start: true })` → `actions.startGame()`
3. **startGame()** → `gameState = GameState.PLAYING` → `isPaused = false`
4. **Game loop** → Detects `gameState === PLAYING` → Processes input → Updates player → Renders frame

---

## Testing Checklist

After implementing changes:

1. ✅ Run `npx tsc --noEmit` → Check for TypeScript errors
2. ✅ Start dev server → Check console for errors
3. ✅ Click overlay → Verify it disappears (overlay gone)
4. ✅ Press SPACE → Verify game starts (Mario should appear moving or be at start position)
5. ✅ Press R or Enter → Verify restart functionality
6. ✅ Press SPACE → Verify pause/resume works
7. ✅ Use arrow keys → Verify movement
8. ✅ Press SHIFT → Verify sprint/run

---

## Files to Modify Summary

| File | Lines Modified | Change Type |
|------|---------------|-------------|
| `types.ts` | ~102 | Type definition update |
| `GameOverlay.tsx` | ~19, 44, 314-326, 326 | Interface, signature, helper, onClick |
| `Game.tsx` | 115-125 | Props pass to GameOverlay |

**Total**: 3 files, ~15-20 lines of code changes

---

## Expected Outcome

After these fixes:

- ✅ Overlay disappears when clicked (already working)
- ✅ SPACE key starts the game (now fixed - type alignment)
- ✅ Overlay click sets input state (now fixed)
- ✅ Game loop runs continuously
- ✅ Keyboard controls work during gameplay
- ✅ On-screen buttons work via TouchControls

The game should now start reliably when the overlay is clicked or SPACE is pressed, with proper input handling throughout gameplay.
