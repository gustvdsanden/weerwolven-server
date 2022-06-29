import { io } from '../main';

import { baseListeners } from '../listeners/base';
import { getUnusedNamespaceCode } from '../util';

export function _createNewNamespace() {
  const uniqueNamespaceCode = getUnusedNamespaceCode();
  const namespace = io.of(uniqueNamespaceCode);

  baseListeners(namespace);

  console.log(Array.from(io._nsps.keys()));

  return namespace;
}
