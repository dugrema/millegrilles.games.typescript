import styled, { keyframes } from "styled-components";
import { useSuperMario } from "../index";

// Define animations using styled-components keyframes
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  padding: 40px 60px;
  text-align: center;
  background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 400% 400%;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  animation: ${gradientAnimation} 5s ease infinite;
  border: 4px solid #fff;
`;

const Title = styled.h1`
  font-size: 48px;
  margin: 0 0 16px 0;
  color: #fff;
  text-shadow:
    3px 3px 0 #000,
    -2px -2px 0 #000;
  font-family: "Arial Black", sans-serif;
`;

const FinalScore = styled.div`
  font-size: 24px;
  color: #fff;
  margin-bottom: 24px;
  font-weight: bold;
`;

const ScoreLabel = styled.span`
  color: #ffff00;
  text-shadow: 2px 2px 0 #000;
`;

const Instructions = styled.p`
  color: #fff;
  font-size: 16px;
  margin: 0 0 32px 0;
  text-shadow: 2px 2px 0 #000;
`;

const Button = styled.button`
  padding: 12px 32px;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  background: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
  margin: 8px;
  font-family: "Arial Black", sans-serif;
  text-transform: uppercase;
  font-size: 16px;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
`;

const ButtonSecondary = styled(Button)`
  background: #ffff00;
`;

const ButtonDanger = styled(Button)`
  background: #ff6b6b;
  color: #fff;
`;

const RestartIcon = styled.span`
  font-size: 64px;
  margin-bottom: 16px;
  animation: ${bounceAnimation} 1s ease infinite;
`;

const WinIcon = styled.span`
  font-size: 64px;
  margin-bottom: 16px;
  animation: ${spinAnimation} 2s linear infinite;
`;

const PauseIcon = styled.span`
  font-size: 64px;
  margin-bottom: 16px;
  animation: ${pulseAnimation} 1s ease-in-out infinite;
`;

const GameOverOverlay = () => {
  const context = useSuperMario();
  if (context === null) return null;
  const { actions, status, score, lives, level, isPaused, gameOverReason } =
    context;

  const getOverlayContent = () => {
    if (status === "gameover") {
      return (
        <>
          <RestartIcon>😵</RestartIcon>
          <Title>GAME OVER</Title>
          {gameOverReason && (
            <p
              style={{
                color: "#ff0000",
                fontSize: "20px",
                marginBottom: "16px",
              }}
            >
              {gameOverReason}
            </p>
          )}
          <FinalScore>
            <ScoreLabel>Score:</ScoreLabel> {score}
          </FinalScore>
          <Instructions>
            Don't give up! Try again to beat the level.
          </Instructions>
          <div>
            <Button onClick={actions.restartGame}>Restart Game</Button>
            <ButtonSecondary onClick={actions.restartLevel}>
              Restart Level
            </ButtonSecondary>
          </div>
        </>
      );
    }

    if (status === "win") {
      const bonusPoints = lives * 1000;
      const totalScore = score + bonusPoints;
      return (
        <>
          <WinIcon>🏆</WinIcon>
          <Title>YOU WIN!</Title>
          <FinalScore>
            <ScoreLabel>Score: </ScoreLabel> {totalScore}
          </FinalScore>
          <FinalScore style={{ fontSize: "20px", color: "#ffff00" }}>
            <ScoreLabel>Bonus: </ScoreLabel> +{bonusPoints}
          </FinalScore>
          <Instructions>
            {level?.name
              ? `Level ${level.name} completed!`
              : "Level completed!"}{" "}
            Ready for more adventure?
          </Instructions>
          <div>
            <Button onClick={actions.restartGame}>Play Again</Button>
            <ButtonSecondary onClick={actions.restartLevel}>
              Retry Level
            </ButtonSecondary>
          </div>
        </>
      );
    }

    if (status === "paused") {
      return (
        <>
          <PauseIcon>⏸️</PauseIcon>
          <Title>PAUSED</Title>
          <Instructions>
            Take a break! Press Space or Enter to continue.
          </Instructions>
          <div>
            <ButtonSecondary onClick={actions.resumeGame}>
              Resume
            </ButtonSecondary>
            <Button onClick={actions.restartLevel}>Restart Level</Button>
          </div>
        </>
      );
    }

    return null;
  };

  if (status === "start") {
    return null;
  }

  return (
    <Overlay>
      <Container>{getOverlayContent()}</Container>
    </Overlay>
  );
};

export default GameOverOverlay;
