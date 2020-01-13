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

export function toToroidal(height: number, width: number) {
  return (x: number, y: number): Coordinate => ({
    x: modulo(x, width),
    y: modulo(y, height),
  });
}

/** 
 * Translate an array of coordinates along with a height and width into a
 * grid. The grid is filled with false except for the given coordinates.
 */
export function coordinatesToGrid(coords: Coordinate[], height: number, width: number): Grid {
  // 
  const row = new Array(width).fill(false);
  const rows = new Array(height).fill([...row]);
  const grid = rows.map(r => JSON.parse(JSON.stringify(row)));
  const toCoord = toToroidal(height, width);

  coords.forEach(coord => {
    const toroidalCoord = toCoord(coord.x, coord.y);
    grid[toroidalCoord.y][toroidalCoord.x] = true;
    // grid[1][1] = true;
  });

  return grid;
}

export function gridToCoordinates(grid: Grid): Coordinate[] {
  let coords: Coordinate[] = [];
  grid.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell) {
        coords.push({
          x: ci,
          y: ri,
        });
      }
    });
  });
  return coords;
}
