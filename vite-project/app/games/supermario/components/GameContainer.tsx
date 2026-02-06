import React, { useRef, useEffect, useCallback } from "react";

export interface GameContainerProps {
  width: number;
  height: number;
  renderCallback: (ctx: CanvasRenderingContext2D) => void;
}

export function GameContainer({ width, height, renderCallback }: GameContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      const animationFrameId = requestAnimationFrame(() => {
        renderCallback(ctx);
      });

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [width, height, renderCallback]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
