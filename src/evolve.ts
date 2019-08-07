import { Cell, Coordinate, Grid, getNeighbors } from './grid';

export class EvolutionService {
  public* evolve(seed: Grid): IterableIterator<Grid> {
    let grid: Grid = seed;
    while (true) {
      grid = this._evolveGrid(grid);
      yield grid;
    }
  }

  public _evolveGrid(grid: Grid): Grid {
    return grid.map((row, y) => 
      row.map((cell, x) => {
        return this._evolveCell(x, y, grid);
      })
    );
  }

  public _evolveCell(x: number, y: number, grid: Grid): Cell {
    const cell = grid[y][x];
    const numAliveNeighbors = this._countLiveNeighbors(x, y, grid);
    return this._getNextCellState(cell, numAliveNeighbors);
  }

  public _countLiveNeighbors(x: number, y: number, grid: Grid): number {
      return getNeighbors(x, y, grid)
        .map(coord => grid[coord.y][coord.x])
        .filter(cell => cell)
        .length;
  }

  public _getNextCellState(cell: Cell, numAliveNeighbors: number): Cell {
    switch (numAliveNeighbors) {
      case 2: // Maintain last state
        return cell;
      case 3: // Alive
        return true;
      default: // Dead
        return false;
    }
  }
}

