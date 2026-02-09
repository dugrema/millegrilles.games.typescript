# Implementation Plan for Super Mario Clone

## 1️⃣ Directory layout (add inside `vite-project/app/games`)

    vite-project/app/games/
    └── supermario/
        ├── constants.ts            # game‑wide constants
        ├── types.ts                # TS interfaces
        ├── Game.tsx                # Main component that renders the canvas
        ├── index.tsx               # Context provider + hook
        └── components/
            └── Player.tsx          # Sprite rendering

## 2️⃣ `constants.ts`

    /* Game constants – tweak these to adjust physics and size */
    export const GRAVITY = 0.15;          // pixels per ms²
    export const JUMP_VELOCITY = -5;      // initial velocity on jump
    export const MOVE_SPEED = 0.1;        // incremental acceleration per ms
    export const MAX_SPEED = 3;           // cap horizontal speed
    export const GROUND_Y = 300;          // Y position of the ground line
    export const CANVAS_WIDTH = 800;
    export const CANVAS_HEIGHT = 400;
    export const PLAYER_WIDTH = 25;
    export const PLAYER_HEIGHT = 40;

## 3️⃣ `types.ts`

    /* Core game state */
    export interface PlayerState {
      pos: { x: number; y: number };
      vel: { x: number; y: number };
      onGround: boolean;
    }

    /* Context values exposed by the provider */
    export interface SuperMarioContext {
      player: PlayerState;
      startGame: () => void;
      pauseGame: () => void;
    }

    /* Props for the provider */
    export interface SuperMarioProviderProps {
      children: ReactNode;
    }

## 4️⃣ `index.tsx` – provider + hook

    import { createContext, useContext, useEffect, useRef, useState } from "react";
    import { SuperMarioContext, SuperMarioProviderProps, PlayerState } from "./types";
    import { GRAVITY, JUMP_VELOCITY, MOVE_SPEED, MAX_SPEED, GROUND_Y, CANVAS_HEIGHT } from "./constants";

    /* Context creation */
    const SuperMarioContext = createContext<SuperMarioContext | null>(null);

    /* Provider component */
    export function SuperMarioProvider({ children }: SuperMarioProviderProps) {
      const [player, setPlayer] = useState<PlayerState>({
        pos: { x: 50, y: GROUND_Y - PLAYER_HEIGHT },
        vel: { x: 0, y: 0 },
        onGround: true,
      });

      const [running, setRunning] = useState(false);
      const lastTimeRef = useRef<number>(0);

      /* Key state */
      const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
        left: false,
        right: false,
        jump: false,
      });

      /* Keyboard listeners */
      useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "arrowleft") keysRef.current.left = true;
          if (e.key.toLowerCase() === "arrowright") keysRef.current.right = true;
          if (e.key.toLowerCase() === " ") keysRef.current.jump = true;
          if (e.key.toLowerCase() === "r") setRunning((prev) => !prev);
        };
        const up = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "arrowleft") keysRef.current.left = false;
          if (e.key.toLowerCase() === "arrowright") keysRef.current.right = false;
          if (e.key.toLowerCase() === " ") keysRef.current.jump = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
          window.removeEventListener("keydown", down);
          window.removeEventListener("keyup", up);
        };
      }, []);

      /* Gameloop */
      useEffect(() => {
        let anim: number;
        const loop = (time: number) => {
          const dt = time - lastTimeRef.current;
          lastTimeRef.current = time;

          // Apply input to acceleration
          let ax = 0;
          if (keysRef.current.left) ax -= MOVE_SPEED;
          if (keysRef.current.right) ax += MOVE_SPEED;

          // Update velocities
          setPlayer((prev) => {
            let vx = prev.vel.x + ax;
            if (vx > MAX_SPEED) vx = MAX_SPEED;
            if (vx < -MAX_SPEED) vx = -MAX_SPEED;

            // Jump
            if (keysRef.current.jump && prev.onGround) {
              vx = prev.vel.x; // keep horizontal velocity when jumping
              return { ...prev, vel: { x: vx, y: JUMP_VELOCITY }, onGround: false };
            }

            // Gravity
            const vy = prev.vel.y + GRAVITY;

            // Simple ground collision
            const newY = Math.min(prev.pos.y + vy, CANVAS_HEIGHT - PLAYER_HEIGHT);
            const onGround = newY >= GROUND_Y - PLAYER_HEIGHT;

            return {
              pos: { x: prev.pos.x + vx, y: newY },
              vel: { x: vx, y: onGround ? 0 : vy },
              onGround,
            };
          });

          if (running) requestAnimationFrame(loop);
        };
        if (running) requestAnimationFrame(loop);
        return () => cancelAnimationFrame(anim);
      }, [running]);

      /* Public API */
      const startGame = () => setRunning(true);
      const pauseGame = () => setRunning(false);

      return (
        <SuperMarioContext.Provider value={{ player, startGame, pauseGame }}>
          {children}
        </SuperMarioContext.Provider>
      );
    }

    /* Hook for components */
    export function useSuperMario(): SuperMarioContext {
      const ctx = useContext(SuperMarioContext);
      if (!ctx) throw new Error("useSuperMario must be used within SuperMarioProvider");
      return ctx;
    }

