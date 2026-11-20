import fs from 'fs';

const readStream = fs.createReadStream('chars.txt', { highWaterMark: 4 });
// let readCount = 0;

readStream.on('data', (chunk) => {
  const { readableHighWaterMark, bytesRead } = readStream;
  // readCount++;
  // console.log(readStream.bytesRead);
  // console.log(readStream.readableHighWaterMark)
  if (readableHighWaterMark === bytesRead) {
    fs.writeFileSync('abc.txt', chunk);
  } else {
    fs.appendFileSync('abc.txt', chunk);
    // readStream.pause();
    // setTimeout(() => {
    //   readStream.resume();
    // }, 1000);
  }
});

readStream.on('pause', () => {
  console.log('Stream Pause');
});

readStream.on('resume', () => {
  console.log('Stream resume');
});
