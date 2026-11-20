import fs from 'fs';
import { pipeline } from 'stream';

console.time('Copy Time');

const readStream = fs.createReadStream(
  'C:\\Users\\user\\Desktop\\streams.mp4',
  { highWaterMark: 1 * 1024 * 1024 }
);
const writeStream = fs.createWriteStream('streams.mp4');

pipeline(readStream, writeStream, (err) => {
  console.log(err);
});

// readStream.pipe(writeStream);
// Errors ko handle karna zaroori hai
// readStream.on('error', (err) => {
//   console.error('Read error:', err);
// });


// setTimeout(() => {
//   readStream.destroy('khatam');
// }, 1000);

// setInterval(() => {
//   console.log('Hii');
// }, 200);

// readStream.on('data', (chunk) => {
//   const isEmpty = writeStream.write(chunk);
//   if (!isEmpty) {
//     readStream.pause();
//   }
// });

// writeStream.on('drain', () => {
//   readStream.resume();
// });

// Jab read poora ho jaye, tab write stream ko end karein
readStream.on('end', () => {
  writeStream.end();
});

// Jab file disk par poori tarah write aur save ho jaye ('finish' event)
writeStream.on('finish', () => {
  console.timeEnd('Copy Time');
  console.log('File successfully copy ho gayi hai!');
});

// writeStream.on('error', (err) => {
//   console.error('Write error:', err);
// });
