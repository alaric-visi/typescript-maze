import { Cell } from '../types/maze';

export function createEmptyGrid(width: number, height: number): Cell[][] {
  const grid: Cell[][] = [];
  
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      grid[y][x] = {
        x,
        y,
        walls: {
          top: true,
          right: true,
          bottom: true,
          left: true,
        },
        visited: false,
        isStart: false,
        isEnd: false,
        isPath: false,
        isExplored: false,
        distance: Infinity,
        heuristic: 0,
        parent: null,
      };
    }
  }
  
  return grid;
}

export function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;
  const height = grid.length;
  const width = grid[0].length;
  
  // Top
  if (y > 0) neighbors.push(grid[y - 1][x]);
  // Right
  if (x < width - 1) neighbors.push(grid[y][x + 1]);
  // Bottom
  if (y < height - 1) neighbors.push(grid[y + 1][x]);
  // Left
  if (x > 0) neighbors.push(grid[y][x - 1]);
  
  return neighbors;
}

export function getUnvisitedNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  return getNeighbors(cell, grid).filter(neighbor => !neighbor.visited);
}

export function removeWallBetween(current: Cell, neighbor: Cell): void {
  const dx = current.x - neighbor.x;
  const dy = current.y - neighbor.y;
  
  if (dx === 1) {
    // Neighbor is to the left
    current.walls.left = false;
    neighbor.walls.right = false;
  } else if (dx === -1) {
    // Neighbor is to the right
    current.walls.right = false;
    neighbor.walls.left = false;
  } else if (dy === 1) {
    // Neighbor is above
    current.walls.top = false;
    neighbor.walls.bottom = false;
  } else if (dy === -1) {
    // Neighbor is below
    current.walls.bottom = false;
    neighbor.walls.top = false;
  }
}

export async function generateMaze(
  grid: Cell[][],
  onUpdate: (grid: Cell[][]) => void,
  speed: number = 10
): Promise<Cell[][]> {
  const height = grid.length;
  const width = grid[0].length;
  const stack: Cell[] = [];
  
  // Start from top-left corner
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);
  
  let stepCount = 0;
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const unvisitedNeighbors = getUnvisitedNeighbors(current, grid);
    
    if (unvisitedNeighbors.length > 0) {
      // Choose random unvisited neighbor
      const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
      const neighbor = unvisitedNeighbors[randomIndex];
      
      // Remove wall between current and neighbor
      removeWallBetween(current, neighbor);
      
      // Mark neighbor as visited and push to stack
      neighbor.visited = true;
      stack.push(neighbor);
    } else {
      // Backtrack
      stack.pop();
    }
    
    // Update visualization periodically
    stepCount++;
    if (stepCount % speed === 0) {
      onUpdate([...grid]);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  // Set start and end points
  grid[0][0].isStart = true;
  grid[height - 1][width - 1].isEnd = true;
  
  onUpdate([...grid]);
  return grid;
}