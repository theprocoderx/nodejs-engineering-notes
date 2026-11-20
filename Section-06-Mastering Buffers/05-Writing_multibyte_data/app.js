const a = new ArrayBuffer(4);
const view = new DataView(a);

// view.setInt8(0, 257);
// console.log(view.getInt8(0));

// view.setInt16(0, 260);
// view.setInt16(2, 260, true)
// console.log(view.getInt16(0));
// console.log(view.getInt16(2));
// console.log(a)
// view.setInt8(0, 0x7823e324);
// view.setInt16(0, 0x7823e324);

view.setInt32(0, 0x7823e324, true);

console.log(view.getInt32(0, true));
console.log(a);
