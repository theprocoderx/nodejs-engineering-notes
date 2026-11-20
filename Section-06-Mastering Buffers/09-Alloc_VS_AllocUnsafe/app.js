import { Buffer } from 'buffer';

// const buffer1 = Buffer.alloc(10000);
// const buffer2 = Buffer.allocUnsafe(10000);

// // console.log(buffer1);
// // console.log(buffer2);

// console.log(buffer1.toString());
// console.log("=======")
// console.log(buffer2.toString());

console.time('Buffer.alloc');
for (let i = 0; i < 100000; i++) {
  const buffer = Buffer.alloc(1024); // 1 KB buffer
}
console.timeEnd('Buffer.alloc');

console.time('Buffer.allocUnsafe');
for (let i = 0; i < 100000; i++) {
  const buffer = Buffer.allocUnsafe(1024); // 1 KB buffer
}
console.timeEnd('Buffer.allocUnsafe');