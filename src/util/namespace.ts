import { io } from '../main';

export function getUnusedNamespaceCode(length = 8): string {
  let randomChars = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    randomChars += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  if (Array.from(io._nsps.keys()).includes(randomChars)) {
    return getUnusedNamespaceCode(length);
  }

  return randomChars;
}
