import fs from 'fs/promises';

const a = await fs.readFile('C:\\Users\\user\\Desktop\\a.mp4');
const b = await fs.readFile('C:\\Users\\user\\Desktop\\b.mp4');
const c = await fs.readFile('C:\\Users\\user\\Desktop\\c.mp4');

const d = await fs.readFile('C:\\Users\\user\\Desktop\\a.mp4');
const e = await fs.readFile('C:\\Users\\user\\Desktop\\b.mp4');
const f = await fs.readFile('C:\\Users\\user\\Desktop\\c.mp4');

const g = await fs.readFile('C:\\Users\\user\\Desktop\\a.mp4');
const h = await fs.readFile('C:\\Users\\user\\Desktop\\b.mp4');
const i = await fs.readFile('C:\\Users\\user\\Desktop\\c.mp4');

console.log(a.byteLength);
console.log(b.byteLength);
console.log(c.byteLength);
console.log(d.byteLength);
console.log(e.byteLength);
console.log(f.byteLength);
console.log(g.byteLength);
console.log(h.byteLength);
console.log(i.byteLength);

console.log('End');
