// import fsPromises from 'fs/promises';
import fs from 'fs';

setTimeout(() => {
  console.log('Hii...');
}, 0);

// Async I/O first method
// const fileContentAsync = await fsPromises.readFile('file.txt', 'utf-8');
// console.log(fileContentAsync);

// Async I/O second method
fs.readFile('file.txt', 'utf-8', (err, data) => {
  console.log(data);
});

// Sync I/O
// const fileContentSync = fs.readFileSync('file.txt', 'utf-8');
// console.log(fileContentSync);
