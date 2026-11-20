const a = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view = new DataView(a);

const b = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view1 = new DataView(b);

const c = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view2 = new DataView(c);

const d = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view3 = new DataView(d);

const e = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view4 = new DataView(e);

const f = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view5 = new DataView(f);

const g = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view6 = new DataView(g);

for (let i = 0; i < view.byteLength; i++) {
  view.setInt8(i, i + 1);
  view1.setInt8(i, i + 1);
  view2.setInt8(i, i + 1);
  view3.setInt8(i, i + 1);
  view4.setInt8(i, i + 1);
  view5.setInt8(i, i + 1);
  view6.setInt8(i, i + 1);
}
setInterval(() => {
  console.log('Running...');
}, 200);
console.log(a);
console.log('end');
