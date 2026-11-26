// test-drain.js
import fs from "node:fs";
import { once } from "node:events";

const ws = fs.createWriteStream("big-test.txt", { highWaterMark: 16384 }); // 16 KB
const chunk = "A".repeat(4096); // 4 KB
let falseCount = 0;

for (let i = 0; i < 200; i++) {
  const canContinue = ws.write(chunk);
  if (!canContinue) {
    falseCount++;
    console.log(
      `#${i}: write() -> false | writableLength=${ws.writableLength} | needDrain=${ws.writableNeedDrain}`,
    );
    await once(ws, "drain");
    console.log(`#${i}: 'drain' fired! writableLength=${ws.writableLength}`);
  }
}

ws.end();
await once(ws, "finish");
console.log("Total false returns:", falseCount);
