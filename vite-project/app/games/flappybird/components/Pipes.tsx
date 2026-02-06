import React from "react";
import type { Pipe } from "../types";
import { COLORS, PIPE_WIDTH, CANVAS_HEIGHT } from "../constants";

interface PipesProps {
  pipes: Pipe[];
}

export const Pipes: React.FC<PipesProps> = ({ pipes }) => {
  return (
    <>
      {pipes.map((pipe, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${pipe.x}px`,
            top: "0px",
            width: `${PIPE_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top pipe */}
          <div
            style={{
              width: "100%",
              height: `${pipe.height}px`,
              background: COLORS.PIPE_GREEN,
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              position: "relative",
            }}
          >
            {/* Pipe top cap */}
            <div
              style={{
                position: "absolute",
                top: "-4px",
                left: "0",
                width: "100%",
                height: "8px",
                background: COLORS.PIPE_DARK_GREEN,
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
              }}
            />
            {/* Pipe border */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "4px",
                height: "100%",
                background: COLORS.PIPE_BORDER,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "4px",
                height: "100%",
                background: COLORS.PIPE_BORDER,
              }}
            />
          </div>

          {/* Gap */}
          <div
            style={{
              width: "100%",
              height: `${pipe.gap}px`,
            }}
          />

          {/* Bottom pipe */}
          <div
            style={{
              width: "100%",
              height: `${CANVAS_HEIGHT - pipe.height - pipe.gap}px`,
              background: COLORS.PIPE_GREEN,
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
              position: "relative",
            }}
          >
            {/* Pipe bottom cap */}
            <div
              style={{
                position: "absolute",
                bottom: "-4px",
                left: "0",
                width: "100%",
                height: "8px",
                background: COLORS.PIPE_DARK_GREEN,
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
              }}
            />
            {/* Pipe border */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "4px",
                height: "100%",
                background: COLORS.PIPE_BORDER,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "4px",
                height: "100%",
                background: COLORS.PIPE_BORDER,
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
