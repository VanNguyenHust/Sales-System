import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

type Options<T> = {
  defaultValue?: T;
  type?: "session" | "local";
};

export function useStorage<T>(key: string, options?: Options<T>): [T, Dispatch<SetStateAction<T>>] {
  const storage = options?.type === "session" ? sessionStorage : localStorage;

  const [localState, setLocalState] = useState<T>(() => {
    const item = storage.getItem(key);
    if (!item) {
      return options?.defaultValue;
    }
    return JSON.parse(item);
  });

  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (newValue) =>
      setLocalState((prev) => {
        const result = isFunc(newValue) ? newValue(prev) : newValue;
        if (result !== undefined) {
          storage.setItem(key, JSON.stringify(result));
        } else {
          storage.removeItem(key);
        }
        return result;
      }),
    [key, setLocalState, storage]
  );

  return [localState, setState];
}

function isFunc<T>(f: SetStateAction<T>): f is (prevState: T) => T {
  return typeof f === "function";
}
