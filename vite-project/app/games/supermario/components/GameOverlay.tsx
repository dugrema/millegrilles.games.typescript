// Game Overlay component for Super Mario game state screens
// Displays start, pause, game over, victory, and level transition screens

import styled from "styled-components";
import { GameState, type InputState } from "../types";

interface GameOverlayProps {
  gameState: GameState;
  score: number;
  highScore?: number;
  level: number;
  inputActions?: { setInput?: (state: Partial<InputState>) => void };
  onRestart?: () => void;
  onResume?: () => void;
  onNextLevel?: () => void;
  onStart?: () => void;
}

const OverlayContainer = styled.div<{ gameState: GameState }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  padding: 20px;
  box-sizing: border-box;
  backdrop-filter: ${(props) =>
    props.gameState === GameState.PAUSED ? "blur(4px)" : "none"};
  transition: background 0.3s ease;
`;

// Start Screen
const StartScreen = styled.div<{ gameState: GameState }>`
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeSlideIn 0.5s ease-out;
`;

// Pause Screen
const PauseScreen = styled.div<{ gameState: GameState }>`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: pulse 1s ease-in-out infinite;
`;

// Game Over Screen
const GameOverScreen = styled.div<{ gameState: GameState }>`
  background: linear-gradient(
    135deg,
    rgba(220, 38, 38, 0.9) 0%,
    rgba(153, 27, 27, 0.95) 100%
  );
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.5);
  animation: shake 0.5s ease-out;
`;

// Victory Screen
const VictoryScreen = styled.div<{ gameState: GameState }>`
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.9) 0%,
    rgba(234, 179, 8, 0.95) 100%
  );
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: #333;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.5);
  animation: bounceIn 0.6s ease-out;
`;

// Level Complete Screen
const LevelCompleteScreen = styled.div<{ gameState: GameState }>`
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.9) 0%,
    rgba(37, 99, 235, 0.95) 100%
  );
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.5);
  animation: fadeSlideIn 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 900;
  margin-bottom: 24px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
`;

const Message = styled.p`
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 600;
  margin-bottom: 32px;
  opacity: 0.95;
`;

const ScoreSection = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 32px;
`;

const ScoreLabel = styled.p`
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const ScoreValue = styled.p`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  color: #ffd700;
`;

const Instructions = styled.div`
  margin-top: 40px;
  font-size: clamp(14px, 2vw, 18px);
  opacity: 0.9;
  line-height: 1.8;
`;

const KeyHint = styled.code`
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 6px;
  font-family: "Courier New", monospace;
  font-weight: bold;
  margin: 0 4px;
`;

const Cloud = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  animation: float 6s ease-in-out infinite;
`;

const Hill = styled.div`
  position: absolute;
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  border-radius: 50% 50% 0 0;
`;

// Styled animations
const ContainerWrapper = styled.div`
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-5px);
    }
    40%,
    80% {
      transform: translateX(5px);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

export default function GameOverlay({
  gameState,
  score,
  highScore = 0,
  level,
  inputActions = {},
  onRestart,
  onResume,
  onNextLevel,
  onStart,
}: GameOverlayProps) {
  const scoreDisplay = score.toLocaleString();
  const highScoreDisplay = highScore.toLocaleString();
  const scoreComparison = score >= highScore;

  const handleOverlayClick = () => {
    // Set input state first to track user interaction
    if (inputActions?.setInput) {
      inputActions.setInput({ start: true });
    }
    // Then trigger game start
    if (onStart) {
      onStart();
    }
  };

  const renderStartScreen = () => (
    <StartScreen gameState={gameState}>
      <ContainerWrapper onClick={handleOverlayClick}>
        <Title>🍄 Super Mario 🍄</Title>
        <Message>Arcade Platformer Adventure</Message>

        <ScoreSection>
          <ScoreLabel>Final Score</ScoreLabel>
          <ScoreValue>{scoreDisplay}</ScoreValue>
          {scoreComparison && (
            <ScoreLabel style={{ marginTop: "8px", color: "#ffd700" }}>
              🏆 New High Score!
            </ScoreLabel>
          )}
        </ScoreSection>
      </ContainerWrapper>
    </StartScreen>
  );

  const renderPauseScreen = () => (
    <OverlayContainer gameState={gameState}>
      <PauseScreen gameState={gameState}>
        <ContainerWrapper>
          <Title>⏸️ PAUSED</Title>
          <Message>Press SPACE to Resume</Message>
          <Instructions>
            <div>
              <span>Use arrow keys to move:</span>
              <KeyHint>←</KeyHint>
              <KeyHint>→</KeyHint> to move |<KeyHint>↑</KeyHint> to jump |
              <KeyHint>SHIFT</KeyHint> to run
            </div>
          </Instructions>
        </ContainerWrapper>
      </PauseScreen>
    </OverlayContainer>
  );

  const renderGameOverScreen = () => (
    <OverlayContainer gameState={gameState}>
      <GameOverScreen gameState={gameState}>
        <ContainerWrapper>
          <Title>💀 Game Over 💀</Title>
          <Message>Don't worry, you can try again!</Message>

          <ScoreSection>
            <ScoreLabel>Final Score</ScoreLabel>
            <ScoreValue>{scoreDisplay}</ScoreValue>
            {scoreComparison && (
              <ScoreLabel style={{ marginTop: "8px", color: "#ffd700" }}>
                🏆 New High Score!
              </ScoreLabel>
            )}
          </ScoreSection>

          <Instructions>
            Press <KeyHint>SPACE</KeyHint> to Restart
          </Instructions>
        </ContainerWrapper>
      </GameOverScreen>
    </OverlayContainer>
  );

  const renderVictoryScreen = () => (
    <OverlayContainer gameState={gameState}>
      <VictoryScreen gameState={gameState}>
        <ContainerWrapper>
          <Title>🎉 Victory! 🎉</Title>
          <Message>Level {level} Complete!</Message>

          <ScoreSection>
            <ScoreLabel>Score</ScoreLabel>
            <ScoreValue>{scoreDisplay}</ScoreValue>
          </ScoreSection>

          <Instructions>
            Press <KeyHint>SPACE</KeyHint> to Continue
          </Instructions>
        </ContainerWrapper>
      </VictoryScreen>
    </OverlayContainer>
  );

  const renderLevelCompleteScreen = () => (
    <OverlayContainer gameState={gameState}>
      <LevelCompleteScreen gameState={gameState}>
        <ContainerWrapper>
          <Title>⭐ Level {level} Complete!</Title>
          <Message>Great job! Keep it up!</Message>

          <ScoreSection>
            <ScoreLabel>Score</ScoreLabel>
            <ScoreValue>{scoreDisplay}</ScoreValue>
          </ScoreSection>

          <Instructions>
            Press <KeyHint>SPACE</KeyHint> for Next Level
          </Instructions>
        </ContainerWrapper>
      </LevelCompleteScreen>
    </OverlayContainer>
  );

  return (
    <>
      {gameState === GameState.IDLE && renderStartScreen()}
      {gameState === GameState.PAUSED && renderPauseScreen()}
      {gameState === GameState.GAME_OVER && renderGameOverScreen()}
      {gameState === GameState.VICTORY && renderVictoryScreen()}
      {gameState === GameState.LEVEL_TRANSITION && renderLevelCompleteScreen()}
    </>
  );
}
