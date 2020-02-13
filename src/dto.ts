interface Dto {
  delay: number;
  seed: boolean[][];
}

export function validateDto(dto: Dto) {
  if (!dto) {
    throw new Error('Invalid dto: must be an object with keys of delay and seed');
  }

  try {
    dto.delay = Math.floor(Number(dto.delay));
  } catch (err) {
    throw new Error('Invalid delay: must be a positive integer');
  }

  if (!dto.delay || typeof dto.delay !== 'number' || dto.delay <= 0 ) {
    throw new Error('Invalid delay: must be a positive integer');
  }

  if (!dto.seed || !Array.isArray(dto.seed) || !Array.isArray(dto.seed[0])) {
    throw new Error('Invalid seed: must be a 2-dimensional array of booleans');
  }

  return dto;
}
