import fs from 'fs';

console.time('File Copy');

const readStream = fs.createReadStream('C:\\Users\\user\\Desktop\\e.mp4', {
  highWaterMark: 1 * 1024 * 1024,
});

const writeStream = fs.createWriteStream('streams.mp4');

readStream.on('data', (chunkBuffer) => {
  // time =  50 seconds
  // memory =  50MB
  // CPU = 5%
  // fs.appendFileSync('e.mp4', chunkBuffer);
  // ================== with write Stream =========
  // time =  10 seconds
  // memory =  1.5-2.0 GB
  // CPU = 15%
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
