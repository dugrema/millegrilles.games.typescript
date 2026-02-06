import React from "react";

// Particle type definitions
export type ParticleType = "sparkle" | "dust" | "explosion" | "star" | "coin";

// Particle properties
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: ParticleType;
  rotation: number;
  rotationSpeed: number;
}

// Particle system props
export interface ParticleSystemProps {
  particles: Particle[];
  cameraX: number;
  cameraY: number;
  enabled?: boolean;
}

// Export particle factory functions
export function spawnCoinSparkle(
  x: number,
  y: number,
  color: string = "#FFD700",
  count: number = 8
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;

    particles.push({
      id: `coin-sparkle-${Date.now()}-${i}`,
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      size: 3 + Math.random() * 3,
      color,
      type: "sparkle",
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    });
  }

  return particles;
}

export function spawnDeathEffect(
  x: number,
  y: number,
  color: string = "#FF0000",
  count: number = 16
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 5;

    particles.push({
      id: `death-effect-${Date.now()}-${i}`,
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2, // Slight upward bias
      life: 40 + Math.random() * 30,
      maxLife: 70,
      size: 5 + Math.random() * 8,
      color,
      type: "explosion",
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
    });
  }

  return particles;
}

export function spawnPowerUpEffect(
  x: number,
  y: number,
  color: string = "#00FF00",
  count: number = 12
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 1 + Math.random() * 2;

    particles.push({
      id: `powerup-effect-${Date.now()}-${i}`,
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 25 + Math.random() * 15,
      maxLife: 40,
      size: 4 + Math.random() * 4,
      color,
      type: "star",
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    });
  }

  return particles;
}

export function spawnDust(
  x: number,
  y: number,
  count: number = 5,
  spread: number = 20
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() - 0.5) * spread * (Math.PI / 180);
    const velocity = 1 + Math.random() * 2;

    particles.push({
      id: `dust-${Date.now()}-${i}`,
      x,
      y,
      vx: Math.sin(angle) * velocity,
      vy: -Math.cos(angle) * velocity,
      life: 20 + Math.random() * 15,
      maxLife: 35,
      size: 2 + Math.random() * 2,
      color: "#8B4513",
      type: "dust",
      rotation: 0,
      rotationSpeed: 0,
    });
  }

  return particles;
}

// Main particle system component
export function ParticleSystem({
  particles,
  cameraX,
  cameraY,
  enabled = true,
}: ParticleSystemProps) {
  if (!enabled || particles.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles
        .filter((p) => {
          const screenX = p.x - cameraX;
          const screenY = p.y - cameraY;
          return screenX > -50 && screenX < 850 && screenY > -50 && screenY < 530;
        })
        .map((particle) => (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: particle.x - cameraX - particle.size,
              top: particle.y - cameraY - particle.size,
              width: particle.size * 2,
              height: particle.size * 2,
              backgroundColor: particle.color,
              borderRadius: "50%",
              transform: `rotate(${particle.rotation}rad)`,
              opacity: particle.life / particle.maxLife,
              transition: "transform 0.1s linear",
              pointerEvents: "none",
            }}
          />
        ))}
    </div>
  );
}

// Helper function to draw particles on canvas
export function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  cameraX: number,
  cameraY: number,
) {
  const screenX = particle.x - cameraX;
  const screenY = particle.y - cameraY;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(particle.rotation);

  const alpha = particle.life / particle.maxLife;

  switch (particle.type) {
    case "sparkle":
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "dust":
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "explosion":
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "star":
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      // Draw star shape
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * particle.size;
        const y = Math.sin(angle) * particle.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        const innerAngle = angle + Math.PI / 5;
        const innerX = Math.cos(innerAngle) * particle.size * 0.5;
        const innerY = Math.sin(innerAngle) * particle.size * 0.5;
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      break;

    case "coin":
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha * 0.5;
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

// Helper function to update particle physics
export function updateParticle(
  particle: Particle,
  gravity: number = 0.3,
): void {
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.vy += gravity;
  particle.life--;
  particle.rotation += particle.rotationSpeed;
}

// Helper function to check if particle is still alive
export function isParticleAlive(particle: Particle): boolean {
  return particle.life > 0;
}

// Helper function to cleanup dead particles
export function cleanupParticles(particles: Particle[]): Particle[] {
  return particles.filter((p) => isParticleAlive(p));
}
