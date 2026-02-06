import styled from "styled-components";
import { useSnakeGame } from "../index";

const ScoreContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 100;
`;

const ScoreText = styled.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
  font-family: monospace;
`;

export default function Score() {
  const { score } = useSnakeGame();

  return (
    <ScoreContainer>
      <ScoreText>Score: {score}</ScoreText>
    </ScoreContainer>
  );
}
