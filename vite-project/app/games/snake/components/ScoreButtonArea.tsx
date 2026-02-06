import styled from "styled-components";
import { useSnakeGame } from "../index";

const Panel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px;
  background: rgba(46, 125, 50, 0.85);
  color: #fff;
  border-radius: 4px;

  /* Desktop / Tablet */
  @media (min-width: 650px) {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 200px;
    height: auto;
  }

  /* Mobile – panel moves to the bottom */
  @media (max-width: 649px) {
    width: calc(100% - 32px);
    position: fixed;
    bottom: 0;
    left: 0;
  }
`;

const ScoreText = styled.div`
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  flex: 1;
`;

const Button = styled.button`
  background: #76ff03;
  color: #2e7d32;
  font-weight: 700;
  border: none;
  border-radius: 3px;
  padding: 6px 10px;
  cursor: pointer;
  min-width: 70px;

  &:hover {
    background: #a9ff40;
  }

  &:disabled {
    background: #9e9e9e;
    cursor: default;
  }
`;

export default function ScoreButtonArea() {
  const { score, status, togglePause, resetGame } = useSnakeGame();

  return (
    <Panel>
      <ScoreText>Score: {score}</ScoreText>
      <Button onClick={togglePause}>
        {status === "paused" ? "Resume" : "Pause"}
      </Button>
      <Button onClick={resetGame}>Restart</Button>
    </Panel>
  );
}
