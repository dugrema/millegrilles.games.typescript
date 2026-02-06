import { useSnakeGame } from '../index';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  @media (max-width: 649px) {
    display: flex;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  background: #76ff03;
  color: #2e7d32;
  border: none;
  border-radius: 3px;
  padding: 8px 12px;
  cursor: pointer;
  min-width: 48px;
  font-size: 18px;
  font-weight: 600;

  &:hover {
    background: #a9ff40;
  }
`;

export default function MobileControls() {
  const { setDirection } = useSnakeGame();

  const handlePress = (dir: { x: number; y: number }) => {
    setDirection(dir);
  };

  return (
    <ControlsContainer>
      <Row>
        <Button onClick={() => handlePress({ x: 0, y: -1 })} aria-label="Move up">
          ↑
        </Button>
      </Row>
      <Row>
        <Button onClick={() => handlePress({ x: -1, y: 0 })} aria-label="Move left">
          ←
        </Button>
        <Button onClick={() => handlePress({ x: 1, y: 0 })} aria-label="Move right">
          →
        </Button>
      </Row>
      <Row>
        <Button onClick={() => handlePress({ x: 0, y: 1 })} aria-label="Move down">
          ↓
        </Button>
      </Row>
    </ControlsContainer>
  );
}
