# Super Mario Implementation Plan - Current phase

## Overview
This plan outlines the step-by-step implementation of a Super Mario clone game using React 19, TypeScript, and styled-components. The implementation follows the existing game patterns (Minesweeper, Tetris, Snake, Flappy Bird).

---
#### Phase 1: Fix Function Stability (CRITICAL)

**Location:** `index.tsx` - Around line 138

**Problem:** `handleKeyDown` and `handleKeyUp` are regular functions, not `useCallback`

**Solution:**
```typescript
// Wrap handleKeyDown and handleKeyUp in useCallback with proper dependencies
const handleKeyDown = useCallback(
  (e: KeyboardEvent, setPlayerInput: (input: PlayerInput) => void) => {
    const inputMap: PlayerInput = {
      left: false,
      right: false,
      up: false,
      down: false,
      runPressed: false,
      runHeld: false,
      jumpPressed: false,
      jumpHeld: false,
    };

    if (e.code === KEYS.LEFT) {
      inputMap.left = true;
    } else if (e.code === KEYS.RIGHT) {
      inputMap.right = true;
    } else if (e.code === KEYS.UP) {
      inputMap.up = true;
    } else if (e.code === KEYS.DOWN) {
      inputMap.down = true;
    } else if (e.code === KEYS.RUN) {
      inputMap.runPressed = true;
      inputMap.runHeld = true;
    } else if (e.code === KEYS.JUMP) {
      inputMap.jumpPressed = true;
      inputMap.jumpHeld = true;
    } else if (e.code === KEYS.RESTART) {
      inputMap.jumpPressed = true; // Used to restart
    } else if (e.code === KEYS.ESCAPE) {
      inputMap.jumpPressed = true; // Used to pause/resume/quit
    }

    setPlayerInput(inputMap);
  },
  [setPlayerInput], // Dependencies: setInput from the game context
);

const handleKeyUp = useCallback(
  (e: KeyboardEvent, setPlayerInput: Dispatch<SetStateAction<Partial<PlayerInput>>>) => {
    if (e.code === KEYS.LEFT) {
      setPlayerInput({ left: false });
    } else if (e.code === KEYS.RIGHT) {
      setPlayerInput({ right: false });
    } else if (e.code === KEYS.UP) {
      setPlayerInput({ up: false });
    } else if (e.code === KEYS.DOWN) {
      setPlayerInput({ down: false });
    } else if (e.code === KEYS.RUN) {
      setPlayerInput({ runPressed: false, runHeld: false });
    }
  },
  [setPlayerInput], // Dependencies: setInput from the game context
);
```

**Why this is critical:** Without `useCallback`, every time the Provider re-renders (which happens frequently during state changes), new function instances are created, causing the event listener to be re-attached with stale references.

---

#### Phase 2: Fix Keyboard Event Listener Setup

**Location:** `index.tsx` - Lines 679-695

**Current problematic code:**
```typescript
useEffect(() => {
  const handleKeyDownLocal = (e: KeyboardEvent) => handleKeyDown(e, setInput);
  const handleKeyUpLocal = (e: KeyboardEvent) =>
    handleKeyUp(
      e,
      setInput as Dispatch<SetStateAction<Partial<PlayerInput>>>,
    );

  window.addEventListener("keydown", handleKeyDownLocal);
  window.addEventListener("keyup", handleKeyUpLocal);

  return () => {
    window.removeEventListener("keydown", handleKeyDownLocal);
    window.removeEventListener("keyup", handleKeyUpLocal);
  };
}, [handleKeyDown, handleKeyUp]);
```

**Problem with current code:**
- Using `handleKeyDownLocal` and `handleKeyUpLocal` as arrow functions creates new function instances on every effect run
- This breaks the `useCallback` benefits

**Corrected solution:**
```typescript
useEffect(() => {
  // Pass the already-stable functions directly
  // No need to create wrapper functions
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    console.log("Keyboard 'keydown' event:", e.code);
    handleKeyDown(e, setInput);
  });

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    console.log("Keyboard 'keyup' event:", e.code);
    handleKeyUp(e, setInput as Dispatch<SetStateAction<Partial<PlayerInput>>>);
  });

  return () => {
    window.removeEventListener("keydown", (e: KeyboardEvent) => handleKeyDown(e, setInput));
    window.removeEventListener("keyup", (e: KeyboardEvent) => handleKeyUp(e, setInput as Dispatch<SetStateAction<Partial<PlayerInput>>>));
  };
}, [handleKeyDown, handleKeyUp, setInput]);
```

