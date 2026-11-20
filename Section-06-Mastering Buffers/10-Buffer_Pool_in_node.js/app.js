import { Buffer} from 'buffer';

const p = Buffer.allocUnsafeSlow(4)
const q = Buffer.allocUnsafe(4)

console.log(p.buffer.byteLength)
console.log(q.buffer.byteLength)

// console.log(constants.MAX_LENGTH);
// console.log(constants.MAX_STRING_LENGTH);
// console.log(Number.MAX_SAFE_INTEGER);
// Buffer.poolSize = 81920;
// const a = Buffer.alloc(4);
// const z = Buffer.alloc(4);

// const joinBuffer = Buffer.concat([a, z]);

// const b = Buffer.allocUnsafe(4294967297);
// const c = Buffer.allocUnsafe(32767 - 416);

// const d = Buffer.from('a'.repeat(constants.MAX_STRING_LENGTH));
// console.log(d)
// b[2] = 99;

// c[0] = 103;
// console.log(a.byteLength);
// console.log(b.byteLength);

console.log('*************************');
// console.log(a.buffer.byteLength);
// console.log(b.buffer.byteLength);
// console.log(b.buffer === c.buffer);

console.log('End');
