import { Message } from '../types';
import { Namespace, Server, Socket } from 'socket.io';
import { User } from '../models/user.model';

export type dataType = {
  connectedUsers?: User[];
};

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
    message: Message,
    options?: { [key: string]: any },
    diffSocket?: Socket,
  ) {
    const instance = diffSocket ?? socket;
    const _message: Message = {
      content: message.content,
      timeSent: message.timeSent ?? new Date().toLocaleTimeString('en-GB'),
      sender: message.sender,
    };

    instance.emit('message', {
      message: _message,
      options: { color: options?.color ?? 'black', ...options },
    });
  }

  function emitConnectedSuccesfully(socket: Socket) {
    const message: Message = {
      content: 'Connected successfully',
      timeSent: new Date().toLocaleTimeString('en-GB'),
    };
    emitMessage(message, { color: 'blue' }, socket);
  }

  function emitLobbyStateUpdate(message: string) {
    const _message: Message = {
      content: message,
      timeSent: new Date().toLocaleTimeString('en-GB'),
    };
    emitMessage(_message, { color: 'aqua' });
  }

  function emitGameStateUpdate(
    message: string,
    socket: Socket,
    type: keyof typeof gameStateTypes,
  ) {
    const _message: Message = {
      content: message,
      timeSent: new Date().toLocaleTimeString('en-GB'),
    };
    emitMessage(_message, { color: gameStateTypes[type].color }, socket);
  }

  function emitData(data: dataType) {
    socket.emit('data', data);
  }

  return {
    emitMessage,
    emitConnectedSuccesfully,
    emitLobbyStateUpdate,
    emitGameStateUpdate,

    emitData,
  };
}
