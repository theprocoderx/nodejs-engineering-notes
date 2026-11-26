process.stdin.on("data", (chunk) => {
  console.log("Chunk type:", typeof chunk);
  console.log("Is Buffer:", Buffer.isBuffer(chunk));
  console.log("Chunk length:", chunk.length);
  console.log("Chunk content:", chunk);
});
