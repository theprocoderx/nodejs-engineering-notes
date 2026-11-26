import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt", {
  highWaterMark: 16,
});

let index = 0;

function writeData() {
  let canContinue = true;

  while (index < 100 && canContinue) {
    const data = `Line ${index + 1}\n`;

    canContinue = writableStream.write(data);

    index++;
  }

  if (index < 100) {
    console.log("Waiting for drain event...");
    writableStream.once("drain", writeData);
  } else {
    writableStream.end();
  }
}

writableStream.on("finish", () => {
  console.log("All data has been written!");
});

writableStream.on("error", (error) => {
  console.error("Write error:", error.message);
});

writeData();
