import styled from "styled-components";
import { useSuperMario } from "../index";

const LevelContainer = styled.div`
  padding: 12px 16px;
  background: linear-gradient(to right, #000080, #000040);
  border-left: 3px solid #ff0000;
  font-family: "Arial Black", sans-serif;
`;

const LevelTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #ffff00;
  text-shadow: 2px 2px 0 #000;
`;

const LevelInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-family: "Arial", sans-serif;
  font-size: 14px;
`;

const LevelLabel = styled.span`
  color: #888;
`;

const LevelValue = styled.span`
  color: #fff;
  font-weight: bold;
`;

const LevelIndicator = () => {
  const context = useSuperMario();
  if (!context)
    throw new Error("useSuperMario must be used within SuperMarioGameProvider");
  const { currentLevel, level, score, coins, time } = context;

  const levelName = level?.name || `World ${currentLevel}-1`;

  return (
    <LevelContainer>
      <LevelTitle>{levelName}</LevelTitle>
      <LevelInfo>
        <div>
          <LevelLabel>SCORE:</LevelLabel>
          <LevelValue>{score.toLocaleString()}</LevelValue>
        </div>
        <div>
          <LevelLabel>COINS:</LevelLabel>
          <LevelValue>🪙 {coins}</LevelValue>
        </div>
        <div>
          <LevelLabel>TIME:</LevelLabel>
          <LevelValue>
            {Math.floor(time / 60)}:
            {String(Math.floor(time % 60)).padStart(2, "0")}
          </LevelValue>
        </div>
      </LevelInfo>
    </LevelContainer>
  );
};

export default LevelIndicator;
