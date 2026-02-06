import styled from "styled-components";
import { useMinesweeper } from "../index";
import { DIFFICULTIES } from "../constants";

interface GameOverlayProps {
  className?: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const OverlayContent = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 48px;
  border-radius: 16px;
  text-align: center;
  border: 2px solid #4f46e5;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.3);
  max-width: 90%;
  width: 440px;
  animation: slideIn 0.3s ease-out;
`;

const OverlayTitle = styled.h2`
  color: #fff;
  font-size: 32px;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const OverlaySubtitle = styled.p`
  color: #aaa;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    background: linear-gradient(135deg, #7b68ee 0%, #8b5cf6 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const Instructions = styled.div`
  color: #888;
  font-size: 14px;
  line-height: 2;
  margin-bottom: 32px;
  text-align: left;

  @media (max-width: 600px) {
    font-size: 12px;
    line-height: 1.8;
  }
`;

const KeyHighlight = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  color: #4ecdc4;
  font-family: "Courier New", monospace;
  font-weight: bold;
`;

const HighScoreDisplay = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const HighScoreLabel = styled.p`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
`;

const HighScoreValue = styled.div`
  color: #4ecdc4;
  font-size: 28px;
  font-weight: bold;
  font-family: "Courier New", monospace;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const VictoryTitle = styled(OverlayTitle)`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DefeatTitle = styled(OverlayTitle)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const InstructionsText = `
• Left Click: Reveal a cell
• Right Click (or Long Press): Place/Remove a flag
• Press R: Restart game
• Press Enter: Start new game
• Press Esc: Pause/Resume
`;

const InstructionsMobile = `
• Tap: Reveal a cell
• Long Press: Place/Remove a flag
• Use the Difficulty button to change games
`;

export default function GameOverlay({ className }: GameOverlayProps) {
  const {
    state: { gameStatus, grid, timer, difficulty, highScores },
    restartGame,
  } = useMinesweeper();

  const config = DIFFICULTIES[difficulty];

  const getOverlayTitle = () => {
    switch (gameStatus) {
      case "idle":
        return "Minesweeper";
      case "gameover":
        return "Game Over!";
      case "won":
        return "You Won!";
      default:
        return "";
    }
  };

  const getOverlaySubtitle = () => {
    if (gameStatus === "idle") {
      return "Classic Minesweeper Game - Test Your Logic";
    }
    if (gameStatus === "gameover") {
      return `You hit a mine! Final time: ${timer}s`;
    }
    if (gameStatus === "won") {
      return `Excellent! You cleared the board! Final time: ${timer}s`;
    }
    return "";
  };

  const getButtonText = () => {
    if (gameStatus === "idle") {
      return "Start Game";
    }
    if (gameStatus === "gameover") {
      return "Try Again";
    }
    if (gameStatus === "won") {
      return "Play Again";
    }
    return "";
  };

  const isReplayAvailable = gameStatus === "gameover" || gameStatus === "won";

  const getInstructions = () => {
    if (gameStatus === "idle") {
      return InstructionsText;
    }
    return "";
  };

  const getMobileInstructions = () => {
    if (gameStatus === "idle") {
      return InstructionsMobile;
    }
    return "";
  };

  return gameStatus === "idle" ||
    gameStatus === "gameover" ||
    gameStatus === "won" ? (
    <Overlay className={className}>
      <OverlayContent>
        {gameStatus === "idle" && (
          <>
            <OverlayTitle>Minesweeper</OverlayTitle>
            <OverlaySubtitle>
              Classic Minesweeper - Test Your Logic
            </OverlaySubtitle>
            <HighScoreDisplay>
              <HighScoreLabel>Best Score ({difficulty}):</HighScoreLabel>
              <HighScoreValue>{highScores[difficulty]} seconds</HighScoreValue>
            </HighScoreDisplay>
            <Instructions>{getInstructions()}</Instructions>
            <Instructions className="mobile-only">
              {getMobileInstructions()}
            </Instructions>
            <Button onClick={restartGame}>Start Game</Button>
          </>
        )}

        {gameStatus === "gameover" && (
          <>
            <DefeatTitle>Game Over!</DefeatTitle>
            <OverlaySubtitle>You hit a mine!</OverlaySubtitle>
            <HighScoreDisplay>
              <HighScoreLabel>Best Score ({difficulty}):</HighScoreLabel>
              <HighScoreValue>{highScores[difficulty]} seconds</HighScoreValue>
            </HighScoreDisplay>
            <Button onClick={restartGame}>Try Again</Button>
            <Button onClick={restartGame} disabled>
              Play Again
            </Button>
          </>
        )}

        {gameStatus === "won" && (
          <>
            <VictoryTitle>You Won!</VictoryTitle>
            <OverlaySubtitle>
              Excellent! You cleared the {config.rows}x{config.cols} board!
            </OverlaySubtitle>
            <HighScoreDisplay>
              <HighScoreLabel>Best Score ({difficulty}):</HighScoreLabel>
              <HighScoreValue>{highScores[difficulty]} seconds</HighScoreValue>
            </HighScoreDisplay>
            <Button onClick={restartGame}>Play Again</Button>
          </>
        )}
      </OverlayContent>
    </Overlay>
  ) : null;
}
