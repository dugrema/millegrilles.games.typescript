import React from "react";
import styled from "styled-components";

interface GameOverlayProps {
  currentScore: number;
  coinCount: number;
  highScore: number;
  lives: number;
  gameState: { state: string; currentWorld?: number; currentLevel?: number };
  gameOverReason?: string;
  onStartGame: () => void;
  onRestart: () => void;
  isFinalLevel?: boolean;
}

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const Title = styled.h1`
  color: #ffd700;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow:
    3px 3px 0 #ff0000,
    -1px -1px 0 #0000ff;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const Message = styled.p`
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
`;

const ScoreDisplay = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px 30px;
  margin-bottom: 30px;
  min-width: 200px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
`;

const Button = styled.button`
  background: linear-gradient(to bottom, #4caf50, #3d8b40);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 40px;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow:
    0 4px 0 #2e7d32,
    0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 #2e7d32,
      0 8px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 #2e7d32,
      0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const Instructions = styled.div`
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  text-align: center;
  line-height: 1.8;
`;

const Key = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  margin: 0 2px;
`;

const GameOverlay: React.FC<GameOverlayProps> = ({
  currentScore,
  coinCount,
  highScore,
  lives,
  gameState,
  gameOverReason,
  onStartGame,
  onRestart,
  isFinalLevel,
}) => {
  if (gameState.state === "PLAYING") {
    return null;
  }

  return (
    <OverlayContainer>
      {gameState.state === "IDLE" && (
        <>
          <Title>Super Mario</Title>
          <Message>Platform Adventure Game</Message>
          <Button onClick={onStartGame}>Start Game</Button>
          <Instructions>
            <p>
              <Key>←</Key> <Key>→</Key> Move
            </p>
            <p>
              <Key>Space</Key> or <Key>↑</Key> Jump
            </p>
            <p>
              <Key>P</Key> Pause/Resume
            </p>
          </Instructions>
        </>
      )}

      {gameState.state === "RESPAWNING" && (
        <>
          <Title>Respawning...</Title>
          <Message>Get ready!</Message>
          <ScoreDisplay>
            <ScoreRow>
              <span>Lives:</span>
              <span>{lives}</span>
            </ScoreRow>
          </ScoreDisplay>
          <Instructions>
            <p>
              <Key>←</Key> <Key>→</Key> Move
            </p>
            <p>
              <Key>Space</Key> or <Key>↑</Key> Jump
            </p>
            <p>
              <Key>P</Key> Pause
            </p>
          </Instructions>
        </>
      )}

      {gameState.state === "GAME_OVER" && (
        <>
          <Title>Game Over</Title>
          {gameOverReason && <Message>{gameOverReason}</Message>}
          <ScoreDisplay>
            <ScoreRow>
              <span>Score:</span>
              <span>{currentScore}</span>
            </ScoreRow>
            <ScoreRow>
              <span>Coins:</span>
              <span>{coinCount}</span>
            </ScoreRow>
            <ScoreRow>
              <span>High Score:</span>
              <span>{highScore}</span>
            </ScoreRow>
          </ScoreDisplay>
          <Button onClick={onRestart}>Play Again</Button>
        </>
      )}

      {gameState.state === "PAUSED" && (
        <>
          <Title>Paused</Title>
          <Message>Game temporarily stopped</Message>
          <Button onClick={onRestart}>Restart Game</Button>
        </>
      )}

      {gameState.state === "TRANSITIONING" && (
        <>
          {isFinalLevel ? (
            <>
              <Title
                style={{ color: "#FFD700", textShadow: "3px 3px 0 #FF0000" }}
              >
                Game Complete!
              </Title>
              <Message>You've beaten the game!</Message>
            </>
          ) : (
            <>
              <Title style={{ color: "#00FF00" }}>Level Complete!</Title>
              <Message>Transitioning to next level...</Message>
            </>
          )}
          <ScoreDisplay>
            {!isFinalLevel && (
              <ScoreRow>
                <span>World:</span>
                <span>
                  {gameState.currentWorld}-{gameState.currentLevel}
                </span>
              </ScoreRow>
            )}
            <ScoreRow>
              <span>Score:</span>
              <span>{currentScore}</span>
            </ScoreRow>
            <ScoreRow>
              <span>Coins:</span>
              <span>{coinCount}</span>
            </ScoreRow>
          </ScoreDisplay>
        </>
      )}

      {gameState.state === "WIN" && (
        <>
          {isFinalLevel ? (
            <>
              <Title
                style={{ color: "#FFD700", textShadow: "3px 3px 0 #FF0000" }}
              >
                Game Complete!
              </Title>
              <Message>You've beaten the game!</Message>
            </>
          ) : (
            <>
              <Title
                style={{ color: "#FFD700", textShadow: "3px 3px 0 #FF0000" }}
              >
                Level Complete!
              </Title>
              {gameOverReason && <Message>{gameOverReason}</Message>}
            </>
          )}
          <ScoreDisplay>
            {!isFinalLevel && (
              <ScoreRow>
                <span>High Score:</span>
                <span>{highScore}</span>
              </ScoreRow>
            )}
            <ScoreRow>
              <span>Score:</span>
              <span>{currentScore}</span>
            </ScoreRow>
            <ScoreRow>
              <span>Coins:</span>
              <span>{coinCount}</span>
            </ScoreRow>
          </ScoreDisplay>
          <Button onClick={onRestart}>Play Again</Button>
        </>
      )}
    </OverlayContainer>
  );
};

export default GameOverlay;
