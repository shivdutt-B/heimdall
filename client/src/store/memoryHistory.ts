import { atom } from 'recoil';
import { MemoryData } from '../hooks/useMemoryHistory';

// Atom to store memory history data per serverId and days
export const memoryHistoryAtom = atom<{ [key: string]: MemoryData[] }>({
  key: 'memoryHistoryAtom',
  default: {},
});

// Atom to store loading state per serverId and days
export const memoryHistoryLoadingAtom = atom<{ [key: string]: boolean }>({
  key: 'memoryHistoryLoadingAtom',
  default: {},
});

// Atom to store error state per serverId and days
export const memoryHistoryErrorAtom = atom<{ [key: string]: Error | null }>({
  key: 'memoryHistoryErrorAtom',
  default: {},
});
