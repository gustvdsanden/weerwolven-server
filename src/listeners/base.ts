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
    let connectedUsers: User[] = [];
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
        connectedUsers = Array.from(instance.namespace.sockets.values()).map(
          (connectedSocket) => connectedSocket.data,
        ) as User[];

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

      connectedUsers = Array.from(instance.namespace.sockets.values()).map(
        (connectedSocket) => connectedSocket.data,
      ) as User[];

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

    // socket.on('test', (arg, callback) => {
    //   console.log(JSON.stringify(arg));
    //   callback(JSON.stringify(arg));
    // });

    socket.on('kick', (id: string, callback) => {
      if (socket.data.user.isOwner) {
        const sockets = Array.from(instance.namespace.sockets.values());
        const socketToKick = sockets.find(
          (socket) => socket.data.user._id.toString() === id,
        );

        if (socketToKick) {
          socketToKick.disconnect();
          callback(id);
        }
      }
    });
  });
}
