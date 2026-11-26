// consumer.js
let receivedBytes = 0;
let chunkCount = 0;
let pausedOnce = false;

for await (const chunk of process.stdin) {
  chunkCount++;
  receivedBytes += chunk.length;

  // Pehli chunk ke baad 1.5s ke liye stdin pause karo
  if (!pausedOnce) {
    pausedOnce = true;
    process.stdin.pause();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.stdin.resume();
  }
}

console.log(
  `[Consumer] Finished! Received ${chunkCount} chunks (${receivedBytes} bytes).`,
);
