import { TypedRequestBody, TypedResponse } from '../types';
import { _createNewNamespace } from './namespace.controller';

export function createLobby(req: TypedRequestBody<void>, res: TypedResponse) {
  const newLobby = _createNewNamespace();

  return res.send(newLobby.name.substring(1));
}
