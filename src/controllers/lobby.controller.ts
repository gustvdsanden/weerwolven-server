import { TypedRequestBody, TypedResponse } from '../types';
import { _createNewNamespace } from './namespace.controller';

export function createLobby(
  req: TypedRequestBody<{ creatorId: string }>,
  res: TypedResponse,
) {
  if (req.body.creatorId === '') {
    res.status(400).send('No creator id specified');
    return;
  }

  const newLobby = _createNewNamespace();

  newLobby.data.creatorId = req.body.creatorId;

  res.send(newLobby.namespace.name.substring(1));
}
