import { Namespace } from 'socket.io';

export type ExtendedNamespace = {
  namespace: Namespace;
  data: { [key: string]: any };
};
