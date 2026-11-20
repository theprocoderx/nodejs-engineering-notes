import fs from 'fs';

console.time('File Copy');

const readStream = fs.createReadStream('C:\\Users\\user\\Desktop\\e.mp4', {
  highWaterMark: 1 * 1024 * 1024,
});
console.log(readStream.readableHighWaterMark);
const writeStream = fs.createWriteStream('streams.mp4');
console.log(writeStream.writableHighWaterMark);
readStream.on('data', (chunkBuffer) => {
  // time =  50 seconds
  // memory =  50MB
  // CPU = 5%
  // fs.appendFileSync('e.mp4', chunkBuffer);
  // ================== with write Stream =========
  // time =  10 seconds
  // memory =  1.5-2.0 GB
  // CPU = 15%

  // ============ time after handling backpressure
  // time =  8 seconds
  // memory =  60 MB
  // CPU = 5%
  let isEmpty = writeStream.write(chunkBuffer);
  if (!isEmpty) {
    readStream.pause();
  }
});
writeStream.on('drain', () => {
  readStream.resume();
});

readStream.on('end', () => {
  console.timeEnd('File Copy');
});
