import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

const useMounted = (): boolean => {
  return useSyncExternalStore(
    subscribe,
    () => true,  // client snapshot — returns true on client
    () => false  // server snapshot — returns false on server
  );
};

export default useMounted;