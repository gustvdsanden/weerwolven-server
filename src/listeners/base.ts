import { socketFunctions } from '../util';
import { _getUserById } from '../controllers/user.controller';
import { User } from '../models/user.model';
import { ExtendedNamespace, Message } from '../types';

export function baseListeners(instance: ExtendedNamespace) {
  instance.namespace.on('connection', async (socket) => {
    const {
      emitMessage,
      emitConnectedSuccesfully,
      emitLobbyStateUpdate,
      emitData,
    } = socketFunctions(instance.namespace);

    let connectedUser: User = null;
    const userId = Array.isArray(socket.handshake.query.userId)
      ? socket.handshake.query.userId[0]
      : socket.handshake.query.userId;

    await _getUserById(userId)
      .then((user) => {
        connectedUser = user;
        socket.data.user = {
          // @ts-expect-error hidden props
          ...user._doc,
          isOwner: user.id === instance.data.creatorId,
        };
        const connectedUsers = Array.from(
          instance.namespace.sockets.values(),
        ).map((connectedSocket) => connectedSocket.data) as User[];

        emitConnectedSuccesfully(socket);
        emitLobbyStateUpdate(`${connectedUser.name} connected to the lobby`);
        emitData({ connectedUsers: connectedUsers });
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

      const connectedUsers = Array.from(
        instance.namespace.sockets.values(),
      ).map((connectedSocket) => connectedSocket.data) as User[];

      emitData({ connectedUsers: connectedUsers });
    });

    socket.on('message', (msg) => {
      const message: Message = {
        content: msg,
        timeSent: new Date().toLocaleTimeString('en-GB'),
        sender: connectedUser.name,
      };
      emitMessage(message);
    });
  });
}
