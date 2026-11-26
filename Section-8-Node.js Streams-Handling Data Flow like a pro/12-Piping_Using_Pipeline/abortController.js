import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

const controller = new AbortController();

async function compressFile() {
  try {
    await pipeline(
      createReadStream("input.txt"),
      createGzip(),
      createWriteStream("input.txt.gz"),
      { signal: controller.signal },
    );

    console.log("Compression completed!");
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Compression was cancelled.");
    } else {
      console.error("Pipeline failed:", error.message);
    }
  }
}

compressFile();

// Cancel the pipeline when needed:
// controller.abort();
