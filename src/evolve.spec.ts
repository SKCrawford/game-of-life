import * as service from './evolve';

describe('EvolutionService', () => {
  // let service: EvolutionService;
  const mock = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false,  true,  true,  true, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ];

  // beforeEach(() => {
  //   service = new EvolutionService();
  // })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('evolves a grid', () => {
    const expected = [
      [false, false, false, false, false],
      [false, false,  true, false, false],
      [false, false,  true, false, false],
      [false, false,  true, false, false],
      [false, false, false, false, false],
    ];
    expect(service._evolveGrid(mock)).toEqual(expect.arrayContaining(expected));
  });

  it('evolves a cell', () => {
    const result = service._evolveCell(2, 1, mock);
    expect(result).toBeTruthy();
  });

  it('calculates the number of a cell\'s living neighbors (toroidally)', () => {
    const grid = [
      [false, true, false],
      [ true, false, true],
      [false, true, false],
    ];
    const countLiving = (x: number, y: number) => service._countLiveNeighbors(x, y, grid);
    expect(countLiving(0, 0)).toEqual(4);
    expect(countLiving(1, 1)).toEqual(4);
    expect(countLiving(2, 2)).toEqual(4);
  });

  it('gets a cell\'s next state using the cell and its number of living neighbors', () => {
    expect(service._getNextCellState(false, 1)).toBeFalsy();
    expect(service._getNextCellState(false, 2)).toBeFalsy();
    expect(service._getNextCellState(false, 3)).toBeTruthy();
    expect(service._getNextCellState(false, 4)).toBeFalsy();
    expect(service._getNextCellState(false, 5)).toBeFalsy();
    expect(service._getNextCellState(false, 6)).toBeFalsy();
    expect(service._getNextCellState(false, 7)).toBeFalsy();
    expect(service._getNextCellState(false, 8)).toBeFalsy();
    expect(service._getNextCellState(true, 1)).toBeFalsy();
    expect(service._getNextCellState(true, 2)).toBeTruthy();
    expect(service._getNextCellState(true, 3)).toBeTruthy();
    expect(service._getNextCellState(true, 4)).toBeFalsy();
    expect(service._getNextCellState(true, 5)).toBeFalsy();
    expect(service._getNextCellState(true, 6)).toBeFalsy();
    expect(service._getNextCellState(true, 7)).toBeFalsy();
    expect(service._getNextCellState(true , 8)).toBeFalsy();
  });
});
