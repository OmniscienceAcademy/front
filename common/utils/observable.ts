export type observer<T> = (value: T, oldValue: T) => void;

export default class Observable<T> {
  private value: T;

  private observers: observer<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }

  get(): T {
    return this.value;
  }

  set(value: T | ((oldValue: T) => T)): void {
    const oldValue = this.value;
    if (value instanceof Function) {
      this.value = value(oldValue);
    } else {
      this.value = value;
    }
    this.notify(oldValue);
  }

  subscribe(callback: observer<T>): observer<T> {
    this.observers.push(callback);
    return callback;
  }

  unsubscribe(callback: observer<T>): void {
    this.observers = this.observers.filter((ob) => ob !== callback);
  }

  private notify(oldValue: T): void {
    this.observers.forEach((ob) => ob(this.value, oldValue));
  }

  reset(value?: T): void {
    this.observers = [];
    if (value !== undefined) {
      this.value = value;
    }
  }
}
