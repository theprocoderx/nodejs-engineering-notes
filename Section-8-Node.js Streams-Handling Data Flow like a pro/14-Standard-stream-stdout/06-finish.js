import fs from "node:fs";

const writable = fs.createWriteStream("output.txt");

writable.write("Hello Node.js\n");

writable.end();

writable.on("finish", () => {
  console.log("All writes completed.");
});
