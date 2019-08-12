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
    const id = socket.id;
    socket.emit('init', id);

    socket.on(id, dto => {
      let tick = 0;
      const service = new EvolutionService();

      const evolutions = service.evolve(dto.seed);
      setInterval(() => {
        tick++;
        const grid = evolutions.next().value;
        logger.info(`Tick: ${tick}`);
        logger.info('Grid:');
        logger.grid(grid);
        socket.emit(id, { tick, grid });
      }, dto.delay)
    });
  });
}
main().catch(logger.error);
