import { Cell, Algorithm, SolverStats } from '../types/maze';
import { getNeighbors } from './mazeGenerator';

function heuristic(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function canMoveBetween(current: Cell, neighbor: Cell): boolean {
  const dx = current.x - neighbor.x;
  const dy = current.y - neighbor.y;
  
  if (dx === 1) {
    // Neighbor is to the left
    return !current.walls.left;
  } else if (dx === -1) {
    // Neighbor is to the right
    return !current.walls.right;
  } else if (dy === 1) {
    // Neighbor is above
    return !current.walls.top;
  } else if (dy === -1) {
    // Neighbor is below
    return !current.walls.bottom;
  }
  
  return false;
}

function reconstructPath(endCell: Cell): Cell[] {
  const path: Cell[] = [];
  let current: Cell | null = endCell;
  
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  
  return path;
}

function clearCellStates(grid: Cell[][]): void {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const cell = grid[y][x];
      cell.distance = Infinity;
      cell.heuristic = 0;
      cell.parent = null;
      cell.isExplored = false;
      cell.isPath = false;
      cell.isCurrentlyExploring = false;
      cell.isInQueue = false;
      cell.explorationOrder = undefined;
    }
  }
}

export async function solveMazeAStar(
  grid: Cell[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  onUpdate: (grid: Cell[][], exploredCells: Cell[], currentlyExploring: Cell | null, queuedCells: Cell[]) => void,
  speed: number = 50
): Promise<{ path: Cell[]; stats: SolverStats }> {
  const startTime = performance.now();
  const openSet: Cell[] = [];
  const closedSet: Set<Cell> = new Set();
  const exploredCells: Cell[] = [];
  
  clearCellStates(grid);
  
  const startCell = grid[start.y][start.x];
  const endCell = grid[end.y][end.x];
  
  startCell.distance = 0;
  startCell.heuristic = heuristic(startCell, endCell);
  openSet.push(startCell);
  
  let stepCount = 0;
  let explorationOrder = 0;
  
  while (openSet.length > 0) {
    // Find cell with lowest f-score
    openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
    const current = openSet.shift()!;
    
    // Mark current cell as being explored
    current.isCurrentlyExploring = true;
    current.explorationOrder = explorationOrder++;
    
    // Update queue visualization
    openSet.forEach(cell => {
      cell.isInQueue = true;
    });
    
    // Update visualization with current exploration
    onUpdate([...grid], [...exploredCells], current, [...openSet]);
    await new Promise(resolve => setTimeout(resolve, Math.max(1, 101 - speed)));
    
    if (current === endCell) {
      // Clear exploration states
      current.isCurrentlyExploring = false;
      openSet.forEach(cell => {
        cell.isInQueue = false;
      });
      
      const path = reconstructPath(endCell);
      const endTime = performance.now();
      const efficiency = path.length > 0 ? (path.length / exploredCells.length) * 100 : 0;
      
      // Animate path discovery
      for (let i = 0; i < path.length; i++) {
        path[i].isPath = true;
        onUpdate([...grid], [...exploredCells], null, []);
        await new Promise(resolve => setTimeout(resolve, Math.max(1, 51 - speed)));
      }
      
      return {
        path,
        stats: {
          pathLength: path.length,
          exploredNodes: exploredCells.length,
          executionTime: endTime - startTime,
          algorithm: 'astar',
          efficiency: Math.round(efficiency),
        },
      };
    }
    
    closedSet.add(current);
    current.isExplored = true;
    current.isCurrentlyExploring = false;
    exploredCells.push(current);
    
    const neighbors = getNeighbors(current, grid);
    
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor) || !canMoveBetween(current, neighbor)) {
        continue;
      }
      
      const tentativeDistance = current.distance + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
        neighbor.isInQueue = true;
      } else if (tentativeDistance >= neighbor.distance) {
        continue;
      }
      
      neighbor.parent = current;
      neighbor.distance = tentativeDistance;
      neighbor.heuristic = heuristic(neighbor, endCell);
    }
    
    stepCount++;
  }
  
  const endTime = performance.now();
  return {
    path: [],
    stats: {
      pathLength: 0,
      exploredNodes: exploredCells.length,
      executionTime: endTime - startTime,
      algorithm: 'astar',
      efficiency: 0,
    },
  };
}

