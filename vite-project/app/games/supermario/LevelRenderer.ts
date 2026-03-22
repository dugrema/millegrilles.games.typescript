// LevelRenderer.ts - Convert LevelConfig to game entities

import type {
  LevelConfig,
  Pipe,
  Enemy,
  Coin,
  Flagpole,
  Mario,
  Platform,
  Block,
  Mushroom,
  Ground,
  GroundConfig,
  MushroomType,
} from "./types";
import {
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  PIPE_WIDTH,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_SPEED,
  ENEMY_COLOR,
  COIN_WIDTH,
  COIN_HEIGHT,
  FLAGPOLE_WIDTH,
  FLAGPOLE_HEIGHT,
  MARIO_WIDTH,
  MARIO_HEIGHT,
  MARIO_COLOR,
  PLATFORM_HEIGHT,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
} from "./constants";

/**
 * Render a complete level from its configuration
 * Converts LevelConfig data into runtime game entities
 * @param config - The level configuration
 * @returns Object containing all rendered game entities
 */
export function renderLevel(config: LevelConfig): {
  pipes: Pipe[];
  enemies: Enemy[];
  coins: Coin[];
  platforms: Platform[];
  blocks: Block[];
  mushrooms: Mushroom[];
  oneUpMushrooms: Mushroom[];
  grounds: Ground[];
  flagpole: Flagpole;
  marioStart: Partial<Mario>;
  levelWidth: number;
} {
  const pipes = renderPipes(config);
  const enemies = renderEnemies(config);
  const coins = renderCoins(config);
  const platforms = renderPlatforms(config);
  const blocks = renderBlocks(config);
  const grounds = renderGrounds(config);
  const flagpole = renderFlagpole(config);
  const marioStart = renderMarioStart(config);
  const oneUpMushrooms = renderOneUpMushrooms(config);

  return {
    pipes,
    enemies,
    coins,
    platforms,
    blocks,
    grounds,
    mushrooms: [], // Mushrooms are spawned dynamically from blocks
    oneUpMushrooms,
    flagpole,
    marioStart,
    levelWidth: config.width,
  };
}

/**
 * Render pipes from configuration
 * Converts PipeConfig array to Pipe entities with full Y positioning
 */
function renderPipes(config: LevelConfig): Pipe[] {
  return config.pipes.map((pipeConfig, index) => {
    // Pipe extends from top of ground to screen bottom
    const y = CANVAS_HEIGHT - config.groundHeight - pipeConfig.height;
    const height = CANVAS_HEIGHT - config.groundHeight - y;

    return {
      id: `pipe-${config.id}-${index}`,
      x: pipeConfig.x,
      y: y,
      width: PIPE_WIDTH,
      height: height,
    };
  });
}

/**
 * Render enemies from configuration
 * Converts EnemyConfig array to Enemy entities with initial velocity
 */
function renderEnemies(config: LevelConfig): Enemy[] {
  return config.enemies.map((enemyConfig, index) => ({
    id: `enemy-${config.id}-${index}`,
    x: enemyConfig.x,
    y: CANVAS_HEIGHT - config.groundHeight - ENEMY_HEIGHT,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    velocityX: ENEMY_SPEED,
    velocityY: 0, // Initial vertical velocity for gravity
    walkStart: enemyConfig.x,
    walkRange: enemyConfig.walkRange,
    color: ENEMY_COLOR,
    alive: true,
  }));
}

/**
 * Render coins from configuration
 * Converts CoinConfig array to Coin entities
 */
function renderCoins(config: LevelConfig): Coin[] {
  return config.coins.map((coinConfig, index) => ({
    id: `coin-${config.id}-${index}`,
    x: coinConfig.x,
    y: coinConfig.y,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    collected: false,
  }));
}

/**
 * Render platforms from configuration
 * Converts PlatformConfig array to Platform entities
 */
function renderPlatforms(config: LevelConfig): Platform[] {
  if (!config.platforms) {
    return [];
  }

  return config.platforms.map((platformConfig, index) => ({
    id: `platform-${config.id}-${index}`,
    x: platformConfig.x,
    y: platformConfig.y,
    width: platformConfig.width,
    height: platformConfig.height || PLATFORM_HEIGHT,
    type: platformConfig.type || "BRICK",
  }));
}

/**
 * Render blocks from configuration
 * Converts BlockConfig array to Block entities
 */
function renderBlocks(config: LevelConfig): Block[] {
  if (!config.blocks) {
    return [];
  }

  return config.blocks.map((blockConfig, index) => ({
    id: `block-${config.id}-${index}`,
    x: blockConfig.x,
    y: blockConfig.y,
    width: BLOCK_WIDTH,
    height: BLOCK_HEIGHT,
    type: blockConfig.type,
    contents: blockConfig.contents || null,
    used: false,
  }));
}

/**
 * Render ground segments from configuration
 * Converts GroundConfig array to Ground entities with full Y positioning
 * If no ground config provided, creates a continuous ground across entire level
 */
