import { Namespace, Server } from 'socket.io';
import { socketFunctions } from '../util';
import { _getUserById } from '../controllers/user.controller';
import { User } from '../models/user.model';

export function baseListeners(instance: Server | Namespace) {
  const allConnectedUsers: User[] = [];
  instance.on('connection', async (socket) => {
    const { emitConnectedSuccesfully, emitLobbyStateUpdate } =
      socketFunctions(instance);
    let connectedUser: User = null;
    const userId = Array.isArray(socket.handshake.query.userId)
      ? socket.handshake.query.userId[0]
      : socket.handshake.query.userId;

    await _getUserById(userId)
      .then((user) => {
        connectedUser = user;
        allConnectedUsers.push(user);
        emitConnectedSuccesfully();
        emitLobbyStateUpdate(`${connectedUser.name} connected to the lobby`);
      })
      .catch((err) => {
        console.log(err);
      });
    if (!connectedUser) {
      socket.disconnect();
      return;
    }
    socket.on('disconnect', () => {
      emitLobbyStateUpdate(`${connectedUser.name} disconnected from the lobby`);
      allConnectedUsers.splice(allConnectedUsers.indexOf(connectedUser), 1);
    });

    socket.on('message', (msg) => {
      instance.emit('message', `${connectedUser.name}: ${msg}`);
    });
  });
}
