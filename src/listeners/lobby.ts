import { Namespace } from 'socket.io';

export function lobbyListener(instance: Namespace) {
  instance.on('message', (message) => {
    instance.emit('message', message);
  });
}
