import { Cell, Grid, getNeighbors } from './grid';

export function* evolve(seed: Grid): IterableIterator<Grid> {
  let grid: Grid = seed;
  while (true) {
    grid = _evolveGrid(grid);
    yield grid;
  }
}

export function _evolveGrid(grid: Grid): Grid {
  return grid.map((row, y) => 
    row.map((cell, x) => {
      return _evolveCell(x, y, grid);
    })
  );
}

export function _evolveCell(x: number, y: number, grid: Grid): Cell {
  const cell = grid[y][x];
  const numAliveNeighbors = _countLiveNeighbors(x, y, grid);
  return _getNextCellState(cell, numAliveNeighbors);
}

export function _countLiveNeighbors(x: number, y: number, grid: Grid): number {
    return getNeighbors(x, y, grid)
      .map(coord => grid[coord.y][coord.x])
      .filter(cell => cell)
      .length;
}

export function _getNextCellState(cell: Cell, numAliveNeighbors: number): Cell {
  switch (numAliveNeighbors) {
    case 2: // Maintain last state
      return cell;
    case 3: // Alive
      return true;
    default: // Dead
      return false;
  }
}
