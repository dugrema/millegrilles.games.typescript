import React, { useState, useCallback, useEffect, useRef } from "react";

import { type InputState } from "../types";

// Input key mapping
export const INPUT_KEYS: Record<string, keyof InputState> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  Space: "start",
  r: "restart",
  Enter: "restart",
  Shift: "run",
  z: "jump",
  x: "run",
  a: "left",
  d: "right",
  w: "up",
  s: "down",
} as const;

// InputHandler component props
export interface InputHandlerProps {
  onInputChange?: (input: Partial<InputState>) => void;
  enabled?: boolean;
}

/**
 * InputHandler component for centralized input management
 */
export function InputHandler({
  onInputChange,
  enabled = true,
}: InputHandlerProps) {
  // Keyboard state
  const [input, setInput] = useState<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    run: false,
    duck: false,
    pause: false,
    restart: false,
    start: false,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle keyboard down events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== "Space" && !enabled) return;
      // Prevent default scrolling for game keys
      const gameKeys = [
        "Space",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ];
      if (gameKeys.includes(e.code) || INPUT_KEYS[e.key]) {
        e.preventDefault();
      }

      // Only process input if focus is not on input elements
      if (document.activeElement?.tagName === "INPUT") return;

      const action = INPUT_KEYS[e.key];
      if (action && !keysPressed.current.has(e.key)) {
        keysPressed.current.add(e.key);
        setInput((prev) => {
          const newState = { ...prev, [action]: true };
          onInputChange?.(newState);

          // Handle start action specially
          if (action === "start") {
            onInputChange?.({ start: true });
          }

          return newState;
        });
      }
    },
    [enabled, onInputChange],
  );

  // Handle keyboard up events
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const action = INPUT_KEYS[e.key];
      if (action) {
        keysPressed.current.delete(e.key);
        setInput((prev) => {
          const newState = { ...prev, [action]: false };
          onInputChange?.(newState);

          // Handle start action specially
          if (action === "start") {
            onInputChange?.({ start: false });
          }

          return newState;
        });
      }
    },
    [enabled, onInputChange],
  );

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: TouchEvent, action: keyof InputState) => {
      e.preventDefault();
      if (!enabled) return;

      if (!keysPressed.current.has(action.toString())) {
        keysPressed.current.add(action.toString());
        setInput((prev) => {
          const newState = { ...prev, [action]: true };
          onInputChange?.(newState);
          return newState;
        });
      }
    },
    [enabled, onInputChange],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent, action: keyof InputState) => {
      e.preventDefault();
      if (!enabled) return;

      keysPressed.current.delete(action.toString());
      setInput((prev) => {
        const newState = { ...prev, [action]: false };
        onInputChange?.(newState);
        return newState;
      });
    },
    [enabled, onInputChange],
  );

  // Initialize event listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  return (
    <div
      ref={canvasRef}
      data-game-canvas="true"
      data-input-enabled={enabled.toString()}
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}

/**
 * Custom hook for accessing input state
 */
export function useInputState(): InputState {
  const [input, setInput] = useState<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    run: false,
    duck: false,
    pause: false,
    restart: false,
    start: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = INPUT_KEYS[e.key];
      if (action !== undefined) {
        setInput((prev) => ({ ...prev, [action]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const action = INPUT_KEYS[e.key];
      if (action !== undefined) {
        setInput((prev) => ({ ...prev, [action]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return input;
}

/**
 * Custom hook for checking if a key is currently pressed
 */
export function useKeyPress(key: string): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === key) {
        setIsPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [key]);

  return isPressed;
}

/**
 * Custom hook for handling game input actions
 */
export function useGameActions(input: InputState) {
  const handleInput = useCallback(
    (action: keyof InputState, pressed: boolean) => {
      // Input actions logic here
      if (action === "pause" && pressed) {
        // Toggle pause
      } else if (action === "restart" && pressed) {
        // Restart game
      } else if (action === "run" && pressed) {
        // Start running
      }
    },
    [],
  );

  return {
    handleInput,
    isLeft: input.left,
    isRight: input.right,
    isJump: input.jump,
    isRun: input.run,
    isPause: input.pause,
    isRestart: input.restart,
  };
}
