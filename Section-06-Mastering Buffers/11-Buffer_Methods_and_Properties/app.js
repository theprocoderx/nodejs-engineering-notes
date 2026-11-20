import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';

const nodeBuffer = Buffer.from('Hello World!', 'utf-8');

// ====== Methods =========

// const nodeBuffer = Buffer.alloc(8);
// nodeBuffer.write('abcdefg');

// console.log(nodeBuffer.toString());
// console.log(typeof nodeBuffer.toJSON());

// console.log(nodeBuffer.slice(5, 8).toString());
// console.log(nodeBuffer.subarray(2).toString());

// nodeBuffer.copy(nodeBuffer2, 0, 0, 5);
// // console.log(nodeBuffer2);    // deprecated
// console.log(nodeBuffer2.toString());

// console.log(nodeBuffer.includes('He', 5, 'utf-16le'));
// nodeBuffer.fill(98)
// console.log(nodeBuffer.readInt8(2))
// console.log(nodeBuffer.readInt16BE(3))

// console.log(nodeBuffer.writeInt8(0x65))
// console.log(nodeBuffer.writeInt16LE(0x65, 0))
// console.log(nodeBuffer.writeInt16LE(0x66, 2))
// console.log(nodeBuffer.writeInt16BE(0x65, 0));
// console.log(nodeBuffer.writeInt16BE(0x66, 2));

// console.log(nodeBuffer.at(2));

// ========== Properties =========


console.log(nodeBuffer)
console.log(nodeBuffer.buffer)
console.log(nodeBuffer.byteLength)
console.log(nodeBuffer.byteOffset)
console.log(nodeBuffer.length)