// LevelLoader.ts - Load and validate level configuration files

import type { LevelConfig } from "./types";

// Cache for loaded levels to improve performance
const levelCache = new Map<string, LevelConfig>();

/**
 * Load a level configuration from a JSON file
 * @param levelId - The level identifier (e.g., "1-1")
 * @returns Promise resolving to the LevelConfig object
 */
export async function loadLevel(levelId: string): Promise<LevelConfig> {
  // Check cache first
  if (levelCache.has(levelId)) {
    return levelCache.get(levelId)!;
  }

  try {
    // Use Vite's dynamic import for JSON files
    const module = await import(`./levels/${levelId}.json`);
    const config = module.default;

    // Validate the level config
    const validatedConfig = validateLevelConfig(config);

    // Cache the loaded level
    levelCache.set(levelId, validatedConfig);

    return validatedConfig;
  } catch (error) {
    console.warn(`Failed to load level "${levelId}":`, error);
    console.warn("Falling back to default level configuration");

    // Return default level if file not found or invalid
    const defaultLevel = getDefaultLevel();
    levelCache.set(levelId, defaultLevel);

    return defaultLevel;
  }
}

/**
 * Validate level configuration data
 * Ensures all required fields are present and have valid values
 * @param config - The raw configuration data from JSON
 * @returns Validated LevelConfig object
 */
export function validateLevelConfig(config: any): LevelConfig {
  // Check required fields
  const requiredFields = [
    "id",
    "name",
    "width",
    "height",
    "groundHeight",
    "skyColor",
    "marioStart",
    "flagpole",
    "pipes",
    "enemies",
    "coins",
  ];

  for (const field of requiredFields) {
    if (!(field in config)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate types and structures
  if (typeof config.id !== "string") {
    throw new Error("Level id must be a string");
  }

  if (typeof config.name !== "string") {
    throw new Error("Level name must be a string");
  }

  if (typeof config.width !== "number" || config.width <= 0) {
    throw new Error("Level width must be a positive number");
  }

  if (typeof config.height !== "number" || config.height <= 0) {
    throw new Error("Level height must be a positive number");
  }

  if (typeof config.groundHeight !== "number" || config.groundHeight <= 0) {
    throw new Error("Ground height must be a positive number");
  }

  // Validate skyColor structure
  if (
    !config.skyColor ||
    typeof config.skyColor.top !== "string" ||
    typeof config.skyColor.bottom !== "string"
  ) {
    throw new Error("Invalid skyColor structure");
  }

  // Validate marioStart structure
  if (
    !config.marioStart ||
    typeof config.marioStart.x !== "number" ||
    typeof config.marioStart.y !== "number"
  ) {
    throw new Error("Invalid marioStart structure");
  }

  // Validate flagpole structure
  if (
    !config.flagpole ||
    typeof config.flagpole.x !== "number" ||
    typeof config.flagpole.height !== "number"
  ) {
    throw new Error("Invalid flagpole structure");
  }

  // Validate arrays
  if (!Array.isArray(config.pipes)) {
    throw new Error("Pipes must be an array");
  }

  if (!Array.isArray(config.enemies)) {
    throw new Error("Enemies must be an array");
  }

  if (!Array.isArray(config.coins)) {
    throw new Error("Coins must be an array");
  }

  // Validate optional arrays if present
  if (config.platforms && !Array.isArray(config.platforms)) {
    throw new Error("Platforms must be an array");
  }

  if (config.blocks && !Array.isArray(config.blocks)) {
    throw new Error("Blocks must be an array");
  }

  // Validate individual platform configs
  if (config.platforms) {
    config.platforms.forEach((platform: any, index: number) => {
      if (typeof platform.x !== "number") {
        throw new Error(`Platform ${index}: x must be a number`);
      }
      if (typeof platform.y !== "number") {
        throw new Error(`Platform ${index}: y must be a number`);
      }
      if (typeof platform.width !== "number" || platform.width <= 0) {
        throw new Error(`Platform ${index}: width must be a positive number`);
      }
      if (typeof platform.height !== "number" || platform.height <= 0) {
        throw new Error(`Platform ${index}: height must be a positive number`);
      }
    });
  }

  // Validate individual block configs
  if (config.blocks) {
    config.blocks.forEach((block: any, index: number) => {
      if (typeof block.x !== "number") {
        throw new Error(`Block ${index}: x must be a number`);
      }
      if (typeof block.y !== "number") {
        throw new Error(`Block ${index}: y must be a number`);
      }
      if (!block.type || typeof block.type !== "string") {
        throw new Error(`Block ${index}: type must be a string`);
      }
      if (block.contents && typeof block.contents !== "string") {
        throw new Error(`Block ${index}: contents must be a string`);
      }
    });
  }

  // Return validated config
  return config as LevelConfig;
}

/**
 * Get a default level configuration as fallback
 * @returns A basic LevelConfig object
 */
export function getDefaultLevel(): LevelConfig {
  return {
    id: "default",
    name: "Default Level",
    width: 3000,
    height: 600,
    groundHeight: 80,
    skyColor: {
      top: "#5c94fc",
      bottom: "#87ceeb",
    },
    marioStart: {
      x: 100,
      y: 480,
    },
    flagpole: {
      x: 2900,
      height: 250,
    },
    pipes: [
      { x: 450, height: 80 },
      { x: 650, height: 100 },
      { x: 900, height: 60 },
      { x: 1200, height: 120 },
      { x: 1500, height: 80 },
      { x: 1800, height: 100 },
      { x: 2200, height: 80 },
      { x: 2500, height: 100 },
    ],
    enemies: [
      { x: 600, walkRange: 150, type: "GOOMBA" },
      { x: 1100, walkRange: 150, type: "GOOMBA" },
      { x: 1600, walkRange: 150, type: "GOOMBA" },
      { x: 2100, walkRange: 150, type: "GOOMBA" },
    ],
    coins: [
      { x: 300, y: 400 },
      { x: 500, y: 420 },
      { x: 900, y: 400 },
      { x: 1300, y: 420 },
      { x: 1700, y: 400 },
      { x: 2000, y: 420 },
      { x: 2300, y: 400 },
      { x: 2600, y: 420 },
    ],
  };
}

/**
 * Clear the level cache (useful for development/reloading)
 */
export function clearLevelCache(): void {
  levelCache.clear();
}

/**
 * Pre-load multiple levels for better performance
 * @param levelIds - Array of level IDs to preload
 */
export async function preloadLevels(levelIds: string[]): Promise<void> {
  const promises = levelIds.map((id) => loadLevel(id));
  await Promise.all(promises);
}
