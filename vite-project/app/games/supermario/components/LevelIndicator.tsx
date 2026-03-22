import React from "react";
import styled from "styled-components";

interface LevelIndicatorProps {
  world: number;
  level: number;
}

const StatusBar = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  border: 2px solid #ffd700;
`;

const LevelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
`;

const LevelLabel = styled.span`
  color: #87ceeb;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LevelValue = styled.span`
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  font-family: "Press Start 2P", monospace;
  min-width: 80px;
  text-align: right;
  letter-spacing: 1px;
`;

const WorldBadge = styled.span`
  color: #ff6b6b;
  font-size: 16px;
  font-weight: bold;
  background: rgba(255, 107, 107, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ff6b6b;
  margin-right: 8px;
`;

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ world, level }) => {
  return (
    <StatusBar>
      <WorldBadge>W{world}</WorldBadge>
      <LevelLabel>Level</LevelLabel>
      <LevelValue>L{level}</LevelValue>
    </StatusBar>
  );
};

export default LevelIndicator;
