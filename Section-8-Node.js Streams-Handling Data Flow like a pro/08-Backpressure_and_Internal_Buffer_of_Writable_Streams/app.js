import fs from 'fs';

const writeStream = fs.createWriteStream('file.txt', { highWaterMark: 4 });

// console.log(writeStream.writableHighWaterMark);

let i = 1;

writeStream.on('drain', () => {
  console.log('drain = ', writeStream.writableLength);
  write1000A();
});

write1000A();

function write1000A() {
  while (i <= 1000) {
    console.log(writeStream.writableLength);
    let isEmpty = writeStream.write('a');
    i++;
    if (!isEmpty) {
      break;
    }
    console.log(isEmpty);
  }
}
