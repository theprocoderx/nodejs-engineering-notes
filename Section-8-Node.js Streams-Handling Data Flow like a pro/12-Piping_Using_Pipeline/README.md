# pipeline() in Node.js Streams

You have already learned how `.pipe()` connects Readable, Transform, and Writable Streams.
For example:

```js
readableStream.pipe(transformStream).pipe(writableStream);
```

This works, but there is an important production-level concern: `.pipe()` does not automatically provide complete error handling across the entire stream chain.
Node.js provides `pipeline()` to address this problem.

In this lesson, we will cover:

1. What is `pipeline()`?
2. How `.pipe()` differs from `pipeline()`.
3. Understanding error propagation.
4. Backpressure management.
5. Using `pipeline()` with callbacks and Promises.
6. Building a practical file-processing pipeline.
7. Why `pipeline()` is preferred in production.

---

## 1. What is `pipeline()`?

`pipeline()` is a utility provided by Node.js's `node:stream` module.
It connects multiple streams into a single processing pipeline and handles important stream lifecycle concerns, including:

- Backpressure management.
- Error propagation across connected streams.
- Stream cleanup and destruction when the pipeline fails.
- Completion notification.

Think of a pipeline as a sequence of processing stages:

```text
+-----------------+      +-----------------+      +------------------+
| Readable Stream | ---> | Transform Stream| ---> | Writable Stream  |
| Reads input.txt |      | Compresses data |      | Writes           |
|                 |      | using           |      | input.txt.gz     |
|                 |      | createGzip()    |      |                  |
+-----------------+      +-----------------+      +------------------+
```

Instead of manually managing each stream's lifecycle, `pipeline()` coordinates the complete chain.

### Importing `pipeline()`

Node.js provides two commonly used interfaces.

Callback-based API:

```js
import { pipeline } from "node:stream";
```

Promise-based API:

```js
import { pipeline } from "node:stream/promises";
```

For modern asynchronous JavaScript applications, I recommend learning the Promise-based API first because it integrates naturally with `async/await`.

---

## 2. `.pipe()` vs. `pipeline()`

Both connect streams, but they have different responsibilities.

### A. Using `.pipe()`

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";

const readable = createReadStream("input.txt");
const gzip = createGzip();
const writable = createWriteStream("input.txt.gz");

readable.pipe(gzip).pipe(writable);
```

This connects three streams:

1. Readable Stream reads the source file.
2. Gzip Transform Stream compresses incoming chunks.
3. Writable Stream writes the compressed output.

`.pipe()` manages backpressure between connected streams.
However, it does not automatically destroy every stream in the chain when an error occurs.
For example, if the Gzip stream encounters an error, you need to consider how the other streams are cleaned up and how the application is notified.

### B. Using `pipeline()`

The same operation using `pipeline()`:

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

async function compressFile() {
  try {
    await pipeline(
      createReadStream("input.txt"),
      createGzip(),
      createWriteStream("input.txt.gz"),
    );

    console.log("Compression completed!");
  } catch (error) {
    console.error("Pipeline failed:", error.message);
  }
}

compressFile();
```

Notice the difference:

```js
await pipeline(readable, transform, writable);
```

We do not need to attach separate error handlers to every stream just to detect pipeline failure.
If a stream fails, the Promise rejects, and the `catch` block handles the error.

### Comparison

| Feature                              | `.pipe()`         | `pipeline()`        |
| :----------------------------------- | :---------------- | :------------------ |
| Connects streams                     | Yes               | Yes                 |
| Handles backpressure                 | Yes               | Yes                 |
| Propagates errors across the chain   | Not automatically | Yes                 |
| Coordinates cleanup on failure       | Not automatically | Yes                 |
| Completion notification              | Stream events     | Callback or Promise |
| Supports async/await directly        | No                | Yes, Promise API    |
| Recommended for production pipelines | Usually not alone | Yes                 |

Important distinction: `.pipe()` is not bad or deprecated. It is useful for simple stream connections. `pipeline()` is generally the better choice when you need reliable error handling and lifecycle management across multiple streams.

---

## 3. Understanding Error Propagation

This is one of the most important reasons to use `pipeline()`.
Imagine this stream chain:

```text
Readable -> Transform -> Writable
```

Suppose the Transform Stream encounters an error while processing data.
What should happen?
Ideally:

1. The error should be detected.
2. The pipeline should stop processing.
3. Connected streams should be destroyed as appropriate.
4. The application should receive the error.
5. The application should handle the failure.

### A. Error handling with `.pipe()`

Consider:

```js
readable.pipe(transform).pipe(writable);
```

A common misunderstanding is that an error emitted by any stream automatically propagates through every `.pipe()` connection.
It does not.
For example:

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";

const readable = createReadStream("input.txt");
const gzip = createGzip();
const writable = createWriteStream("input.txt.gz");

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
```

Here, we attach error listeners individually.
This detects errors, but it does not provide complete coordinated cleanup. For example, an error in one stream does not automatically guarantee that all the other streams are destroyed.
You would need additional lifecycle management.

### B. Error handling with `pipeline()`

Now compare that with:

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

async function compressFile() {
  try {
    await pipeline(
      createReadStream("input.txt"),
      createGzip(),
      createWriteStream("input.txt.gz"),
    );

    console.log("Compression successful!");
  } catch (error) {
    console.error("Pipeline error:", error.message);
  }
}

compressFile();
```

If an error occurs in any participating stream:

- The pipeline reports the error through its rejected Promise.
- The participating streams are destroyed as appropriate.
- The `catch` block receives the failure.

This centralizes error handling instead of requiring separate error-management logic for every stream.

Production principle: Handle pipeline failures at the pipeline boundary, while still handling any application-specific cleanup or recovery that your application requires.

---

