import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Enter something (type exit to finish):");

rl.on("line", (input) => {
  if (input.trim().toLowerCase() === "exit") {
    rl.close();
    return;
  }

  console.log("Received:", input);
});

rl.on("close", () => {
  console.log("Input interface closed.");
});
