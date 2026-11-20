import EventEmitter from 'events';

const emitter = new EventEmitter();

emitter.setMaxListeners(2);

emitter.on('y', () => {
  console.log('Second y event fired');
});

emitter.once('abc', () => {
  console.log('abc event fired');
});

emitter.on('x', () => {
  console.log('x event fired');
});

emitter.on('y', () => {
  console.log('first y event fired');
});
console.log(emitter._events);
emitter.emit('abc');
console.log(emitter._events);
emitter.emit('x');
emitter.emit('y');
