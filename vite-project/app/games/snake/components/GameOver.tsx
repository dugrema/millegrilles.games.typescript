import { useSnakeGame } from "../index";
import styled from "styled-components";

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-family: monospace;
  z-index: 200;
  pointer-events: auto;
`;

const ScoreText = styled.p`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #45a049;
  }
`;

const Instruction = styled.p`
  font-size: 14px;
  margin-top: 8px;
`;

export default function GameOver() {
  const { gameOver, score, resetGame } = useSnakeGame();

  if (!gameOver) return null;

  return (
    <Overlay>
      <ScoreText>
        Game Over! Final Score: <span>{score}</span>
      </ScoreText>
      <Button onClick={resetGame}>Play Again</Button>
      <Instruction>Press R or click button to restart</Instruction>
    </Overlay>
  );
}
