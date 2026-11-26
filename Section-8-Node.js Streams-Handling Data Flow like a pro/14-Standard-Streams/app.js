import fs from "node:fs";
import { spawn } from "node:child_process";

const childProcess = spawn("node", ["childApp.js"]);
const writeStream = fs.createWriteStream("abc.mp4");

childProcess.stdout.pipe(writeStream);

childProcess.stdin.write("Hello Node.js connect with data");
// const writableStream = fs.createWriteStream('output.txt');

// process.stdin.setEncoding("utf-8");
// process.stdin.on("data", (chunk) => {
//   writableStream.write(chunk)
// });

// process.stderr.write('what fault is comming')

// console.log(process.stdin.fd)
// console.log(process.stdout.fd)
// console.log(process.stderr.fd)

// Readable stream
// console.log(process.stdin)
// Writable stream
// console.log(process.stdout)
// console.log(process.stderr)
