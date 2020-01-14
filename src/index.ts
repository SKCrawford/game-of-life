import { Socket } from 'socket.io';

import { createServer } from './server';
import { evolve } from './evolve';
import { coordinatesToGrid, gridToCoordinates } from './grid';
import { Logger } from './logger';

function gridChannel(id: string) {
  return `${id}:grid`;
}

function coordinatesChannel(id: string) {
  return `${id}:coordinates`;
}

async function main() {
  const io = createServer();
  const port = 8000;
  io.listen(port);

  const logger = new Logger(main.name);
  logger.info(`Started server on port ${port}`);

  io.on('connection', (socket: Socket) => {
    const socketId = socket.id;
    let timerId: NodeJS.Timeout;
    logger.debug(`Connected to socket ${socketId}`)

    // After a connection, send the unique ID to the client so that grids 
    // are not sent to all clients
    socket.emit('init', socketId);

    // When a client emits their unique ID as `${socketId}:grid`
    // along with a DTO containing the seed grid and the delay in MS,
    // send each evolution of the seed grid
    socket.on(gridChannel(socketId), dto => {
      let tick = 0;
      const evolutions = evolve(dto.seed);

      timerId = setInterval(() => {
        tick++;
        const grid = evolutions.next().value;
        logger.logGridEvolution(grid, tick, socketId);

        socket.emit(gridChannel(socketId), { tick, grid });
      }, dto.delay)
    });

  // When a client emits their unique ID as `${socketId}:coordinates`
  // along with a DTO containing the seed coordinates, height and width of
  // the grid, and the delay in MS, send each evolution of the seed grid.
  socket.on(coordinatesChannel(socketId), dto => {
    // Convert the seed coordinates to a seed grid
    let tick = 0;
    const seedGrid = coordinatesToGrid(dto.seed, dto.height, dto.width);

    // Get an iterator of the grid's evolutions
    const evolutions = evolve(seedGrid);

    // Emit each tick and living coordinates to the provided delay
    timerId = setInterval(() => {
      tick++;
      const grid = evolutions.next().value;
      logger.logGridEvolution(grid, tick, socketId);

      // Convert the grid back to coordinates and emit them
      const coordinates = gridToCoordinates(grid);
      socket.emit(coordinatesChannel(socketId), { tick, coordinates });
    }, dto.delay)
  });
    
    // Clean up by stopping the loop when the client disconnects
    socket.on('disconnect', () => {
      clearInterval(timerId);
    })
  });
}

main();
