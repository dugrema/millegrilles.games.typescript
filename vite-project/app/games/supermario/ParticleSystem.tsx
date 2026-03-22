import React, { useState, useEffect } from "react";
import type { Particle, ParticleType } from "./types";

interface ParticleSystemState {
  particles: Particle[];
  nextId: number;
}

interface ParticleSystemContextType {
  particles: Particle[];
  spawnParticles: (
    type: ParticleType,
    x: number,
    y: number,
    count?: number,
  ) => void;
}

const ParticleSystemContext =
  React.createContext<ParticleSystemContextType | null>(null);

// Particle configuration presets
const PARTICLE_CONFIGS: Record<
  ParticleType,
  {
    count: number;
    spread: number;
    speed: number;
    lifetime: number;
    colors: string[];
    size: number;
  }
> = {
  MUSHROOM_BURST: {
    count: 12,
    spread: 120,
    speed: 3,
    lifetime: 45,
    colors: ["#FFD700", "#FFA500", "#FFF8DC"],
    size: 6,
  },
  TRANSFORM_BURST: {
    count: 20,
    spread: 150,
    speed: 4,
    lifetime: 60,
    colors: ["#FF69B4", "#FF1493", "#FF4500", "#FFD700"],
    size: 8,
  },
  BRICK_BREAK: {
    count: 8,
    spread: 60,
    speed: 2,
    lifetime: 50,
    colors: ["#CD853F", "#A0522D", "#8B4513"],
    size: 10,
  },
  MUSHROOM_COLLECT: {
    count: 6,
    spread: 80,
    speed: 2.5,
    lifetime: 30,
    colors: ["#FFFFFF", "#FFD700", "#FF69B4"],
    size: 5,
  },
  COIN_SPARKLE: {
    count: 4,
    spread: 40,
    speed: 1.5,
    lifetime: 25,
    colors: ["#FFD700", "#FFFACD"],
    size: 4,
  },
  LIFE_UPGRADE: {
    count: 8,
    spread: 100,
    speed: 3,
    lifetime: 40,
    colors: ["#00FF00", "#FFFF00", "#FFD700"],
    size: 6,
  },
};

/**
 * Spawns particles for visual effects
 */
export function useParticleSystem() {
  const context = React.useContext(ParticleSystemContext);
  if (!context) {
    throw new Error(
      "useParticleSystem must be used within ParticleSystemProvider",
    );
  }
  return context;
}

/**
 * Provider component for particle system
 */
export function ParticleSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ParticleSystemState>({
    particles: [],
    nextId: 1,
  });

  // Update and cleanup particles
  useEffect(() => {
    if (state.particles.length === 0) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const updatedParticles = prev.particles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY,
            velocityY: particle.velocityY + 0.15, // Gravity
            lifetime: particle.lifetime - 1,
          }))
          .filter((p) => p.lifetime > 0);

        return {
          ...prev,
          particles: updatedParticles,
        };
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [state.particles.length]);

  const spawnParticles = (
    type: ParticleType,
    x: number,
    y: number,
    count?: number,
  ) => {
    const config = PARTICLE_CONFIGS[type];
    const numParticles = count ?? config.count;

    const newParticles: Particle[] = [];

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 * i) / numParticles;
      const spread = config.spread / 2;
      const speed = config.speed;

      newParticles.push({
        id: state.nextId + i,
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        velocityY:
          Math.sin(angle) * speed -
          Math.abs(Math.sin(angle) * speed * 0.5) +
          (Math.random() - 0.5) * 2,
        lifetime: config.lifetime,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: config.size,
        type: type,
      });
    }

    setState((prev) => ({
      ...prev,
      particles: [...prev.particles, ...newParticles],
      nextId: prev.nextId + numParticles,
    }));
  };

  return (
    <ParticleSystemContext.Provider
      value={{ particles: state.particles, spawnParticles }}
    >
      {children}
    </ParticleSystemContext.Provider>
  );
}

/**
 * Generate mushroom burst particles
 */
export function spawnMushroomBurst(
  x: number,
  y: number,
  count: number = 12,
): Particle[] {
  return generateParticles(x, y, PARTICLE_CONFIGS.MUSHROOM_BURST, count);
}

/**
 * Generate transformation burst particles
 */
export function spawnTransformBurst(
  x: number,
  y: number,
  count: number = 20,
): Particle[] {
  return generateParticles(x, y, PARTICLE_CONFIGS.TRANSFORM_BURST, count);
}

/**
 * Generate brick break particles
 */
export function spawnBrickBreak(
  x: number,
  y: number,
  count: number = 8,
): Particle[] {
  return generateParticles(x, y, PARTICLE_CONFIGS.BRICK_BREAK, count);
}

/**
 * Generate mushroom collection particles
 */
export function spawnMushroomCollect(
  x: number,
  y: number,
  count: number = 6,
): Particle[] {
  return generateParticles(x, y, PARTICLE_CONFIGS.MUSHROOM_COLLECT, count);
}

/**
 * Generate coin sparkle particles
 */
export function spawnCoinSparkle(
  x: number,
  y: number,
  count: number = 4,
): Particle[] {
  return generateParticles(x, y, PARTICLE_CONFIGS.COIN_SPARKLE, count);
}

/**
 * Helper function to generate particles
 */
function generateParticles(
  x: number,
  y: number,
  config: typeof PARTICLE_CONFIGS.MUSHROOM_BURST,
  count: number,
): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const spread = config.spread / 2;
    const speed = config.speed;

    particles.push({
      id: Math.random(),
      x: x,
      y: y,
      velocityX: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
      velocityY:
        Math.sin(angle) * speed -
        Math.abs(Math.sin(angle) * speed * 0.5) +
        (Math.random() - 0.5) * 2,
      lifetime: config.lifetime,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: config.size,
      type: Object.keys(PARTICLE_CONFIGS).find(
        (key) => PARTICLE_CONFIGS[key as ParticleType] === config,
      ) as ParticleType,
    });
  }

  return particles;
}
