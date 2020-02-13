import { Socket } from 'socket.io';

import { createServer } from './server';
import { evolve } from './evolve';
import { Logger } from './logger';
import { validateDto } from './dto';

async function main() {
  const io = createServer();
  const port = process.env.PORT || 8000;
  io.listen(port);

  const logger = new Logger(main.name);
  logger.info(`Started server on port ${port}`);

  io.on('connection', (socket: Socket) => {
    const socketId = socket.id;
    let timerId: NodeJS.Timeout;
    socket.emit('id', socketId);

    socket.on('seed', dto => {
      let validated;
      try {
        validated = validateDto(dto);
      } catch (err) {
        logger.error(err);
        return;
      }

      let tick = 0;
      const evolutions = evolve(validated.seed);

      timerId = setInterval(() => {
        tick++;
        const grid = evolutions.next().value;
        logger.logGridEvolution(grid, tick, socketId);

        socket.emit('evolve', { tick, grid });
      }, validated.delay)
    });

    // Clean up by stopping the loop when the client disconnects
    socket.on('disconnect', () => {
      clearInterval(timerId);
    })
  });
}

main();
