// const a = new ArrayBuffer(4);
// const uint8Array = new Uint8Array(a);

const a = new ArrayBuffer(4, { maxByteLength: 16 });
const uint8Array = new Uint8Array(a);

console.log(uint8Array);
a.resize(8);

uint8Array[0] = 0xfe;
uint8Array[1] = 0xee;
// uint8Array[2] = 0x3a;
// uint8Array[3] = 0x8a;

const b = a.transfer();
console.log(b);
console.log(a);
// const uint32Array = new Uint32Array(a);
// console.log(uint16Array);
// console.log(uint32Array);

// const uint8Array = new Uint8Array([0xfe, 0xee, 0x3a, 0x5a]);

// const uint8Array = new Uint8Array(1.9 * 1024 * 1024 * 1024).fill(0xff);

// setInterval(() => {
//   const a = [new Uint8Array(1.9 * 1024 * 1024 * 1024).fill(0xff)];
// }, 1000);
// console.log(uint8Array.buffer);
