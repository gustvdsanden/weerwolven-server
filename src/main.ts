import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { db } from './models';

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.get('/', (req, res) => {
  res.send('hello world');
});

db.mongoose.connect(db.url).then(() => {
  db.seed();
  console.log('Connected to the database!', db.url);
});

io.on('connection', (socket) => {
  socket.id;
  socket.emit('console', 'you connected to the server');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
