import * as cors from 'cors';
import * as Http from 'http';
import * as Io from 'socket.io';
import * as Express from 'express';

export function createServer() {
  const app = Express();
  app.use(cors());
  const server = Http.createServer(app);
  return Io(server);
}