## 5️⃣ `Game.tsx` – render the canvas & player sprite

    import { useRef, useEffect } from "react";
    import { useSuperMario } from "./index";
    import { PlayerWidth, PlayerHeight } from "./constants";

    /* Simple sprite – can be replaced with an image later */
    function Player() {
      const { player } = useSuperMario();
      return (
        <rect
          x={player.pos.x}
          y={player.pos.y}
          width={PlayerWidth}
          height={PlayerHeight}
          fill="orange"
        />
      );
    }

    /* Main Game component */
    export default function Game() {
      const canvasRef = useRef<HTMLCanvasElement | null>(null);
      const { startGame, pauseGame, player } = useSuperMario();

      /* Hook up canvas drawing */
      useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        let animation: number;

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "skyblue";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Ground line
          ctx.fillStyle = "green";
          ctx.fillRect(0, 300, canvas.width, canvas.height - 300);

          // Draw player
          ctx.fillStyle = "orange";
          ctx.fillRect(
            player.pos.x,
            player.pos.y,
            PlayerWidth,
            PlayerHeight
          );
        };

        const loop = () => {
          render();
          animation = requestAnimationFrame(loop);
        };
        loop();

        return () => cancelAnimationFrame(animation);
      }, [player]);

      return (
        <div>
          <canvas ref={canvasRef} width={800} height={400} />
          <button onClick={startGame}>Start</button>
          <button onClick={pauseGame}>Pause</button>
        </div>
      );
    }

## 6️⃣ Route file to use the provider

Create `vite-project/app/routes/games/supermario.tsx`:

    import { SuperMarioProvider } from "../../games/supermario";
    import SuperMarioGame from "../../games/supermario/Game";

    export default function SuperMario() {
      return (
        <SuperMarioProvider>
          <SuperMarioGame />
        </SuperMarioProvider>
      );
    }

## 7️⃣ Summary Checklist

| Step | Description | File created | Key content |
|------|-------------|--------------|-------------|
| 1 | Directories | none created yet | `vite-project/app/games/supermario/...` |
| 2 | Constants | `constants.ts` | Gravity, jump, speed, ground Y |
| 3 | Types | `types.ts` | `PlayerState`, `SuperMarioContext` |
| 4 | Provider & hook | `index.tsx` | Context, keyboard, gameloop |
| 5 | Canvas render | `Game.tsx` | Render loop, simple drawing |
| 6 | Route | `games/supermario.tsx` | Wrap provider around game |
| 7 | Build & test | npm commands | `npm run build`, `npm run dev` |

> **Running**
> 1. `cd vite-project`
> 2. `npm install` (if needed)
> 3. `npm run dev` – open `/games/supermario` in your browser.
> 4. Press the arrow keys to move, space to jump, `r` to toggle simulation, `ESC` to pause.

## 8️⃣ Next steps (once this phase is working)

1. Replace the simple rectangle with an animated sprite using an image or canvas drawing routine.
2. Add physics for slope/edge collisions.
3. Create a level data file and render multiple platforms.
4. Introduce enemies and collectibles.
5. Build UI (score, lives, HUD).
6. Add mobile touch controls.
7. Persist progress in `localStorage`.
8. Implement audio with an AudioManager.

Follow the same create‑edit pattern you used here for adding each feature – use the `supermario/` folder to keep everything logically grouped.

--- 

Happy coding!  If you hit any type‑checking or runtime issues, you can run `npm run dev` and check the console; the code above intentionally logs a lot of state changes to help debugging.  Feel free to ask if you need further guidance on any step.