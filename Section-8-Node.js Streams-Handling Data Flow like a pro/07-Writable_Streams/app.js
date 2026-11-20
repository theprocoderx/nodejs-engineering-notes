import fs from 'node:fs';

console.time();

const readStream = fs.createReadStream('C:\\Users\\user\\Desktop\\e.mp4', {
  highWaterMark: 1 * 1024 * 1024,
});

const writeStream = fs.createWriteStream('streams.mp4');
// console.log(writeStream.writableHighWaterMark);
readStream.on('data', (chunkBuffer) => {
  // time =  50 seconds
  // memory =  50MB
  // CPU = 5%
  // fs.appendFileSync('e.mp4', chunkBuffer);
  
  // ================== with write Stream =========
  // time =  10 seconds
  // memory =  1.5-2.0 GB
  // CPU = 15%
  writeStream.write(chunkBuffer);
});
readStream.on('end', () => {
  console.timeEnd();
});
