import React from 'react';
import { MazeState } from '../types/maze';
import { MazeCell } from './MazeCell';

interface MazeVisualizationProps {
  mazeState: MazeState;
  cellSize: number;
}

export const MazeVisualization: React.FC<MazeVisualizationProps> = ({
  mazeState,
  cellSize,
}) => {
  const { grid, width, height } = mazeState;
  
  return (
    <div className="relative bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <div
        className="relative"
        style={{
          width: width * cellSize,
          height: height * cellSize,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <MazeCell
              key={`${x}-${y}`}
              cell={cell}
              cellSize={cellSize}
            />
          ))
        )}
      </div>
    </div>
  );
};