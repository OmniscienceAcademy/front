export default class PromiseCanceller<T> {
  private promise: Promise<T>;

  private callbacks: Array<(arg: T) => void> | null;

  constructor(promise: Promise<T>, ...callbacks: ((arg: T) => void)[]) {
    this.promise = promise;
    this.callbacks = callbacks;
    this.promise.then(this.callbackWrapper.bind(this));
  }

  callbackWrapper(arg: T) {
    if (this.callbacks) {
      this.callbacks.forEach((callback) => callback(arg));
    }
  }

  addCallback(callback: (arg: T) => void) {
    if (this.callbacks) {
      this.callbacks.push(callback);
    }
  }

  cancel() {
    this.callbacks = null;
  }
}
