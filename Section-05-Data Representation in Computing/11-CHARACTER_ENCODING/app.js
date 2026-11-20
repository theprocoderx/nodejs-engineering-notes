import { readFile } from 'fs';
import fs from 'fs/promises';

const contentBuffer = await fs.readFile('./text.txt');

let binaryString = '';
contentBuffer.forEach((el) => {
  binaryString += el.toString('2') + ' ';
});
console.dir(binaryString);
console.log(binaryString);
