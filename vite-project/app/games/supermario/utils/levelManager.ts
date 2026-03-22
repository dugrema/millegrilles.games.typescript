/**
 * Level Manager Utility
 * Handles level metadata, progression, and configuration loading
 */

import type { LevelConfig } from "../types";

// Cache for level metadata to avoid repeated dynamic imports
const levelMetadataCache = new Map<string, {
  world: number;
  level: number;
  nextLevelId?: string;
  isFinalLevel: boolean;
}>();

/**
 * Get the ID of the next level after completing the current level
 * @param currentLevelId - The ID of the current level
 * @returns The ID of the next level, or undefined if this is the final level
 */
export async function getNextLevelId(currentLevelId: string): Promise<string | undefined> {
  const metadata = levelMetadataCache.get(currentLevelId);
  if (metadata) {
    return metadata.nextLevelId;
  }

  const config = await loadLevelConfigOnly(currentLevelId);
  if (config) {
    return config.nextLevelId;
  }

  return undefined;
}

/**
 * Check if a level is the final level
 * @param levelId - The ID of the level to check
 * @returns true if this is the final level, false otherwise
 */
export async function isFinalLevel(levelId: string): Promise<boolean> {
  const metadata = levelMetadataCache.get(levelId);
  if (metadata) {
    return metadata.isFinalLevel;
  }

  const config = await loadLevelConfigOnly(levelId);
  if (config) {
    return config.isFinalLevel;
  }

  return true; // Default to final if config not found
}

/**
 * Get level information (world and level numbers)
 * @param levelId - The ID of the level
 * @returns Object with world and level numbers, or undefined if not found
 */
export async function getLevelInfo(levelId: string): Promise<{
  world: number;
  level: number;
} | undefined> {
  const metadata = levelMetadataCache.get(levelId);
  if (metadata) {
    return {
      world: metadata.world,
      level: metadata.level,
    };
  }

  const config = await loadLevelConfigOnly(levelId);
  if (config) {
    return {
      world: config.world,
      level: config.level,
    };
  }

  return undefined;
}

/**
 * Load level configuration without rendering entities
 * Used for quick metadata access
 * @param levelId - The ID of the level to load
 * @returns LevelConfig with metadata, or undefined if not found
 */
export async function loadLevelConfigOnly(levelId: string): Promise<LevelConfig | undefined> {
  try {
    // Dynamic import of level JSON file
    const module = await import(`../levels/${levelId}.json`);
    const config: LevelConfig = module.default;

    // Extract and cache metadata
    const metadata = {
      world: config.world,
      level: config.level,
      nextLevelId: config.nextLevelId,
      isFinalLevel: config.isFinalLevel,
    };

    levelMetadataCache.set(levelId, metadata);

    return {
      ...config,
      world: metadata.world,
      level: metadata.level,
      nextLevelId: metadata.nextLevelId,
      isFinalLevel: metadata.isFinalLevel,
    };
  } catch (error) {
    console.error(`Failed to load level config for ${levelId}:`, error);
    return undefined;
  }
}

/**
 * Get all available level IDs in progression order
 * @returns Array of level IDs
 */
export async function getAllLevels(): Promise<string[]> {
  // For now, hardcode the level progression
  // This could be made dynamic with a levels manifest file
  return ["1-1", "1-2"];
}

/**
 * Check if a level ID exists
 * @param levelId - The level ID to check
 * @returns true if the level exists, false otherwise
 */
export async function levelExists(levelId: string): Promise<boolean> {
  const config = await loadLevelConfigOnly(levelId);
  return config !== undefined;
}
