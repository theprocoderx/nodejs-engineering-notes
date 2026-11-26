process.stdin.setEncoding("utf8");

console.log("Enter something:");

process.stdin.on("data", (chunk) => {
  console.log("Received:", chunk);
});

process.stdin.on("end", () => {
  console.log("Input stream ended.");
});
