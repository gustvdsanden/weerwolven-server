import { Namespace, Server, Socket } from 'socket.io';

const gameStateTypes = {
  werewolf: {
    color: 'red',
  },
  civilian: {
    color: 'brown',
  },
};

export function socketFunctions(socket: Server | Namespace) {
  function emitMessage(
    message: string,
    options?: { [key: string]: any },
    diffSocket?: Socket,
  ) {
    const instance = diffSocket ?? socket;
    instance.emit('console', {
      message,
      options,
    });
  }

  function emitConnectedSuccesfully() {
    emitMessage('Connected successfully', { color: 'blue' });
  }

  function emitLobbyStateUpdate(message: string) {
    emitMessage(message, { color: 'aqua' });
  }

  function emitGameStateUpdate(
    message: string,
    socket: Socket,
    type: keyof typeof gameStateTypes,
  ) {
    emitMessage(message, { color: gameStateTypes[type].color }, socket);
  }

  return {
    emitConnectedSuccesfully,
    emitLobbyStateUpdate,
    emitGameStateUpdate,

    emitMessage: (message: string) => emitMessage(message, { color: 'black' }),
  };
}
