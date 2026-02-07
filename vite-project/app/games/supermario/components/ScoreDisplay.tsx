import styled from 'styled-components';

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(to bottom, #000080, #000040);
  border-bottom: 2px solid #fff;
  font-family: 'Arial Black', sans-serif;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
`;

const ScoreLabel = styled.span`
  font-size: 12px;
  color: #ffff00;
  text-shadow: 2px 2px 0 #000;
  letter-spacing: 1px;
`;

const ScoreValue = styled.span`
  font-size: 24px;
  color: #fff;
  text-shadow: 2px 2px 0 #000;
`;

const CoinIcon = styled.span`
  font-size: 28px;
  margin-right: 8px;
  animation: spin 1s linear infinite;
`;

const ScoreDisplay = () => {
  return (
    <ScoreContainer>
      <ScoreItem>
        <ScoreLabel>LIVES</ScoreLabel>
        <ScoreValue>❤️❤️❤️</ScoreValue>
      </ScoreItem>

      <ScoreItem>
        <ScoreLabel>SCORE</ScoreLabel>
        <ScoreValue>000000</ScoreValue>
      </ScoreItem>

      <ScoreItem>
        <ScoreLabel>COINS</ScoreLabel>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CoinIcon>🪙</CoinIcon>
          <ScoreValue>000</ScoreValue>
        </div>
      </ScoreItem>

      <ScoreItem>
        <ScoreLabel>LEVEL</ScoreLabel>
        <ScoreValue>1-1</ScoreValue>
      </ScoreItem>
    </ScoreContainer>
  );
};

export default ScoreDisplay;
