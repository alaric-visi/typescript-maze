import React, { useState } from 'react';
import { Play, Square, RotateCcw, Settings, Zap, Target, TrendingUp } from 'lucide-react';
import { Algorithm, SolverStats } from '../types/maze';

interface ControlsProps {
  onGenerateMaze: (width: number, height: number, speed: number) => void;
  onSolveMaze: (algorithm: Algorithm, speed: number) => void;
  onResetMaze: () => void;
  isGenerating: boolean;
  isSolving: boolean;
  isGenerated: boolean;
  stats: SolverStats | null;
}

export const Controls: React.FC<ControlsProps> = ({
  onGenerateMaze,
  onSolveMaze,
  onResetMaze,
  isGenerating,
  isSolving,
  isGenerated,
  stats,
}) => {
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(25);
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [generationSpeed, setGenerationSpeed] = useState(10);
  const [solvingSpeed, setSolvingSpeed] = useState(50);
  
  const handleGenerateMaze = () => {
    onGenerateMaze(width, height, generationSpeed);
  };
  
  const handleSolveMaze = () => {
    onSolveMaze(algorithm, solvingSpeed);
  };
  
  const formatTime = (ms: number) => {
    return `${ms.toFixed(2)}ms`;
  };
  
  const getAlgorithmName = (algo: Algorithm) => {
    switch (algo) {
      case 'astar':
        return 'A* Search';
      case 'bfs':
        return 'Breadth-First Search';
      case 'dfs':
        return 'Depth-First Search';
      default:
        return 'Unknown';
    }
  };
  
  const getAlgorithmDescription = (algo: Algorithm) => {
    switch (algo) {
      case 'astar':
        return 'Optimal pathfinding using heuristics';
      case 'bfs':
        return 'Guarantees shortest path, explores level by level';
      case 'dfs':
        return 'Fast but may not find optimal path';
      default:
        return '';
    }
  };
  
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Maze Controls</h2>
      </div>
      
      {/* Maze Generation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Maze Generation
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="5"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="5"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Generation Speed (lower = faster)
          </label>
          <input
            type="range"
            value={generationSpeed}
            onChange={(e) => setGenerationSpeed(Number(e.target.value))}
            min="1"
            max="50"
            className="w-full"
          />
          <span className="text-sm text-gray-500">{generationSpeed}</span>
        </div>
        
        <button
          onClick={handleGenerateMaze}
          disabled={isGenerating || isSolving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <Target className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate Maze'}
        </button>
      </div>
      
      {/* Maze Solving */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Maze Solving
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="astar">A* Search (Optimal)</option>
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {getAlgorithmDescription(algorithm)}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Animation Speed (higher = faster)
          </label>
          <input
            type="range"
            value={solvingSpeed}
            onChange={(e) => setSolvingSpeed(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full"
          />
          <span className="text-sm text-gray-500">{solvingSpeed}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSolveMaze}
            disabled={!isGenerated || isSolving || isGenerating}
            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            {isSolving ? 'Solving...' : 'Solve Maze'}
          </button>
          
          <button
            onClick={onResetMaze}
            disabled={isGenerating || isSolving}
            className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Animation Legend</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded animate-bounce"></div>
            <span>Currently Exploring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-200 rounded"></div>
            <span>In Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Explored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>Final Path</span>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border-t">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Solution Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Algorithm:</span>
              <p className="text-gray-800">{getAlgorithmName(stats.algorithm)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Execution Time:</span>
              <p className="text-gray-800">{formatTime(stats.executionTime)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Path Length:</span>
              <p className="text-gray-800">{stats.pathLength} cells</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Nodes Explored:</span>
              <p className="text-gray-800">{stats.exploredNodes}</p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Efficiency:</span>
              <span className={`font-bold ${getEfficiencyColor(stats.efficiency)}`}>
                {stats.efficiency}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  stats.efficiency >= 80 ? 'bg-green-500' :
                  stats.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.efficiency}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Path length vs nodes explored ratio
            </p>
          </div>
        </div>
      )}
    </div>
  );
};