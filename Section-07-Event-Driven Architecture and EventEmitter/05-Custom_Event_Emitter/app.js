import EventEmitter from 'events';

const emitter = new EventEmitter();

emitter.setMaxListeners(2);

emitter.on('y', () => {
  console.log('Second y event fired');
});

emitter.once('abc', (a , b, c) => {
  console.log(a , b, c, 'abc event fired');
});

emitter.on('x', () => {
  console.log('x event fired');
});

emitter.on('y', () => {
  console.log('first y event fired');
});
console.log(emitter._events);
emitter.emit('abc', 1, 2, 3);
console.log(emitter._events);
emitter.emit('x');
emitter.emit('y');
