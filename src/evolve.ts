import { Cell, Coordinate, Grid, getNeighbors } from './grid';

export function* evolve(seed: Grid): IterableIterator<Grid> {
  let grid: Grid = seed;
  while (true) {
    grid = evolveGrid(grid);
    yield grid;
  }
}

function evolveGrid(grid: Grid): Grid {
  return grid.map((row, y) => 
    row.map((cell, x) => {
      return evolveCell(x, y, grid);
    })
  );
}

function evolveCell(x: number, y: number, grid: Grid): Cell {
  const cell = grid[y][x];
  const numAliveNeighbors = countLiveNeighbors(x, y, grid);
  return getNextCellState(cell, numAliveNeighbors);
}

function countLiveNeighbors(x: number, y: number, grid: Grid): number {
    return getNeighbors(x, y, grid)
      .map(coord => grid[coord.y][coord.x])
      .filter(cell => cell)
      .length;
}

function getNextCellState(cell: Cell, numAliveNeighbors: number): Cell {
  switch (numAliveNeighbors) {
    case 2: // Maintain last state
      return cell;
    case 3: // Alive
      return true;
    default: // Dead
      return false;
  }
}
