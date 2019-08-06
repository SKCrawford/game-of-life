import { modulo } from './modulo';

describe('utils/modulo', () => {
  it('modulos zero like JS', () => {
    expect(modulo(0, 3)).toEqual(0 % 3);
  });

  it('modulos a positive value like JS', () => {
    expect(modulo(1, 3)).toEqual(1 % 3);
    expect(modulo(2, 3)).toEqual(2 % 3);
    expect(modulo(3, 3)).toEqual(3 % 3);
    expect(modulo(4, 3)).toEqual(4 % 3);
  });

  it('modulos a negative value unlike JS', () => {
    expect(modulo(-1, 3)).toEqual(2);
    expect(modulo(-2, 3)).toEqual(1);
    expect(modulo(-3, 3)).toEqual(0);
    expect(modulo(-4, 3)).toEqual(2);
    expect(modulo(-5, 3)).toEqual(1);
  });
});
