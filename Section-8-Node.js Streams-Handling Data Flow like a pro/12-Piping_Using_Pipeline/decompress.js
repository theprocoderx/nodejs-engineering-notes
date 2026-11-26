import { createReadStream, createWriteStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

async function decompressFile(inputPath, outputPath) {
  try {
    await pipeline(
      createReadStream(inputPath),
      createGunzip(),
      createWriteStream(outputPath),
    );

    console.log("Decompression completed successfully!");
  } catch (error) {
    console.error("Decompression failed:", error.message);
  }
}

decompressFile("input.txt.gz", "restored.txt");
