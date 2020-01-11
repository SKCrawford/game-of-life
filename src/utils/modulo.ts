/**
 * A function that mimics the modulo operator. Compatible with negative numbers.
 * Source: https://jsperf.com/negative-modulo/17
 */
export function modulo(val: number, size: number): number {
  return ((val % size) + size) % size;
}