function renderGrounds(config: LevelConfig): Ground[] {
  // If ground segments not specified, create a continuous ground
  if (!config.ground || config.ground.length === 0) {
    return [
      {
        id: `ground-${config.id}-0`,
        x: 0,
        y: CANVAS_HEIGHT - config.groundHeight,
        width: config.width,
        height: config.groundHeight,
      },
    ];
  }

  // Render ground segments from config
  return config.ground.map((groundConfig, index) => ({
    id: `ground-${config.id}-${index}`,
    x: groundConfig.x,
    y: CANVAS_HEIGHT - config.groundHeight,
    width: groundConfig.width,
    height: config.groundHeight,
  }));
}

/**
 * Render flagpole from configuration
 * Converts flagpole config to Flagpole entity
 */
function renderFlagpole(config: LevelConfig): Flagpole {
  const y = CANVAS_HEIGHT - config.groundHeight - config.flagpole.height;

  return {
    x: config.flagpole.x,
    y: y,
    width: FLAGPOLE_WIDTH,
    height: FLAGPOLE_HEIGHT,
  };
}

/**
 * Render 1UP mushrooms from configuration
 * Converts OneUpMushroomConfig array to Mushroom entities
 */
function renderOneUpMushrooms(config: LevelConfig): Mushroom[] {
  if (!config.oneUpMushrooms || config.oneUpMushrooms.length === 0) {
    return [];
  }

  return config.oneUpMushrooms.map((mushroomConfig, index) => ({
    id: `1up-${config.id}-${index}`,
    x: mushroomConfig.x,
    y: mushroomConfig.y,
    width: 32, // Standard mushroom width
    height: 32, // Standard mushroom height
    velocityX: 2, // Starting horizontal velocity
    velocityY: 0, // Initial vertical velocity
    active: true,
    spawnTime: 0, // Will be set when spawned
    type: "1UP" as MushroomType,
  }));
}

/**
 * Render Mario starting position from configuration
 * Converts marioStart config to initial Mario state
 */
function renderMarioStart(config: LevelConfig): Partial<Mario> {
  return {
    x: config.marioStart.x,
    y: config.marioStart.y,
    width: MARIO_WIDTH,
    height: MARIO_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    isJumping: false,
    facingRight: true,
    color: MARIO_COLOR,
  };
}

/**
 * Validate level entities after rendering
 * Checks for overlapping entities and out-of-bounds positions
 * @param config - The level configuration
 * @param rendered - The rendered entities
 * @returns Array of warnings (does not throw)
 */
export function validateLevelEntities(
  config: LevelConfig,
  rendered: ReturnType<typeof renderLevel>,
): string[] {
  const warnings: string[] = [];

  // Check if flagpole is within level bounds
  if (rendered.flagpole.x >= config.width) {
    warnings.push(
      `Flagpole x-position (${rendered.flagpole.x}) is beyond level width (${config.width})`,
    );
  }

  // Check if any pipes are beyond level bounds
  rendered.pipes.forEach((pipe, index) => {
    if (pipe.x + pipe.width > config.width) {
      warnings.push(`Pipe ${index} extends beyond level bounds`);
    }
  });

  // Check if any platforms are beyond level bounds
  rendered.platforms.forEach((platform, index) => {
    if (platform.x + platform.width > config.width) {
      warnings.push(`Platform ${index} extends beyond level bounds`);
    }
  });

  // Check if any blocks are beyond level bounds
  rendered.blocks.forEach((block, index) => {
    if (block.x + block.width > config.width) {
      warnings.push(`Block ${index} extends beyond level bounds`);
    }
  });

  // Check for overlapping entities (optional warning)
  checkOverlaps(rendered.pipes, rendered.enemies, "Pipe-Enemy overlaps");

  return warnings;
}

/**
 * Check for overlapping entities (utility function)
 */
function checkOverlaps(
  pipes: Pipe[],
  enemies: Enemy[],
  warningPrefix: string,
): void {
  for (const pipe of pipes) {
    for (const enemy of enemies) {
      if (
        enemy.x < pipe.x + pipe.width &&
        enemy.x + enemy.width > pipe.x &&
        enemy.y < CANVAS_HEIGHT && // Enemy on same vertical level as pipe
        enemy.y + enemy.height > pipe.y
      ) {
        console.warn(
          `${warningPrefix}: Pipe at ${pipe.x}, Enemy at ${enemy.x}`,
        );
      }
    }
  }
}

/**
 * Convert legacy procedural generation output to LevelConfig format
 * Useful for backwards compatibility or migration
 */
export function convertToLevelConfig(
  pipes: Pipe[],
  enemies: Enemy[],
  coins: Coin[],
  flagpole: Flagpole,
): LevelConfig {
  const groundHeight = 80;

  return {
    id: "converted",
    name: "Converted from Procedural",
    width: 3000,
    height: CANVAS_HEIGHT,
    groundHeight: groundHeight,
    skyColor: {
      top: "#5c94fc",
      bottom: "#87ceeb",
    },
    marioStart: {
      x: 100,
      y: CANVAS_HEIGHT - groundHeight - MARIO_HEIGHT,
    },
    flagpole: {
      x: flagpole.x,
      height: flagpole.height,
    },
    pipes: pipes.map((pipe) => ({
      x: pipe.x,
      height: CANVAS_HEIGHT - groundHeight - pipe.y,
    })),
    enemies: enemies.map((enemy) => ({
      x: enemy.x,
      walkRange: enemy.walkRange,
      type: "GOOMBA",
    })),
    coins: coins.map((coin) => ({
      x: coin.x,
      y: coin.y,
    })),
  };
}
