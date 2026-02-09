// Type definitions for Super Mario game

import type { ReactNode } from "react";

/* Core game state */
export interface PlayerState {
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  onGround: boolean;
  cameraOffset: { x: number; y: number };
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
