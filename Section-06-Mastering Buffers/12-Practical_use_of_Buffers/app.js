import fs from 'fs/promises';

const a = await fs.readFile('C:\\Users\\user\\Desktop\\procodrr.png');

console.log(a.byteLength);
