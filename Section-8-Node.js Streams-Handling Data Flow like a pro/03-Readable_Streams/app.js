// import fs from 'fs/promises';
import fs from 'fs';

// const fileBuff = await fs.readFile('chars.txt');
console.time();
// time = 15 seconds
// memory = 1860 MB
// CPU = 15%

// const fileBuff = await fs.readFile('C:\\Users\\user\\Desktop\\c.mp4');
// await fs.writeFile('c.mp4', fileBuff);

let readCount1 = 0;
const readStream = fs.createReadStream('C:\\Users\\user\\Desktop\\e.mp4', {
  highWaterMark: 1 * 1024 * 1024,
});

readStream.on('data', (chunkBuffer) => {
  fs.appendFileSync('e.mp4', chunkBuffer);
  // console.log(chunkBuffer);
  // console.log(chunkBuffer.byteLength);
  readCount1++;
});
readStream.on('end', () => {
  console.timeEnd();
  console.log(readCount1);
});
// const fileBuff1 = await fs.readFile('C:\\Users\\user\\Desktop\\e.mp4');
// console.log(fileBuff.byteLength);
// console.log(fileBuff1.byteLength);
// console.log(fileBuff.toString())

// const readStream = fs.createReadStream('chars.txt', {
//   highWaterMark: 16,
// });

// let readCount2 = 0;
// readStream.on('data', (chunk) => {
//   console.log(chunk.byteLength);
//   readCount2++;
// });

// readStream.on('end', () => {
//   console.log(readCount2);
// });
