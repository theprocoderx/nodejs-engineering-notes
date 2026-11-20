import fs from 'node:fs/promises';

console.log('start =>');
// ReadfileSync() Example

// const contentBuffer = fs.readFileSync('./index.html', 'utf-8');
// const content = contentBuffer.toString();
// console.log(content);

// const contentBuffer1 = fs.readFileSync('./NPX_searching_steps.txt', 'utf-8');
// const content1 = contentBuffer1.toString();
// console.log(content1);

// readFile() Example without promises

// fs.readFile('./index.html', (err, data) => {
//   const content2 = data.toString();
//   console.log(content2);
// });

// readFile() Example with Promises

console.time()
let i = 0;
const timerId = setInterval(() => {
  console.log(i++);
  if (i === 60) {
    clearInterval(timerId);
    console.timeEnd()
  }
}, 5);

const data = await fs.readFile('./NPX_searching_steps.txt', 'utf8');
console.log('Reading Done');
console.log('End!');
