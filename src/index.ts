import { createServer } from './server';
import { EvolutionService } from './evolve';
import { Logger } from './logger';

const logger = new Logger(main.name);

async function main() {
  const io = createServer();
  const port = 8000;
  io.listen(port);
  logger.info(`Started server on port ${port}`);

  io.on('connection', socket => {
    logger.debug('Connected');
    const service = new EvolutionService(); // One client, one service
    let timerId: NodeJS.Timeout;

    // Send the unique ID to the client so that grids are not sent to each client
    socket.emit('init', socket.id);

    // When a client emits their unique ID, a seed grid, and a delay, 
    // send the grid evolutions
    socket.on(socket.id, dto => {
      // Get an iterator of the grid's evolutions
      let tick = 0;
      const evolutions = service.evolve(dto.seed);

      // Emit each tick and grid evolution according to the provided delay
      timerId = setInterval(() => {
        tick++;
        const grid = evolutions.next().value;
        logger.info(`ID: ${socket.id}`);
        logger.info(`Tick: ${tick}`);
        logger.info('Grid:');
        logger.grid(grid);
        socket.emit(socket.id, { tick, grid });
      }, dto.delay)
    });

    // Clean up by stopping the loop when the client disconnects
    socket.on('disconnect', () => {
      clearInterval(timerId);
    })
  });
}

main().catch(logger.error);
