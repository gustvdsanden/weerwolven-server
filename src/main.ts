import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.id
  socket.emit('console', 'you connected to the server');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});

httpServer.listen(3000);