**Why this is critical:** The arrow functions passed to `addEventListener` need to match the functions in the cleanup function. Using stable `useCallback` functions ensures the event listeners are attached and removed correctly.

---

#### Phase 3: Remove Keyboard Listener from Route File (CRITICAL)

**Location:** `supermario.tsx` lines 95-114

**Current state:** Commented out keyboard listener

**Action:** 
- **DELETE** the entire commented-out useEffect block (lines 95-114)
- The Provider component already handles all keyboard input
- Route component should only handle layout and children

**Why this is critical:** According to the Context Provider Pattern, keyboard handling should be in the Provider, not the route component. Having keyboard listeners in both places causes conflicts and confusion.

---

#### Phase 4: Fix the Restart Logic Bug

**Location:** `index.tsx` - Lines 318-322

**Current problematic code:**
```typescript
    // Handle restart key to start or restart game
    if (input.jumpPressed && (status === "start" || status === "paused")) {
      loadLevel(currentLevel);
      setStatus("playing");
      setTimeout(() => {
        input.left = true;  // ❌ THIS IS THE BUG
        input.right = true;
      }, 100);
      return;
    }
```

**Problem:** Direct mutation of `input` state won't work in React

**Corrected solution:**
```typescript
    // Handle restart key to start or restart game
    if (input.jumpPressed && (status === "start" || status === "paused")) {
      console.log("Restart triggered:", { status, input });
      loadLevel(currentLevel);
      setStatus("playing");
      
      // Wait a moment then set input state to start moving
      setTimeout(() => {
        setInput({ left: true, right: false });
      }, 100);
      return;
    }
```

**Why this is critical:** Without this fix, the restart logic creates an input state that will be overridden by the standard input handling, causing the player to not start moving after restart.

---

#### Phase 5: Verify setInput is Properly Passed

**Location:** SuperMarioGameProvider component

**Check:**
- `input` state should be initialized properly
- `input` state should be accessible from the context
- `input` state should update through the `setInput` function

**Verification:**
```typescript
// At the start of SuperMarioGameProvider
const [input, setInput] = useState<PlayerInput>({
  left: false,
  right: false,
  up: false,
  down: false,
  jumpPressed: false,
  jumpHeld: false,
  runHeld: false,
  runPressed: false,
});

// Add to context value
const contextValue = useMemo(
  () => ({
    // ... other state
    input: input, // Make input accessible
    setInput: setInput, // Make setInput accessible
    // ...
  }),
  [input, setInput, /* other dependencies */],
);

// Make setInput available in actions
const actions: GameActions = {
  restartLevel,
  pauseGame,
  resumeGame,
  restartGame,
  startGame,
  // ... add setInput to actions if needed
};
```

**Why this is important:** The `setInput` function must be available to both the keyboard event handlers and the context consumers.

---

### Implementation Order (Critical Path)

1. **Phase 1** (Function stability) - Must be done first, otherwise nothing else works
2. **Phase 3** (Remove from route) - Eliminates duplicate/corrupted listeners
3. **Phase 4** (Fix restart logic) - Ensures restart actually starts the game
4. **Phase 2** (Fix event listener setup) - Ensures keyboard events are properly captured
5. **Phase 5** (Verify input state) - Final check to ensure everything integrates correctly

### Testing After Fix

1. Start the game in browser
2. Press 'r' key - should start the game
3. Press Left/Right arrow keys - player should move
4. Press Space - player should jump (if on ground)
5. Check console logs for keyboard event messages
6. Verify no "useCallback must be used within..." errors

### Expected Console Logs

After the fix, you should see:
```
Keyboard 'keydown' event: KeyR
Keyboard 'keydown' event: ArrowLeft
Keyboard 'keyup' event: ArrowLeft
```

And in handleInput:
```
=== handleInput called ===
Input values: { left: false, right: false, ... }
```

---

### Summary of Changes

**Files to Edit:**
1. `vite-project/app/games/supermario/index.tsx`
   - Phase 1: Wrap handleKeyDown/handleKeyUp in useCallback
   - Phase 2: Fix keyboard event listener useEffect
   - Phase 4: Fix restart logic setTimeout to use setInput

2. `vite-project/app/routes/games/supermario.tsx`
   - Phase 3: Delete commented-out keyboard listener (lines 95-114)

**Don't change:**
- `vite-project/app/games/supermario/constants.ts`
- `vite-project/app/games/supermario/types.ts`
- `vite-project/app/games/supermario/Game.tsx`

These files are correct and follow the established pattern.
