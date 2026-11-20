import { readFile, writeFile, appendFile } from 'node:fs/promises';

try {
  const contentBuffer = await readFile('./moneyyy.png');
  writeFile('C:\\Users\\user\\Desktop\\abc.png', contentBuffer);
} catch (error) {
  appendFile(
    'Error log',
    `${new Date().toLocaleTimeString()} \n${error.message} \n${error.stack}\n\n`
  );
}

// const contentBuffer = await readFile('C:\\Users\\user\\Desktop\\file1.txt');

// console.log(contentBuffer)

// writeFile('file1.txt', contentBuffer);
// appendFile('file1.txt', '\nand I am node js developer.');

// const contentBuffer = await readFile('./money.png');
// console.log(contentBuffer);

// writeFile('C:\\Users\\user\\Desktop\\buffer.png', contentBuffer);

// setInterval(() => {
//   writeFile('./file1.txt', new Date().toLocaleTimeString());
// }, 500);
