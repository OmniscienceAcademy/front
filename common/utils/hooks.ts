import { linkChecker } from "@common/api";
import { useCallback, useEffect, useRef, useState } from "react";
import PromiseCanceller from "./PromiseCanceller";

export function useCounter(start: number) {
  const [count, setCount] = useState(start);
  const increment = useCallback(
    (delta = 1) => {
      if (delta === 0) return count;
      let newCount = count + delta;
      setCount((prevCount) => {
        newCount = prevCount + delta;
        return newCount;
      });

      return newCount;
    },
    [count],
  );
  const decrement = useCallback(
    (delta = 1) => {
      if (delta === 0) return count;
      let newCount = count - delta;
      setCount((prevCount) => {
        newCount = prevCount - delta;
        return newCount;
      });
      return newCount;
    },
    [count],
  );
  const reset = useCallback((newCount = start) => setCount(newCount), [start]);
  return { count, increment, decrement, reset };
}

type observer<T> = (value: T, oldValue: T) => void;
type setter<T> = (value: T) => T;

export function useObservable<T>(defaultValue: T): {
  get: () => T;
  set: (value: T | setter<T>) => T;
  subscribe: (callback: observer<T>) => observer<T>;
  unsubscribe: (callback: observer<T>) => void;
  value: T;
} {
  const values = useRef<{
    current: T;
    old: T;
  }>({ current: defaultValue, old: defaultValue });
  const callbacks = useRef<Set<observer<T>>>(new Set());
  const set = (value: T | setter<T>) => {
    const newValue =
      value instanceof Function ? value(values.current.current) : value;
    values.current.old = values.current.current;
    values.current.current = newValue;
    callbacks.current.forEach((callback) =>
      callback(newValue, values.current.old),
    );
    return newValue;
  };
  const get = useCallback(() => values.current.current, []);
  const subscribe = (callback: observer<T>) => {
    callbacks.current.add(callback);
    return callback;
  };
  const unsubscribe = (callback: observer<T>) => {
    callbacks.current.delete(callback);
  };
  return { get, set, subscribe, unsubscribe, value: values.current.current };
}

export function useValidLink(url: string) {
  const [valid, setValid] = useState(false);
  useEffect(() => {
    linkChecker(url, setValid);
    return () => setValid(false);
  }, [url]);
  return valid;
}

export function usePromiseCanceller() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promises = useRef<PromiseCanceller<any>[]>([]);

  useEffect(() => () => promises.current.forEach((p) => p.cancel()), []); // cancel all promises on unmount

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removePromise = useCallback((promise: PromiseCanceller<any>) => {
    promises.current = promises.current.filter((p) => p !== promise);
  }, []);
  const createPromise = useCallback(
    <T>(promise: Promise<T>, callback: (arg: T) => void) => {
      const newPromise = new PromiseCanceller(promise, callback);
      newPromise.addCallback(() => removePromise(newPromise));
      promises.current.push(newPromise);
    },
    [removePromise],
  );
  return createPromise;
}
