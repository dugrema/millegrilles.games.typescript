import React from "react";
import styled from "styled-components";
import { useGameContext } from "../GameContext";

const LivesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  font-family: Arial, sans-serif;
  font-weight: bold;
`;

const LivesIcon = styled.span<{ $scale?: number }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #FF0000;
  border-radius: 2px;
  position: relative;
  transform: scale(${(props) => props.$scale || 1});
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  /* Mario's overall/blue pants */
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 6px;
    background: #4169E1;
    border-radius: 1px;
  }

  /* Mario's hat brim */
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #FF0000;
    border-radius: 1px;
  }
`;

const Label = styled.span`
  font-size: 14px;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

/**
 * Displays the player's current lives as Mario icons
 */
export default function LivesDisplay() {
  const { state } = useGameContext();

  const lives = state.score.lives || 3;

  if (state.status === "IDLE" || state.status === "GAME_OVER") {
    return null;
  }

  return (
    <LivesContainer>
      <Label>x</Label>
      {Array.from({ length: lives }).map((_, index) => (
        <LivesIcon key={index} $scale={index === 0 ? 1.2 : 1} />
      ))}
    </LivesContainer>
  );
}
