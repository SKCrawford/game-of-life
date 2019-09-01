import { getNeighbors, toToroidal } from './grid';

describe('grid', () => {
  describe('grid/getNeighbors', () => {
    it('gets the neighbors of a grid coordinate', () => {
      const coord = { x: 1, y: 1 };
      const grid = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ]
      const expected = [
        // Top
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        // Sides
        { x: 0, y: 1 },
        { x: 2, y: 1 },
        // Bottom
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ]
      expect(getNeighbors(coord.x, coord.y, grid)).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('grid/toToroidal', () => {
    it('returns a toroidal coordinate', () => {
      const height = 3;
      const width = 3
      const toCoordinate = toToroidal(height, width);
      const expected = { x: 1, y: 1 };
      expect(toCoordinate(4, 4)).toEqual(expected);
    })
  })
});
