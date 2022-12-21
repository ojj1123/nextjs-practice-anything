import { SetStateAction, useCallback, useState } from 'react';
import { safeLocalStorage } from './storage';

export type Serializable<T> = T extends
  | string
  | number
  | boolean
  | unknown[]
  | Record<string, unknown>
  ? T
  : never;

interface StorageStateOptions<T> {
  defaultValue?: Serializable<T>;
}

export function useLocalStorage<T>(
  key: string,
  { defaultValue }: StorageStateOptions<T> = {}
): readonly [
  Serializable<T> | undefined,
  (value: SetStateAction<Serializable<T> | undefined>) => void
] {
  const getValue = useCallback(<T>() => {
    const data = safeLocalStorage.get(key);

    if (data == null) {
      return defaultValue;
    }

    try {
      const result = JSON.parse(data);

      if (result == null) {
        return defaultValue;
      }

      return result as T;
    } catch {
      // NOTE: JSON 객체가 아닌 경우
      return defaultValue;
    }
  }, [defaultValue, key]);

  const [state, setState] = useState<Serializable<T> | undefined>(getValue);

  const set = useCallback(
    (value: SetStateAction<Serializable<T> | undefined>) => {
      setState((curr) => {
        const nextValue = typeof value === 'function' ? value(curr) : value;

        if (nextValue == null) {
          safeLocalStorage.remove(key);
        } else {
          safeLocalStorage.set(key, JSON.stringify(nextValue));
        }

        return nextValue;
      });
    },
    [key]
  );

  return [state, set];
}
