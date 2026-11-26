import fs from "node:fs";

const readableStream = fs.createReadStream("chars.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

readableStream.on("end", () => {
  console.log("Reading completed!");
});

readableStream.on("error", (error) => {
  console.error(error.message);
});
