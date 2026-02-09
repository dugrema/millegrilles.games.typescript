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
  FRICTION_FACTOR,
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
      setPlayer((prev) => {
        // Apply input to acceleration
        let ax = 0;
        if (keysRef.current.left) ax -= MOVE_SPEED;
        if (keysRef.current.right) ax += MOVE_SPEED;

        // Apply friction (damping) to gradually stop the player
        ax += (0 - prev.vel.x) * FRICTION_FACTOR;

        // Update velocities
        let vx = prev.vel.x + ax;
        if (vx > MAX_SPEED) vx = MAX_SPEED;
        if (vx < -MAX_SPEED) vx = -MAX_SPEED;

        // Jump
        if (keysRef.current.jump && prev.onGround) {
          return { ...prev, vel: { x: vx, y: JUMP_VELOCITY }, onGround: false };
        }

        // Gravity
        let vy = prev.vel.y + GRAVITY;

        // Ground collision with push-out and horizontal velocity reset
        const groundLevel = GROUND_Y - PLAYER_HEIGHT;
        let newY = prev.pos.y + vy;
        if (newY > groundLevel) {
          // Player sank into ground - push them out
          newY = groundLevel;
          vy = 0;
        }
        const onGround = newY >= groundLevel;
        const finalVx = onGround ? 0 : vx;

        return {
          pos: { x: prev.pos.x + vx, y: newY },
          vel: { x: finalVx, y: onGround ? 0 : vy },
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
