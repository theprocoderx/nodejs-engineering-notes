import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline as pipelinePromise } from "node:stream/promises";
import { pipeline as pipelineCallback } from "node:stream";

// Approach 1: Using pipe() with individual error listeners

function compressUsingPipe() {
  const readable = createReadStream("input.txt");
  const gzip = createGzip();
  const writable = createWriteStream("pipe-output.gz");

  readable.on("error", (error) => {
    console.error("Readable error:", error.message);
  });

  gzip.on("error", (error) => {
    console.error("Gzip error:", error.message);
  });

  writable.on("error", (error) => {
    console.error("Writable error:", error.message);
  });

  readable.pipe(gzip).pipe(writable);
  console.log(
    "Using .pipe() with individual error listener: Compression successful!",
  );
}

// Approach 2: Using Promise-based pipeline() with async/await

async function compressUsingPromise() {
  try {
    await pipelinePromise(
      createReadStream("input.txt"),
      createGzip(),
      createWriteStream("promise-output.gz"),
    );

    console.log("Promise: Compression successful!");
  } catch (error) {
    console.error("Promise: Pipeline failed:", error.message);
  }
}

// Approach 3: Using callback-based pipeline()

function compressUsingCallback() {
  pipelineCallback(
    createReadStream("input.txt"),
    createGzip(),
    createWriteStream("callback-output.gz"),
    (error) => {
      if (error) {
        console.error("Callback: Pipeline failed:", error.message);
        return;
      }

      console.log("Callback: Compression successful!");
    },
  );
}

// Run only one approach at a time while learning.

// compressUsingPipe();
// compressUsingPromise();
compressUsingCallback();
