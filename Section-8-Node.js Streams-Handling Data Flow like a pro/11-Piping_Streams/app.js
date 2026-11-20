import fs from 'fs';

console.time('Copy Time');

const readStream = fs.createReadStream(
  'C:\\Users\\user\\Desktop\\streams.mp4',
  { highWaterMark: 1 * 1024 * 1024 }
);
const writeStream = fs.createWriteStream('streams.mp4');

readStream.pipe(writeStream);

setTimeout(() => {
  readStream.unpipe(writeStream);
}, 1000);

writeStream.on('unpipe')

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

// Errors ko handle karna zaroori hai
readStream.on('error', (err) => {
  console.error('Read error:', err);
});

writeStream.on('error', (err) => {
  console.error('Write error:', err);
});
