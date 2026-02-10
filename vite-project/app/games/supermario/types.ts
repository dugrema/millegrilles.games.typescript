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
  loadLevel: (levelConfig: LevelConfig) => void;
  currentLevel: LevelConfig | null;
  blocks: Block[];
}

/* Props for the provider */
export interface SuperMarioProviderProps {
  children: ReactNode;
}

/* Level configuration types */
export interface Block {
  type: "ground" | "breakable" | "mystery" | "hard" | "player";
  x: number;
  y: number;
  width: number;
  height: number;
  health?: number;
  content?: "coin" | "mushroom" | "star";
}

export interface LevelConfig {
  name: string;
  description?: string;
  levelData: string[];
  width: number;
  height: number;
  playerStartX?: number;
  playerStartY?: number;
}
