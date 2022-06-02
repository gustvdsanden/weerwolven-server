import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { db } from './models';
import { router as userRouter } from './routes/user.routes';
import { router as roleRouter } from './routes/role.routes';
import bodyParser from 'body-parser';

export const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
  }),
);

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

app.use('/users', userRouter);
app.use('/roles', roleRouter);

db.mongoose.connect(db.url).then(() => {
  db.seed();
  console.log('Connected to the database!', db.url);
});

io.on('connection', (socket) => {
  let nama = '';
  socket.emit('console', {
    type: 'askForName',
    options: { name: '', socketId: socket.id },
  });

  socket.on('name', (name: string) => {
    nama = name;
    socket.emit('console', {
      type: 'displayMessage',
      options: {
        message: `Hello ${name}, you are successfully connected`,
        color: 'blue',
      },
    });
  });

  socket.on('message', (msg) => {
    console.log('test');
    io.emit(`message`, `${nama}: ${msg}`);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