export async function solveMazeBFS(
  grid: Cell[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  onUpdate: (grid: Cell[][], exploredCells: Cell[], currentlyExploring: Cell | null, queuedCells: Cell[]) => void,
  speed: number = 50
): Promise<{ path: Cell[]; stats: SolverStats }> {
  const startTime = performance.now();
  const queue: Cell[] = [];
  const visited: Set<Cell> = new Set();
  const exploredCells: Cell[] = [];
  
  clearCellStates(grid);
  
  const startCell = grid[start.y][start.x];
  const endCell = grid[end.y][end.x];
  
  queue.push(startCell);
  visited.add(startCell);
  
  let explorationOrder = 0;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Mark current cell as being explored
    current.isCurrentlyExploring = true;
    current.explorationOrder = explorationOrder++;
    
    // Update queue visualization
    queue.forEach(cell => {
      cell.isInQueue = true;
    });
    
    // Update visualization
    onUpdate([...grid], [...exploredCells], current, [...queue]);
    await new Promise(resolve => setTimeout(resolve, Math.max(1, 101 - speed)));
    
    if (current === endCell) {
      // Clear exploration states
      current.isCurrentlyExploring = false;
      queue.forEach(cell => {
        cell.isInQueue = false;
      });
      
      const path = reconstructPath(endCell);
      const endTime = performance.now();
      const efficiency = path.length > 0 ? (path.length / exploredCells.length) * 100 : 0;
      
      // Animate path discovery
      for (let i = 0; i < path.length; i++) {
        path[i].isPath = true;
        onUpdate([...grid], [...exploredCells], null, []);
        await new Promise(resolve => setTimeout(resolve, Math.max(1, 51 - speed)));
      }
      
      return {
        path,
        stats: {
          pathLength: path.length,
          exploredNodes: exploredCells.length,
          executionTime: endTime - startTime,
          algorithm: 'bfs',
          efficiency: Math.round(efficiency),
        },
      };
    }
    
    current.isExplored = true;
    current.isCurrentlyExploring = false;
    exploredCells.push(current);
    
    const neighbors = getNeighbors(current, grid);
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && canMoveBetween(current, neighbor)) {
        visited.add(neighbor);
        neighbor.parent = current;
        neighbor.isInQueue = true;
        queue.push(neighbor);
      }
    }
  }
  
  const endTime = performance.now();
  return {
    path: [],
    stats: {
      pathLength: 0,
      exploredNodes: exploredCells.length,
      executionTime: endTime - startTime,
      algorithm: 'bfs',
      efficiency: 0,
    },
  };
}

export async function solveMazeDFS(
  grid: Cell[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  onUpdate: (grid: Cell[][], exploredCells: Cell[], currentlyExploring: Cell | null, queuedCells: Cell[]) => void,
  speed: number = 50
): Promise<{ path: Cell[]; stats: SolverStats }> {
  const startTime = performance.now();
  const stack: Cell[] = [];
  const visited: Set<Cell> = new Set();
  const exploredCells: Cell[] = [];
  
  clearCellStates(grid);
  
  const startCell = grid[start.y][start.x];
  const endCell = grid[end.y][end.x];
  
  stack.push(startCell);
  visited.add(startCell);
  
  let explorationOrder = 0;
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    
    // Mark current cell as being explored
    current.isCurrentlyExploring = true;
    current.explorationOrder = explorationOrder++;
    
    // Update stack visualization (show as queue for consistency)
    stack.forEach(cell => {
      cell.isInQueue = true;
    });
    
    // Update visualization
    onUpdate([...grid], [...exploredCells], current, [...stack]);
    await new Promise(resolve => setTimeout(resolve, Math.max(1, 101 - speed)));
    
    if (current === endCell) {
      // Clear exploration states
      current.isCurrentlyExploring = false;
      stack.forEach(cell => {
        cell.isInQueue = false;
      });
      
      const path = reconstructPath(endCell);
      const endTime = performance.now();
      const efficiency = path.length > 0 ? (path.length / exploredCells.length) * 100 : 0;
      
      // Animate path discovery
      for (let i = 0; i < path.length; i++) {
        path[i].isPath = true;
        onUpdate([...grid], [...exploredCells], null, []);
        await new Promise(resolve => setTimeout(resolve, Math.max(1, 51 - speed)));
      }
      
      return {
        path,
        stats: {
          pathLength: path.length,
          exploredNodes: exploredCells.length,
          executionTime: endTime - startTime,
          algorithm: 'dfs',
          efficiency: Math.round(efficiency),
        },
      };
    }
    
    current.isExplored = true;
    current.isCurrentlyExploring = false;
    exploredCells.push(current);
    
    const neighbors = getNeighbors(current, grid);
    
    // Shuffle neighbors for more interesting DFS visualization
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
    }
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && canMoveBetween(current, neighbor)) {
        visited.add(neighbor);
        neighbor.parent = current;
        neighbor.isInQueue = true;
        stack.push(neighbor);
      }
    }
  }
  
  const endTime = performance.now();
  return {
    path: [],
    stats: {
      pathLength: 0,
      exploredNodes: exploredCells.length,
      executionTime: endTime - startTime,
      algorithm: 'dfs',
      efficiency: 0,
    },
  };
}