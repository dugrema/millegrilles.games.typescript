// levelSystem.test.ts - Test utilities for level configuration system
// This file provides helper functions to test and debug level loading

import { loadLevel } from "./LevelLoader";
import { renderLevel } from "./LevelRenderer";
import type { LevelConfig } from "./types";

/**
 * Test level loading functionality
 * Can be used in browser console or as part of integration tests
 */
export async function testLevelLoading(levelId: string = "1-1") {
  console.log(`\n=== Testing Level Loading: ${levelId} ===`);

  try {
    // Load the level
    const startTime = performance.now();
    const config = await loadLevel(levelId);
    const loadTime = performance.now() - startTime;

    console.log(`✅ Level loaded successfully in ${loadTime.toFixed(2)}ms`);
    console.log(`   Level ID: ${config.id}`);
    console.log(`   Level Name: ${config.name}`);
    console.log(`   Level Width: ${config.width}px`);
    console.log(`   Level Height: ${config.height}px`);
    console.log(`   Ground Height: ${config.groundHeight}px`);
    console.log(`   Mario Start: (${config.marioStart.x}, ${config.marioStart.y})`);
    console.log(`   Flagpole: x=${config.flagpole.x}, height=${config.flagpole.height}`);
    console.log(`   Pipes: ${config.pipes.length}`);
    console.log(`   Enemies: ${config.enemies.length}`);
    console.log(`   Coins: ${config.coins.length}`);

    // Render the level
    const renderStartTime = performance.now();
    const rendered = renderLevel(config);
    const renderTime = performance.now() - renderStartTime;

    console.log(`\n✅ Level rendered in ${renderTime.toFixed(2)}ms`);
    console.log(`   Pipes: ${rendered.pipes.length} entities`);
    console.log(`   Enemies: ${rendered.enemies.length} entities`);
    console.log(`   Coins: ${rendered.coins.length} entities`);
    console.log(`   Flagpole: x=${rendered.flagpole.x}, y=${rendered.flagpole.y}`);
    console.log(`   Mario Start: x=${rendered.marioStart.x}, y=${rendered.marioStart.y}`);

    // Detailed entity info
    console.log(`\n📊 Pipe positions:`);
    rendered.pipes.forEach((pipe, i) => {
      console.log(`   Pipe ${i}: x=${pipe.x}, y=${pipe.y}, w=${pipe.width}, h=${pipe.height}`);
    });

    console.log(`\n📊 Enemy positions:`);
    rendered.enemies.forEach((enemy, i) => {
      console.log(`   Enemy ${i}: x=${enemy.x}, walkStart=${enemy.walkStart}, walkRange=${enemy.walkRange}`);
    });

    console.log(`\n📊 Coin positions:`);
    rendered.coins.forEach((coin, i) => {
      console.log(`   Coin ${i}: x=${coin.x}, y=${coin.y}`);
    });

    return { config, rendered };
  } catch (error) {
    console.error(`❌ Failed to load level ${levelId}:`, error);
    return null;
  }
}

/**
 * Test default level fallback
 */
export async function testDefaultLevelFallback() {
  console.log(`\n=== Testing Default Level Fallback ===`);

  // Try to load a non-existent level
  const config = await loadLevel("non-existent-level");

  console.log(`✅ Fallback level loaded: ${config.id}`);
  console.log(`   Name: ${config.name}`);
  console.log(`   Pipes: ${config.pipes.length}`);
  console.log(`   Enemies: ${config.enemies.length}`);
  console.log(`   Coins: ${config.coins.length}`);

  return config;
}

/**
 * Validate level integrity
 */
export function validateLevelIntegrity(config: LevelConfig, rendered: ReturnType<typeof renderLevel>) {
  console.log(`\n=== Validating Level Integrity ===`);

  let hasErrors = false;

  // Check level dimensions
  if (rendered.flagpole.x >= config.width) {
    console.error(`❌ Flagpole (${rendered.flagpole.x}) is beyond level width (${config.width})`);
    hasErrors = true;
  }

  // Check pipe bounds
  for (let i = 0; i < rendered.pipes.length; i++) {
    const pipe = rendered.pipes[i];
    if (pipe.x + pipe.width > config.width) {
      console.error(`❌ Pipe ${i} extends beyond level bounds`);
      hasErrors = true;
    }
  }

  // Check enemy bounds
  for (let i = 0; i < rendered.enemies.length; i++) {
    const enemy = rendered.enemies[i];
    if (enemy.x < 0 || enemy.x + enemy.width > config.width) {
      console.error(`❌ Enemy ${i} is out of bounds`);
      hasErrors = true;
    }
  }

  // Check coin bounds
  for (let i = 0; i < rendered.coins.length; i++) {
    const coin = rendered.coins[i];
    if (coin.x < 0 || coin.x > config.width || coin.y < 0 || coin.y > config.height) {
      console.error(`❌ Coin ${i} is out of bounds`);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log(`✅ Level integrity check passed!`);
  }

  return !hasErrors;
}

/**
 * Run all tests
 */
export async function runAllLevelTests() {
  console.log("========================================");
  console.log("  SUPER MARIO LEVEL SYSTEM TESTS");
  console.log("========================================");

  // Test 1: Load default level
  const result1 = await testLevelLoading("1-1");
  if (result1) {
    validateLevelIntegrity(result1.config, result1.rendered);
  }

  // Test 2: Test fallback
  await testDefaultLevelFallback();

  console.log("\n========================================");
  console.log("  TESTS COMPLETE");
  console.log("========================================\n");
}
