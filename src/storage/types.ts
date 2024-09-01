export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated' | 'syncing';

export interface Entity {
  id: string;
}

export interface StorageSync<T extends Entity> {
  name: string;
  state(): T;
  // not needed
  clear(): void;
  // not needed
  push(data: T): void;
}
