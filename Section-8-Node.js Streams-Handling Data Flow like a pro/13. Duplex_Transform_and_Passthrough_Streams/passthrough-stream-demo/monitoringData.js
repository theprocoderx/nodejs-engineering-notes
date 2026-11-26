import { PassThrough } from "node:stream";

const monitor = new PassThrough();

let totalBytes = 0;

monitor.on("data", (chunk) => {
  totalBytes += chunk.length;
});

monitor.on("end", () => {
  console.log(`Total bytes processed: ${totalBytes}`);
});

monitor.write("Hello ");
monitor.write("Node.js!");
monitor.end();
