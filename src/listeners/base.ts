import { Namespace, Server } from 'socket.io';
import { socketFunctions } from '../util';
import { _getUserById } from '../controllers/user.controller';
import { User } from '../models/user.model';
import { io } from '../main';

export function baseListeners(instance: Server | Namespace) {
  instance.on('connection', async (socket) => {
    console.log((instance as any).name);
    const { emitConsoleMessage } = socketFunctions(socket);
    let connectedUser: User = null;
    const userId = Array.isArray(socket.handshake.query.userId)
      ? socket.handshake.query.userId[0]
      : socket.handshake.query.userId;

    await _getUserById(userId)
      .then((user) => {
        connectedUser = user;
        emitConsoleMessage('connectedSuccesfully');
      })
      .catch((err) => {
        console.log(err);
      });
    if (!connectedUser) {
      socket.disconnect();
      return;
    }

    socket.on('message', (msg) => {
      io.emit(`message`, `${connectedUser.name}: ${msg}`);
    });
  });
}
