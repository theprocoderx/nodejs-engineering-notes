import fs from 'fs';

const readStream = fs.createReadStream('chars.txt', {
  highWaterMark: 4,
  encoding: 'utf-8',

});
// readStream.setEncoding('utf-8');
// readStream.on('data', (chunk) => {
//   console.log(chunk);
//   readStream.destroy([]);
// });

// readStream.on('error', (err) => {
//   console.log({ err });
// });

// readStream.on('close', () => {
//   console.log('close');
// });

// readStream.on('end', () => {
//   console.log('End');
// });

// readStream.on('open', (data) => {
//   console.log('Open', data);
// });
// readStream.on('ready', (data) => {
//   console.log('ready', data);
// });
