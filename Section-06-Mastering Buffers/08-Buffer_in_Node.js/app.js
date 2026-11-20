import { Buffer } from 'buffer';

const nodeBuffer = Buffer.alloc(4);
const nodeBuffer2 = Buffer.from([97, 98, 99, 100]);
const nodeBuffer3 = Buffer.from([97, 98, 99, 100]);

console.log(nodeBuffer.byteLength);
console.log(nodeBuffer2.byteLength);
console.log(nodeBuffer3.byteLength);
console.log(nodeBuffer.buffer.byteLength);
console.log(nodeBuffer2.buffer.byteLength);
console.log(nodeBuffer3.buffer.byteLength);

// const a = new ArrayBuffer(4);
// const uint8Array = new Uint8Array(a);
// uint8Array[0] = 97;
// uint8Array[1] = 98;
// uint8Array[2] = 99;
// uint8Array[3] = 100;
// const nodeBuffer = new Buffer(4)

// const nodeBuffer = Buffer.from(a);
// console.log(uint8Array.buffer);
// console.log(nodeBuffer.buffer);
// console.log(nodeBuffer.buffer === uint8Array.buffer);

// console.log(nodeBuffer.toString());
// console.log(uint8Array.toString());
