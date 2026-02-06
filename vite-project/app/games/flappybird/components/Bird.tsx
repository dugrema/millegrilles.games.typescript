// Bird.tsx - Bird rendering component
import React from "react";
import type { Bird as BirdType } from "../types";
import { BIRD_COLOR } from "../constants";

interface BirdProps {
  bird: BirdType;
}

export const Bird: React.FC<BirdProps> = ({ bird }) => {
  const { x, y, width, height, rotation, color } = bird;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}rad)`,
        pointerEvents: "none",
      }}
    >
      {/* Bird body */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: color,
          borderRadius: "50% 50% 50% 50%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Bird eye */}
        <div
          style={{
            position: "absolute",
            left: "60%",
            top: "20%",
            width: "30%",
            height: "30%",
            background: "white",
            borderRadius: "50%",
            border: "3px solid #333",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "70%",
            top: "35%",
            width: "50%",
            height: "50%",
            background: "#333",
            borderRadius: "50%",
          }}
        />

        {/* Bird wing */}
        <div
          style={{
            position: "absolute",
            left: "20%",
            top: "45%",
            width: "50%",
            height: "30%",
            background: "#e6c200",
            borderRadius: "50% 50% 0 0",
            transform: "rotate(-20deg)",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
};
