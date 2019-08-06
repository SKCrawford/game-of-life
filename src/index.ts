import { createServer } from './server';
// import { evolve } from './evolve';

async function main() {
  const io = createServer();
  const port = 8000;
  io.listen(port);

  io.on('connection', socket => {
    const id = socket.id;
    socket.emit('init', id);

    socket.on(id, dto => {
      console.log(id, dto);
      // const evolutions = evolve(dto.seed);
      // setInterval(() => {
      //   const grid = evolutions.next().value;
      //   socket.emit(id, grid);
      // }, dto.delay)
    });
  });
}
main().catch(console.error);
