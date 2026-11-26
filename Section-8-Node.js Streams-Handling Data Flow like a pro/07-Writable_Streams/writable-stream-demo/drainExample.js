import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt", {
  highWaterMark: 16,
});

const canContinue = writableStream.write("Hello, Node.js Streams!");

console.log("Can continue writing:", canContinue);

writableStream.on("drain", () => {
  console.log("Buffer is empty. Ready to continue.");
});

writableStream.end();
