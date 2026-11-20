import { Buffer } from 'node:buffer';

const arr = [65, 66, 67, 68];

const buf = Buffer.from(arr);

console.log(buf);
// <Buffer 41 42 43 44>

console.log(buf.toString());
// ABC


const buf1 = Buffer.from([65, 256, 257, -1]);

console.log(buf1);
// <Buffer 41 00 01 ff>



// const u16 = new Uint16Array([0, 0xffff]);

// const buf = Buffer.copyBytesFrom(u16, 1, 1);

// // // u16[1] = 0;

// // console.log(u16);     // 255
// // console.log(buf);     // 255
// // console.log(buf.length); // 2
// // console.log(buf[0]);     // 255
// // console.log(buf[1]);     // 255

// const first = Buffer.copyBytesFrom(u16, 0, 1);
// const second = Buffer.copyBytesFrom(u16, 1, 1);
// const all = Buffer.copyBytesFrom(u16);

// console.log(first);  // <Buffer 00 00>
// console.log(second); // <Buffer ff ff>
// console.log(all);    // <Buffer 00 00 ff ff>