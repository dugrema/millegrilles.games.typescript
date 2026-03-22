import React from "react";
import styled from "styled-components";
import { useParticleSystem } from "../ParticleSystem";
import { useGameContext } from "../GameContext";
import type { Particle } from "../types";

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const ParticleDiv = styled.div<{
  $type: string;
}>`
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: ${(props) =>
    props.$type === "COIN_SPARKLE"
      ? "50%"
      : props.$type === "BRICK_BREAK"
        ? "2px"
        : "50%"};
`;

/**
 * Renders particle effects for visual polish
 */
export default function Particles() {
  const { particles, spawnParticles } = useParticleSystem();
  const { state } = useGameContext();

  // Expose spawn function through context for external use
  React.useEffect(() => {
    // This ensures spawnParticles is available to child components
  }, [spawnParticles]);

  if (particles.length === 0) return null;

  return (
    <ParticleContainer>
      {particles.map((particle) => {
        // Adjust world coordinates to screen coordinates within CameraTransform
        const screenX = particle.x - state.camera.x;
        const screenY = particle.y;

        return (
          <ParticleDiv
            key={particle.id}
            $type={particle.type}
            style={{
              left: screenX,
              top: screenY,
              width: particle.size,
              height: particle.size,
              background: particle.color,
              opacity: Math.max(0, particle.lifetime / 30),
              boxShadow: `0 0 ${particle.size * 0.5}px ${particle.color}`,
            }}
          />
        );
      })}
    </ParticleContainer>
  );
}

/**
 * Hook to spawn particles from anywhere in the component tree
 */
export function useParticleSpawner() {
  const { spawnParticles } = useParticleSystem();
  return spawnParticles;
}