## 4. Understanding Backpressure in `pipeline()`

You already learned about backpressure in Writable Streams.
Let's briefly connect that concept to a complete pipeline.
Suppose:

- The Readable Stream produces 10 MB of data per second.
- The Transform Stream processes 5 MB per second.
- The Writable Stream writes 2 MB per second.

The producer is faster than the consumer.
Without backpressure, data can accumulate in buffers, increasing memory consumption.

### How backpressure works

```text
Readable ---> Transform ---> Writable
  Fast          Medium         Slow
    |              |             |
    +--- Backpressure <----------+
```

The Writable Stream signals when its buffer has reached the `highWaterMark` threshold.
That pressure is propagated upstream through the stream chain. The upstream streams slow down until downstream capacity becomes available.

Both `.pipe()` and `pipeline()` support backpressure.
The important distinction is that `pipeline()` also coordinates errors and cleanup.

Remember: `pipeline()` does not make processing faster or eliminate buffering. It helps streams process data at a manageable rate without uncontrolled memory growth.

---

## 5. Using the Callback-Based `pipeline()`

So far, we have used the Promise-based API.
Node.js also provides a callback-based API through `node:stream`.

### Syntax

```js
pipeline(source, ...transforms, destination, callback);
```

The callback receives an error argument:

```js
callback(error);
```

- `error` is `null` when the pipeline completes successfully.
- `error` contains the failure when the pipeline fails.

### Example

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream";

pipeline(
  createReadStream("input.txt"),
  createGzip(),
  createWriteStream("input.txt.gz"),
  (error) => {
    if (error) {
      console.error("Pipeline failed:", error.message);
      return;
    }

    console.log("Compression completed!");
  },
);
```

### Callback vs. Promise API

| Callback API                   | Promise API                           |
| :----------------------------- | :------------------------------------ |
| `node:stream`                  | `node:stream/promises`                |
| Uses a callback                | Uses `async/await` and `try...catch`  |
| Traditional asynchronous style | Modern asynchronous style             |
| Completion through callback    | Completion through Promise settlement |

For new Node.js applications, the Promise-based API is usually easier to compose with other asynchronous operations.

---

## 6. Practical Example: Building a File Compression Pipeline

Let's create a small project that demonstrates the production-style approach.

### Project structure

```text
pipeline-demo/
├── input.txt
├── compress.js
└── decompress.js
```

### Step 1: Compress a file

Create `compress.js`:

```js
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
```

### Step 2: Decompress a file

Create `decompress.js`:

```js
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
```

### Step 3: Execute the programs

```bash
node compress.js
node decompress.js
```

Compare the original and restored files:

```bash
fc /b input.txt restored.txt
```

If the files are identical, the comparison will report no differences.

### Step 4: Understand what happens when an error occurs

Try these scenarios:

| Test                            | Expected behavior                        |
| :------------------------------ | :--------------------------------------- |
| `input.txt` does not exist      | Readable stream fails; pipeline rejects  |
| Output directory does not exist | Writable stream fails; pipeline rejects  |
| Input is not valid Gzip data    | `createGunzip()` fails; pipeline rejects |
| All streams work correctly      | Pipeline resolves successfully           |

An important production consideration: a failed pipeline can leave a partially written output file. `pipeline()` handles stream cleanup, but it does not automatically remove every partially created file.
If partial files must never be treated as valid output, write to a temporary file first, then rename it after successful completion. Also consider cleanup of temporary files when processing fails.

---

## 7. Advanced: Cancelling a Pipeline with `AbortController`

Sometimes you need to stop stream processing before it finishes.
For example:

- A user cancels a large file upload.
- A server shuts down.
- A processing job exceeds its time limit.
- An application no longer needs the result.

The Promise-based `pipeline()` supports an `AbortSignal`.

### Example

```js
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
```

`controller.abort()` signals cancellation. The pipeline destroys its participating streams and rejects with an abort-related error.
The commented line is intentionally not executed automatically. In a real application, cancellation would be triggered by an actual event, such as a user's cancellation request.

---

## 8. Important Production Considerations

Keep these points in mind when using `pipeline()` in real applications.

1. Prefer `pipeline()` for multi-stream processing.
   It centralizes stream error handling, backpressure coordination, and cleanup.
2. Do not ignore rejected Promises.
   Always handle pipeline failures using `try...catch` or an appropriate Promise rejection handler.
3. Understand partial output files.
   A failed pipeline may leave an incomplete output file. Use temporary files and rename only after success when atomic publication of output is important.
4. Understand stream ownership.
   `pipeline()` may destroy streams when an error occurs or when cancellation is requested. Be careful when using streams that are shared or needed elsewhere.
5. Use `AbortSignal` when cancellation is required.
   This is useful for long-running processing tasks and user-controlled operations.
6. Avoid assuming success means permanent storage.
   A completed Writable Stream means its writes have finished from the stream's perspective. It does not necessarily guarantee physical persistence to storage hardware.

---

## 9. Quick Revision

| Concept           | Explanation                                                                   |
| :---------------- | :---------------------------------------------------------------------------- |
| `.pipe()`         | Connects a readable stream to a writable stream                               |
| `pipeline()`      | Connects streams and coordinates the entire pipeline                          |
| Backpressure      | Prevents uncontrolled buffering when streams process data at different speeds |
| Error propagation | Reports failures from participating streams                                   |
| Cleanup           | Destroys participating streams as appropriate on failure                      |
| Callback API      | Uses a completion callback                                                    |
| Promise API       | Uses `async/await` and `try...catch`                                          |
| `AbortController` | Allows cancellation using an `AbortSignal`                                    |

The key takeaway: `.pipe()` is a stream-connection method; `pipeline()` is a higher-level utility for managing a complete stream-processing operation.
