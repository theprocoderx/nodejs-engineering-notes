import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

async function compressFile(inputPath, outputPath) {
  try {
    await pipeline(
      createReadStream(inputPath),
      createGzip(),
      createWriteStream(outputPath),
    );

    console.log("Compression completed successfully!");
  } catch (error) {
    console.error("Compression failed:", error.message);
  }
}

compressFile("input.txt", "input.txt.gz");
