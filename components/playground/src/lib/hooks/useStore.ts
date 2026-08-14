import { useEffect, useState } from "react";
import { StoreApi, UseBoundStore } from 'zustand';

const useStore = <T, F>(
  store: UseBoundStore<StoreApi<T>>,
  callback: (state: T) => F
) => {
  const [data, setData] = useState<F>(() => callback(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setData(callback(state));
    });

    return () => {
      unsubscribe();
    };
  }, [store, callback]);

  return data;
};

export default useStore;
