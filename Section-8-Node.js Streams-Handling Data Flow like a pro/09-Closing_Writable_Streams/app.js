import fs from 'fs';

const writeStream = fs.createWriteStream('file.txt', { highWaterMark: 4 });

writeStream.write('a');
writeStream.write('a');
writeStream.write('a');
writeStream.write('a');
console.log(writeStream.writableLength);
writeStream.end('Hi, I am Magan Singh');
console.log(writeStream.writableLength);

// writeStream.write('bb') // writing after end method becomes cause of error
writeStream.on('open', (fd) => {
  console.log('fd = ', fd);
});
writeStream.on('finish', () => {
  console.log('finished');
});

writeStream.on('close', () =>{
  console.log('Close')
})