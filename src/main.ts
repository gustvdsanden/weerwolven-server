import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { db } from './models';
import { router as userRouter } from './routes/user.routes';
import { router as roleRouter } from './routes/role.routes';
import bodyParser from 'body-parser';
import { User } from './models/user.model';
import { _getUserById } from './controllers/user.controller';

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

io.on('connection', async (socket) => {
  let connectedUser: User = null;
  const userId = Array.isArray(socket.handshake.query.userId)
    ? socket.handshake.query.userId[0]
    : socket.handshake.query.userId;

  await _getUserById(userId)
    .then((user) => {
      connectedUser = user;
    })
    .catch((err) => {
      console.log(err);
    });
  if (!connectedUser) {
    socket.disconnect();
    return;
  }

  socket.on('message', (msg) => {
    console.log('test');
    io.emit(`message`, `${connectedUser.name}: ${msg}`);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
