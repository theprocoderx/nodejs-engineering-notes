import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt");

writableStream.write("First line\n");
writableStream.write("Second line\n");
writableStream.write("Third line\n");

const canContinue = writableStream.write("Hello Node.js");

console.log(canContinue);

writableStream.end();

// The write() method returns:
// - true: The stream can continue accepting data without the producer needing to wait for the buffer to drain.
// - false: The buffering threshold has been reached or exceeded. You should stop writing temporarily and wait for the 'drain' event.
// Important: false does not mean writing failed. The chunk was accepted into the stream's buffer. It means the producer should respect backpressure.