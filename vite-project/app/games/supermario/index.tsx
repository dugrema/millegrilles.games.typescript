import type {
  SuperMarioContext,
  SuperMarioProviderProps,
  PlayerState,
} from "./types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  GRAVITY,
  JUMP_VELOCITY,
  MOVE_SPEED,
  MAX_SPEED,
  GROUND_Y,
  CANVAS_HEIGHT,
  PLAYER_HEIGHT,
} from "./constants";

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
    let anim: number = 0;
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

      if (running) {
        anim = requestAnimationFrame(loop);
      }
    };
    if (running) {
      anim = requestAnimationFrame(loop);
    }
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
  if (!ctx)
    throw new Error("useSuperMario must be used within SuperMarioProvider");
  return ctx;
}

export default SuperMarioProvider;
