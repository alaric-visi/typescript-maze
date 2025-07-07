import React, { useEffect, useState } from 'react';
import { MazeVisualization } from './components/MazeVisualization';
import { Controls } from './components/Controls';
import { useMaze } from './hooks/useMaze';
import { Compass } from 'lucide-react';

function App() {
  const { mazeState, stats, generateNewMaze, solveMaze, resetMaze } = useMaze();
  const [cellSize, setCellSize] = useState(16);
  
  // Calculate optimal cell size based on maze dimensions and screen size
  useEffect(() => {
    const maxWidth = Math.min(window.innerWidth * 0.6, 800);
    const maxHeight = Math.min(window.innerHeight * 0.7, 600);
    
    const optimalCellSize = Math.min(
      Math.floor(maxWidth / mazeState.width),
      Math.floor(maxHeight / mazeState.height)
    );
    
    setCellSize(Math.max(8, Math.min(24, optimalCellSize)));
  }, [mazeState.width, mazeState.height]);
  
  // Generate initial maze
  useEffect(() => {
    if (!mazeState.isGenerated) {
      generateNewMaze(25, 25, 10);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Maze Generator & Solver
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Watch as complex mazes are generated using recursive backtracking, 
            then see different algorithms find the optimal path with live animation showing exploration patterns.
          </p>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Maze Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Maze Visualization</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>End</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded animate-bounce"></div>
                    <span>Exploring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span>Path</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <MazeVisualization
                  mazeState={mazeState}
                  cellSize={cellSize}
                />
              </div>
              
              {/* Status */}
              <div className="mt-4 text-center">
                {mazeState.isGenerating && (
                  <p className="text-blue-600 font-medium">
                    Generating maze using recursive backtracking...
                  </p>
                )}
                {mazeState.isSolving && (
                  <div className="space-y-2">
                    <p className="text-emerald-600 font-medium">
                      Solving maze using pathfinding algorithm...
                    </p>
                    {mazeState.currentlyExploring && (
                      <p className="text-orange-600 text-sm">
                        Currently exploring: ({mazeState.currentlyExploring.x}, {mazeState.currentlyExploring.y})
                      </p>
                    )}
                    <div className="flex justify-center gap-4 text-sm text-gray-600">
                      <span>Explored: {mazeState.exploredCells.length}</span>
                      <span>In Queue: {mazeState.queuedCells.length}</span>
                    </div>
                  </div>
                )}
                {mazeState.isSolved && (
                  <p className="text-green-600 font-medium">
                    ✓ Maze solved! Path highlighted in blue.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="lg:col-span-1">
            <Controls
              onGenerateMaze={generateNewMaze}
              onSolveMaze={solveMaze}
              onResetMaze={resetMaze}
              isGenerating={mazeState.isGenerating}
              isSolving={mazeState.isSolving}
              isGenerated={mazeState.isGenerated}
              stats={stats}
            />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            Built with React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-sm">
            Featuring recursive backtracking for generation and A*, BFS, DFS algorithms for solving with live animation
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;