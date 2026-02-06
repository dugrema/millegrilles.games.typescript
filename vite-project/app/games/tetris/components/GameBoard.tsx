import { useContext } from "react";
import { GameContext } from "../GameContext";

export function GameBoard() {
  const { state, dispatch } = useContext(GameContext);
  const { grid, piece } = state;

  const cellSize = 20; // px

  const renderCell = (rowIdx: number, colIdx: number, value: number) => {
    const style: React.CSSProperties = {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      backgroundColor: value ? `hsl(${value * 45}, 70%, 50%)` : "#111",
      border: "1px solid #333",
      boxSizing: "border-box",
      position: "absolute" as const,
      left: `${colIdx * cellSize}px`,
      top: `${rowIdx * cellSize}px`,
    };
    return <div key={`${rowIdx}-${colIdx}`} style={style} />;
  };

  const renderPiece = () => {
    if (!piece) return null;
    const { shape, x, y, type } = piece;
    const cells: React.ReactNode[] = [];

    shape.forEach((filled, idx) => {
      if (!filled) return;
      const col = x + (idx % 4);
      const row = y + Math.floor(idx / 4);
      if (row < 0) return;
      cells.push(
        <div
          key={`p-${row}-${col}`}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: `hsl(${type * 45}, 70%, 50%)`,
            border: "1px solid #333",
            boxSizing: "border-box",
            position: "absolute" as const,
            left: `${col * cellSize}px`,
            top: `${row * cellSize}px`,
          }}
        />,
      );
    });
    return cells;
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${cellSize * 10}px`,
        height: `${cellSize * 20}px`,
        backgroundColor: "#222",
        margin: "0 auto",
      }}
    >
      {grid.flatMap((row, rowIdx) =>
        row.map((cell, colIdx) => renderCell(rowIdx, colIdx, cell)),
      )}
      {renderPiece()}
    </div>
  );
}
