import { createServer } from './server';
import { EvolutionService } from './evolve';

async function main() {
  const io = createServer();
  const port = 8000;
  io.listen(port);

  io.on('connection', socket => {
    const id = socket.id;
    socket.emit('init', id);

    socket.on(id, (dto, fn) => {
      const service = new EvolutionService();
      console.log(id, dto);

      const evolutions = service.evolve(dto.seed);
      setInterval(() => {
        const grid = evolutions.next().value;
        socket.emit(id, grid);
      }, dto.delay)
    });
  });
}
main().catch(console.error);
