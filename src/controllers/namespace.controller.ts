import { io } from '../main';

import { baseListeners } from '../listeners/base';
import { getUnusedNamespaceCode } from '../util';
import { ExtendedNamespace } from '../types';

export function _createNewNamespace() {
  const uniqueNamespaceCode = getUnusedNamespaceCode();
  const namespace = io.of(uniqueNamespaceCode);

  const extendedNamespace = { namespace, data: {} } as ExtendedNamespace;

  baseListeners(extendedNamespace);

  return extendedNamespace;
}
