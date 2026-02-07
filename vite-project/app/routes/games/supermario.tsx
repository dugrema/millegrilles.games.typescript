// Route component for Super Mario game with Phase 1.5 integration
import styled from "styled-components";
import { SuperMarioGameProvider, useSuperMario } from "../../games/supermario";
import Game from "../../games/supermario/Game";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const GameWrapper = styled.div`
  position: relative;
  width: 800px;
  max-width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
`;

const StartScreen = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  z-index: 50;
  padding: 20px;
  text-align: center;

  strong {
    color: #ffff00;
    font-size: 28px;
    margin-bottom: 15px;
  }

  p {
    margin: 8px 0;
    font-size: 16px;
    color: #fff;
  }

  button {
    margin-top: 25px;
    padding: 12px 35px;
    font-size: 16px;
    background: #ff6b6b;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: "Arial Black", sans-serif;
    text-transform: uppercase;
    transition: all 0.2s;

    &:hover {
      background: #ff5252;
      transform: scale(1.05);
    }
  }
`;

const Header = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 20;
  padding: 10px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #fff;
  text-shadow: 3px 3px 0 #000;
  font-family: "Arial Black", sans-serif;
  letter-spacing: 2px;
`;

const HeaderSubtitle = styled.p`
  margin: 5px 0 0 0;
  color: #ffff00;
  text-shadow: 2px 2px 0 #000;
  font-family: "Arial", sans-serif;
  font-size: 14px;
`;

const MobileControls = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 30;
    pointer-events: none;

    button,
    .control-group {
      pointer-events: auto;
    }
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 8px;
  z-index: 25;
  font-family: "Arial", sans-serif;
  font-size: 12px;
  color: #fff;
  max-width: 200px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ControlLabel = styled.div`
  margin-bottom: 8px;

  strong {
    color: #ffff00;
  }
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  span {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 3px;
    min-width: 30px;
    text-align: center;
  }
`;

const ControlRowWrap = styled.div`
  display: flex;
  gap: 4px;
`;

const StartHint = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 20px 30px;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }

  strong {
    color: #ffff00;
    font-size: 18px;
  }

  p {
    margin: 10px 0 0 0;
    font-size: 14px;
  }

  button {
    margin-top: 15px;
    padding: 10px 30px;
    font-size: 16px;
    background: #ff6b6b;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: "Arial Black", sans-serif;
    text-transform: uppercase;
    transition: background 0.2s;

    &:hover {
      background: #ff5252;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  @media (max-width: 768px) {
    button {
      padding: 8px 20px;
      font-size: 14px;
    }
  }
`;

// Export metadata
export function meta() {
  return [
    {
      title: "Super Mario – Arcade Style Game",
    },
    {
      name: "description",
      content:
        "Play Super Mario clone in your browser. Classic platformer action with smooth gameplay.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function SuperMario() {
  return (
    <PageContainer>
      <GameWrapper>
        <Header>
          <HeaderTitle>🍄 SUPER MARIO 🍄</HeaderTitle>
          <HeaderSubtitle>Platformer Adventure</HeaderSubtitle>
        </Header>

        <SuperMarioGameProvider>
          <Game />

          <MobileControls>
            {/* Mobile touch controls would be implemented in Phase 8 */}
            <div className="control-group">
              <button>🎮</button>
            </div>
          </MobileControls>
        </SuperMarioGameProvider>
      </GameWrapper>
    </PageContainer>
  );
}
