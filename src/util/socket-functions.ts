import { Socket } from 'socket.io';

const consoleTypeOptions = {
  connectedSuccesfully: {
    color: 'blue',
    message: 'Connected successfully',
  },
  defaultMessage: {
    color: 'black',
  },
  gameStateUpdate: {
    color: 'yellow',
  },
};

export function socketFunctions(socket: Socket) {
  function emitConsoleMessage(
    type: keyof typeof consoleTypeOptions,
    extraOptions?: { [key: string]: any },
  ) {
    socket.emit('message', {
      type,
      options: { ...consoleTypeOptions[type], ...extraOptions },
    });
  }

  return {
    emitConsoleMessage,
  };
}
