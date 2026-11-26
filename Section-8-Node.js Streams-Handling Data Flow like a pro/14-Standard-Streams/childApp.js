import fs from "node:fs";

const readStream = fs.createReadStream("C:\\Users\\user\\Desktop\\streams.mp4");

readStream.pipe(process.stdout);

// const writeStream = fs.createWriteStream('output1.txt')

// process.stdin.on('data', (chunk) =>{
//   writeStream.write(chunk)
// })
// console.log('child App')
