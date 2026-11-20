class myEventEmitter {
  constructor() {
    this._events = {};
  }

  on(eventName, handler) {
    if (this._events[eventName]) {
      this._events[eventName].push(handler);
    } else {
      this._events[eventName] = [handler];
    }
  }

  emit(eventName, ...args) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((event) => {
        event(...args);
      });
    }
  }
}

const emitter = new myEventEmitter();

emitter.on('x', () => {
  console.log('Emitted event x 1');
});

emitter.on('x', (a, b, c) => {
  console.log(a, b, c, 'Emitted event x 2');
});
emitter.on('y', () => {
  console.log('y event fired');
});
emitter.emit('x', 1, 2, 3);
emitter.emit('y');
