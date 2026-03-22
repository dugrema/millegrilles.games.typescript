import React from "react";
import styled from "styled-components";

interface ScoreProps {
  currentScore: number;
  coinCount: number;
  highScore: number;
  currentTime: number;
}

const StatusBar = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  z-index: 40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  border-bottom: 2px solid #ffd700;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
`;

const Label = styled.span`
  color: #87ceeb;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  font-family: "Press Start 2P", monospace;
  min-width: 80px;
  text-align: right;
  letter-spacing: 1px;
`;

const CoinIcon = styled.span`
  color: #ffd700;
  font-size: 16px;
`;

const HighScoreLabel = styled.span`
  color: #98fb98;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const Score: React.FC<ScoreProps> = ({
  currentScore,
  coinCount,
  highScore,
  currentTime,
}) => {
  return (
    <StatusBar>
      <ScoreItem>
        <Label>Score</Label>
        <Value>{currentScore}</Value>
      </ScoreItem>

      <ScoreItem>
        <CoinIcon>●</CoinIcon>
        <Label>Coins</Label>
        <Value>{coinCount}</Value>
      </ScoreItem>

      <ScoreItem>
        <HighScoreLabel>High</HighScoreLabel>
        <Value>{highScore}</Value>
      </ScoreItem>

      <ScoreItem>
        <Label>Time</Label>
        <Value>{Math.ceil(currentTime)}</Value>
      </ScoreItem>
    </StatusBar>
  );
};

export default Score;
