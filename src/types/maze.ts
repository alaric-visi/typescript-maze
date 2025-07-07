export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
  isExplored: boolean;
  isCurrentlyExploring: boolean;
  isInQueue: boolean;
  distance: number;
  heuristic: number;
  parent: Cell | null;
  explorationOrder?: number;
}

export interface MazeState {
  grid: Cell[][];
  width: number;
  height: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  isGenerating: boolean;
  isSolving: boolean;
  isGenerated: boolean;
  isSolved: boolean;
  currentPath: Cell[];
  exploredCells: Cell[];
  currentlyExploring: Cell | null;
  queuedCells: Cell[];
}

export type Algorithm = 'astar' | 'bfs' | 'dfs';

export interface SolverStats {
  pathLength: number;
  exploredNodes: number;
  executionTime: number;
  algorithm: Algorithm;
  efficiency: number;
}