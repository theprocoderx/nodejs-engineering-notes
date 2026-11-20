import fs from 'fs';

const writeStream = fs.createWriteStream('file.txt', { highWaterMark: 4 });

// Writable State
// writeStream.write('hii');
// console.log(writeStream.writable);
// writeStream.end();
// console.log(writeStream.writable);

// Corked State

console.log(writeStream.writableCorked);
writeStream.cork();
writeStream.cork();
writeStream.cork();
writeStream.cork();

writeStream.write('hii');
writeStream.write('hii');
writeStream.write('hii');
writeStream.write('hii');

writeStream.end();
console.log(writeStream.writableEnded);
console.log(writeStream.writableLength);
// console.log(writeStream.destroy());

setTimeout(() => {
  console.log(writeStream.writableFinished);
  console.log(writeStream.writableLength);
}, 10);

console.log(writeStream.writableCorked);
writeStream.uncork();
writeStream.uncork();
writeStream.uncork();
writeStream.uncork();
