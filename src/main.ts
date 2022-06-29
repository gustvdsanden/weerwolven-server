import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { db } from './models';
import { router as userRouter } from './routes/user.routes';
import { router as roleRouter } from './routes/role.routes';
import { router as authRouter } from './routes/auth.router';
import { router as lobbyRouter } from './routes/lobby.router';
import bodyParser from 'body-parser';
import { baseListeners } from './listeners/base';

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

app.use('/users', userRouter);
app.use('/roles', roleRouter);
app.use('/auth', authRouter);
app.use('/lobby', lobbyRouter);

baseListeners(io);

db.mongoose.connect(db.url).then(() => {
  db.seed();
  console.log('Connected to the database!', db.url);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
