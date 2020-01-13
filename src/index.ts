import { Socket } from 'socket.io';

import { createServer } from './server';
import { evolve } from './evolve';
import { coordinatesToGrid, gridToCoordinates } from './grid';
import { Logger } from './logger';

const logger = new Logger(main.name);

async function main() {
  const io = createServer();
  const port = 8000;
  io.listen(port);
  logger.info(`Started server on port ${port}`);

  io.on('connection', (socket: Socket) => {
    let socketId = socket.id;
    let timerId: NodeJS.Timeout;
    logger.debug(`Connected to socket ${socketId}`)

    // Send the unique ID to the client so that grids are not sent to each client
    socket.emit('init', socketId);

    // When a client emits their unique ID, a seed grid, and a delay, 
    // send the grid evolutions
    socket.on(`${socketId}:grid`, dto => {
      // Get an iterator of the grid's evolutions
      let tick = 0;
      const evolutions = evolve(dto.seed);

      // Emit each tick and grid evolution according to the provided delay
      timerId = setInterval(() => {
        tick++;
        const grid = evolutions.next().value;
        logger.info(`ID: ${socketId}`);
        logger.info(`Tick: ${tick}`);
        logger.info('Grid:');
        logger.grid(grid);
        socket.emit(`${socketId}:grid`, { tick, grid });
      }, dto.delay)
    });

    // Alternatively, when a client emits their unique ID, the height and width 
    // of the grid, seed coordinates, and a delay, send the coordinates of the 
    // living cells in the grid evolutions 
    socket.on(`${socketId}:coordinates`, dto => {
      // Convert the seed coordinates to a seed grid
      let tick = 0;
      const seedGrid = coordinatesToGrid(dto.seed, dto.height, dto.width);

      // Get an iterator of the grid's evolutions
      const evolutions = evolve(seedGrid);

      // Emit each tick and grid evolution according to the provided delay
      timerId = setInterval(() => {
        tick++;
        const grid = evolutions.next().value;
        logger.info(`ID: ${socketId}`);
        logger.info(`Tick: ${tick}`);
        logger.info('Grid:');
        logger.grid(grid);

        // Convert the grid back to coordinates and emit them
        const coordinates = gridToCoordinates(grid);
        socket.emit(`${socketId}:coordinates`, { tick, coordinates });
      }, dto.delay)
    });

    // Clean up by stopping the loop when the client disconnects
    socket.on('disconnect', () => {
      clearInterval(timerId);
    })
  });
}

main().catch(logger.error);
