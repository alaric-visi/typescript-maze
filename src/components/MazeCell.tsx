import React from 'react';
import { Cell } from '../types/maze';

interface MazeCellProps {
  cell: Cell;
  cellSize: number;
}

export const MazeCell: React.FC<MazeCellProps> = ({ cell, cellSize }) => {
  const getCellClasses = () => {
    let classes = 'absolute border-gray-800 transition-all duration-200 ease-in-out';
    
    if (cell.isStart) {
      classes += ' bg-emerald-500 shadow-lg';
    } else if (cell.isEnd) {
      classes += ' bg-red-500 shadow-lg';
    } else if (cell.isPath) {
      classes += ' bg-blue-400 shadow-md animate-pulse';
    } else if (cell.isCurrentlyExploring) {
      classes += ' bg-orange-400 animate-bounce shadow-md';
    } else if (cell.isExplored) {
      classes += ' bg-yellow-200 animate-fade-in';
    } else if (cell.isInQueue) {
      classes += ' bg-purple-200 animate-pulse';
    } else {
      classes += ' bg-white hover:bg-gray-50';
    }
    
    return classes;
  };
  
  const getWallClasses = () => {
    let wallClasses = '';
    
    if (cell.walls.top) wallClasses += ' border-t-2';
    if (cell.walls.right) wallClasses += ' border-r-2';
    if (cell.walls.bottom) wallClasses += ' border-b-2';
    if (cell.walls.left) wallClasses += ' border-l-2';
    
    return wallClasses;
  };
  
  return (
    <div
      className={`${getCellClasses()} ${getWallClasses()}`}
      style={{
        left: cell.x * cellSize,
        top: cell.y * cellSize,
        width: cellSize,
        height: cellSize,
      }}
    >
      {cell.isStart && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
        </div>
      )}
      {cell.isEnd && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
        </div>
      )}
      {cell.isCurrentlyExploring && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-spin"></div>
        </div>
      )}
      {cell.isInQueue && cellSize > 12 && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
};