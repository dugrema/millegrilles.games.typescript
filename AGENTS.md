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
