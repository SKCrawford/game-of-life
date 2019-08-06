import * as Http from 'http';
import * as Io from 'socket.io';
import * as Express from 'express';

export function createServer(port: number = 8001) {
  const app = Express.default();
  const server = Http.createServer(app);
  const io = Io.default(server);
  return io;
}
