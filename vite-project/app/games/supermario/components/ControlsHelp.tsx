import styled from "styled-components";
import { useSuperMario } from "../index";

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(to right, #000040, #000080);
  border-left: 3px solid #ff0000;
  font-family: "Courier New", monospace;
`;

const Title = styled.h3`
  color: #ffff00;
  font-size: 18px;
  margin: 0 0 12px 0;
  text-align: center;
  text-shadow: 2px 2px 0 #000;
  border-bottom: 2px solid #ff0000;
  padding-bottom: 8px;
`;

const Group = styled.div`
  color: #fff;
`;

const Label = styled.div`
  color: #00ff00;
  font-size: 12px;
  margin-bottom: 6px;
  font-weight: bold;
`;

const KeyHint = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  span {
    background: linear-gradient(to bottom, #eee, #999);
    border: 2px solid #000;
    border-radius: 4px;
    padding: 4px 8px;
    font-family: "Courier New", monospace;
    font-weight: bold;
    box-shadow:
      inset 2px 2px 5px rgba(255, 255, 255, 0.3),
      -2px -2px 5px rgba(0, 0, 0, 0.3);
  }

  span.large {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const Description = styled.span`
  color: #aaa;
  font-size: 12px;
`;

export default function ControlsHelp() {
  const controls = [
    {
      keys: ["ArrowLeft", "ArrowRight"],
      description: "Move Left / Right",
    },
    {
      keys: ["Space", "ArrowUp", "KeyW"],
      description: "Jump",
    },
    {
      keys: ["ShiftLeft", "ArrowDown"],
      description: "Crouch / Run",
    },
    {
      keys: ["KeyR"],
      description: "Restart Level",
    },
    {
      keys: ["Escape"],
      description: "Pause / Resume",
    },
  ];

  return (
    <Overlay>
      <Title>CONTROLS</Title>

      <Group>
        <Label>KEYBOARD CONTROLS</Label>
        {controls.map((control, index) => (
          <KeyHint key={index}>
            <div>
              {control.keys.map((key, keyIndex) => (
                <span key={keyIndex} className="large">
                  {key}
                </span>
              ))}
            </div>
            <Description>{control.description}</Description>
          </KeyHint>
        ))}
      </Group>

      <Group>
        <Label>MOBILE CONTROLS</Label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <span style={{ textAlign: "center", color: "#ff0" }}>⬆️</span>
          <span style={{ textAlign: "center", color: "#fff" }}>⬅️</span>
          <span style={{ textAlign: "center", color: "#fff" }}>➡️</span>

          <span style={{ textAlign: "center", color: "#0f0", padding: "12px" }}>
            JUMP
          </span>
          <span style={{ textAlign: "center", color: "#0f0", padding: "12px" }}>
            RUN
          </span>
          <span style={{ textAlign: "center", color: "#f00", padding: "12px" }}>
            PAUSE
          </span>
        </div>
      </Group>
    </Overlay>
  );
}
