import { modulo } from './utils';

export type Cell = boolean;

export type Grid = Cell[][];

export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

export function getNeighbors(x: number, y: number, grid: Grid): Coordinate[] {
  const neighbors: Coordinate[] = [];
  const toCoordinate = toToroidal(grid.length, grid[0].length);

  // shiftY and ci modify x and y, so they are 1-indexed
  for (let shiftY = -1; shiftY <= 1; shiftY++) {
    for (let shiftX = -1; shiftX <= 1; shiftX++) {
      // Exclude own cell
      if (shiftY || shiftX) {
        const neighbor = toCoordinate(x + shiftX, y + shiftY);
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
}

function toToroidal(height: number, width: number) {
  return (x: number, y: number): Coordinate => ({
    x: modulo(x, width),
    y: modulo(y, height),
  });
}
