const a = new ArrayBuffer(4);
const view = new DataView(a);

view.setInt8(0, 0xff);
view.setInt8(1, 127);
view.setInt8(2, 128);
view.setInt8(3, 135);
// console.log(a)

// getInt8 reads value as signed
console.log(view.getInt8(0)); // -1
console.log(view.getInt8(1)); // 127
console.log(view.getInt8(2)); // -128
console.log(view.getInt8(3)); // -121

// getUint8 reads value as unsigned
console.log(view.getUint8(0)); // 255
console.log(view.getUint8(1)); // 127
console.log(view.getUint8(2)); // 128
console.log(view.getUint8(3)); // 135
