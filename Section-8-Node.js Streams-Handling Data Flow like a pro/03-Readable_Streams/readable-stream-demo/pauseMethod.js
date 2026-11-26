import fs from 'node:fs';

const readableStream = fs.createReadStream('chars.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());

  readableStream.pause();

  console.log('Stream paused!');
});