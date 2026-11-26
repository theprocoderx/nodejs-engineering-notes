process.stdin.setEncoding("utf8");

console.log("Enter some data:");

process.stdin.on("data", (chunk) => {
  console.log("Received:", JSON.stringify(chunk));

  process.stdin.pause();

  console.log("Input paused.");

  setTimeout(() => {
    console.log("Resuming input...");
    process.stdin.resume();
  }, 3000);
});

process.stdin.on("end", () => {
  console.log("Input ended.");
});
