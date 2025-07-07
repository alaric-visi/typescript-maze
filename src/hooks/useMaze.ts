import { useState, useCallback, useRef } from 'react';
import { MazeState, Algorithm, SolverStats } from '../types/maze';
import { createEmptyGrid, generateMaze } from '../utils/mazeGenerator';
import { solveMazeAStar, solveMazeBFS, solveMazeDFS } from '../utils/mazeSolver';

export function useMaze(initialWidth: number = 25, initialHeight: number = 25) {
  const [mazeState, setMazeState] = useState<MazeState>(() => ({
    grid: createEmptyGrid(initialWidth, initialHeight),
    width: initialWidth,
    height: initialHeight,
    start: { x: 0, y: 0 },
    end: { x: initialWidth - 1, y: initialHeight - 1 },
    isGenerating: false,
    isSolving: false,
    isGenerated: false,
    isSolved: false,
    currentPath: [],
    exploredCells: [],
    currentlyExploring: null,
    queuedCells: [],
  }));
  
  const [stats, setStats] = useState<SolverStats | null>(null);
  const generationRef = useRef<boolean>(false);
  const solvingRef = useRef<boolean>(false);
  
  const updateMaze = useCallback((updates: Partial<MazeState>) => {
    setMazeState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const generateNewMaze = useCallback(async (width: number, height: number, speed: number = 10) => {
    if (generationRef.current) return;
    
    generationRef.current = true;
    const newGrid = createEmptyGrid(width, height);
    
    updateMaze({
      grid: newGrid,
      width,
      height,
      start: { x: 0, y: 0 },
      end: { x: width - 1, y: height - 1 },
      isGenerating: true,
      isSolving: false,
      isGenerated: false,
      isSolved: false,
      currentPath: [],
      exploredCells: [],
      currentlyExploring: null,
      queuedCells: [],
    });
    
    setStats(null);
    
    try {
      const generatedGrid = await generateMaze(
        newGrid,
        (grid) => updateMaze({ grid: [...grid] }),
        speed
      );
      
      updateMaze({
        grid: generatedGrid,
        isGenerating: false,
        isGenerated: true,
      });
    } catch (error) {
      console.error('Error generating maze:', error);
      updateMaze({ isGenerating: false });
    } finally {
      generationRef.current = false;
    }
  }, [updateMaze]);
  
  const solveMaze = useCallback(async (algorithm: Algorithm, speed: number = 50) => {
    if (solvingRef.current || !mazeState.isGenerated || mazeState.isSolved) return;
    
    solvingRef.current = true;
    updateMaze({
      isSolving: true,
      isSolved: false,
      currentPath: [],
      exploredCells: [],
      currentlyExploring: null,
      queuedCells: [],
    });
    
    try {
      let solverFunction;
      switch (algorithm) {
        case 'astar':
          solverFunction = solveMazeAStar;
          break;
        case 'bfs':
          solverFunction = solveMazeBFS;
          break;
        case 'dfs':
          solverFunction = solveMazeDFS;
          break;
        default:
          solverFunction = solveMazeAStar;
      }
      
      const result = await solverFunction(
        mazeState.grid,
        mazeState.start,
        mazeState.end,
        (grid, exploredCells, currentlyExploring, queuedCells) => {
          updateMaze({
            grid: [...grid],
            exploredCells: [...exploredCells],
            currentlyExploring,
            queuedCells: [...queuedCells],
          });
        },
        speed
      );
      
      updateMaze({
        currentPath: result.path,
        isSolving: false,
        isSolved: true,
        currentlyExploring: null,
        queuedCells: [],
      });
      
      setStats(result.stats);
    } catch (error) {
      console.error('Error solving maze:', error);
      updateMaze({ 
        isSolving: false,
        currentlyExploring: null,
        queuedCells: [],
      });
    } finally {
      solvingRef.current = false;
    }
  }, [mazeState, updateMaze]);
  
  const resetMaze = useCallback(() => {
    if (generationRef.current || solvingRef.current) return;
    
    const resetGrid = [...mazeState.grid];
    resetGrid.forEach(row => {
      row.forEach(cell => {
        cell.isExplored = false;
        cell.isPath = false;
        cell.isCurrentlyExploring = false;
        cell.isInQueue = false;
        cell.parent = null;
        cell.distance = Infinity;
        cell.heuristic = 0;
        cell.explorationOrder = undefined;
      });
    });
    
    updateMaze({
      grid: resetGrid,
      isSolved: false,
      currentPath: [],
      exploredCells: [],
      currentlyExploring: null,
      queuedCells: [],
    });
    
    setStats(null);
  }, [mazeState.grid, updateMaze]);
  
  return {
    mazeState,
    stats,
    generateNewMaze,
    solveMaze,
    resetMaze,
  };
}