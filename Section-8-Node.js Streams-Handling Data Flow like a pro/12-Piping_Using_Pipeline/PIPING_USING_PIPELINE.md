# Piping Streams and `pipeline()` in Node.js

## Overview

Piping connects a readable stream to a writable stream so that data can flow from one stream to another without manually handling every `data` and `write()` event.

Node.js provides two commonly used APIs for connecting streams:

- `readable.pipe(writable)` — The basic stream piping API.
- `pipeline(...streams)` — A higher-level API that provides coordinated error handling and cleanup.

## 1. What Is Stream Piping?

Stream piping means connecting the output of a readable stream to the input of a writable stream.

For example, a file can be read and its contents can be written to another file:

```js
import { createReadStream, createWriteStream } from 'node:fs';

const readable = createReadStream('source.txt');
const writable = createWriteStream('destination.txt');

readable.pipe(writable);
```

### Data Flow

```text
source.txt
    |
    v
Readable Stream
    |
    | pipe()
    v
Writable Stream
    |
    v
destination.txt
```

The `.pipe()` method manages the flow of data between streams and handles backpressure.

When the destination cannot accept data as quickly as the source produces it, piping pauses the readable stream and resumes it when the destination is ready.

## 2. The `readable.pipe()` Method

### Syntax

```js
readable.pipe(destination[, options])
```

**Parameters:**

- `destination`: A writable stream that receives data from the readable stream.
- `options`: Optional configuration. The `end` option defaults to `true`.

By default, when the readable stream ends, `.pipe()` calls `end()` on the destination writable stream.

### Example

```js
import { createReadStream, createWriteStream } from 'node:fs';

const source = createReadStream('input.txt');
const destination = createWriteStream('output.txt');

source.pipe(destination);

destination.on('finish', () => {
  console.log('File copied successfully.');
});
```

The `finish` event indicates that the writable stream has completed processing all data that was written to it.

### Preventing the Destination from Ending

Pass `{ end: false }` when the destination should remain open after the readable stream ends:

```js
source.pipe(destination, { end: false });
```

This can be useful when multiple readable streams are being piped into the same writable stream.

The application must then end the destination when all input streams have finished.

## 3. Piping Through Multiple Streams

A readable stream can be connected to multiple processing streams in sequence.

For example:

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const source = createReadStream('input.txt');
const gzip = createGzip();
const destination = createWriteStream('input.txt.gz');

source.pipe(gzip).pipe(destination);
```

### Data Flow

```text
input.txt
    |
    v
Readable Stream
    |
    v
Gzip Transform Stream
    |
    v
Writable Stream
    |
    v
input.txt.gz
```

The `createGzip()` method returns a Transform Stream. It receives input data, compresses it, and passes the compressed data to the next stream.

## 4. Limitations of `.pipe()`

Although `.pipe()` is useful, manually chaining streams requires care when errors occur.

For example:

```js
source.pipe(gzip).pipe(destination);
```

An error in one stream does not automatically provide complete error handling and cleanup for every stream in the chain.

Attaching an error listener only to the final destination is not sufficient.

For reliable stream processing, Node.js provides the `pipeline()` API.

## 5. What Is `pipeline()`?

`pipeline()` is a utility from the `node:stream` module that connects multiple streams and coordinates their lifecycle.

It provides:

- Connects streams in the specified order.
- Handles backpressure.
- Propagates errors through the pipeline.
- Destroys connected streams when an error occurs.
- Calls the completion callback when the pipeline finishes or fails.

### Callback-Based Syntax

```js
import { pipeline } from 'node:stream';

pipeline(source, transform, destination, (error) => {
  if (error) {
    console.error('Pipeline failed:', error);
    return;
  }

  console.log('Pipeline completed successfully.');
});
```

The callback receives an error if the pipeline fails. If it completes successfully, the error argument is `null`.

## 6. Practical Example: Compressing a File with `pipeline()`

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const source = createReadStream('input.txt');
const gzip = createGzip();
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (error) => {
  if (error) {
    console.error('Compression failed:', error);
    return;
  }

  console.log('File compressed successfully.');
});
```

### How It Works

1. `createReadStream()` reads the source file.
2. `createGzip()` compresses the incoming data.
3. `createWriteStream()` writes the compressed data to the destination file.
4. `pipeline()` connects the streams and coordinates errors and cleanup.
5. The callback runs after completion or failure.

## 7. Using `pipeline()` with Promises

Node.js also provides a promise-based version of `pipeline()` through `node:stream/promises`.

This approach works naturally with `async/await`.

### Example

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function compressFile() {
  try {
    await pipeline(
      createReadStream('input.txt'),
      createGzip(),
      createWriteStream('input.txt.gz')
    );

    console.log('File compressed successfully.');
  } catch (error) {
    console.error('Compression failed:', error);
  }
}

compressFile();
```

The Promise resolves when the pipeline completes successfully and rejects if an error occurs.

For most modern application code, the promise-based API is a convenient choice when working inside asynchronous functions.

## 8. `.pipe()` vs. `pipeline()`

| Feature             | `.pipe()`                                   | `pipeline()`                           |
| ------------------- | ------------------------------------------- | -------------------------------------- |
| API                 | Method on a readable stream                 | Utility function                       |
| Connecting streams  | Connects a readable stream to a destination | Connects two or more streams           |
| Backpressure        | Handles backpressure                        | Handles backpressure                   |
| Error propagation   | Requires careful manual error handling      | Coordinates errors across the pipeline |
| Cleanup on failure  | Must be managed carefully                   | Destroys connected streams on failure  |
| Completion handling | Listen for relevant stream events           | Callback or returned Promise           |
| Typical use         | Simple stream connections                   | Robust stream processing               |

## 9. Best Practices

- Prefer `pipeline()` for production stream chains, especially when several streams are connected.
- Handle errors explicitly. Do not assume that `.pipe()` alone handles every error case.
- Use `node:stream/promises` when `async/await` makes the surrounding code easier to understand.
- Avoid reading an entire large file into memory when a streaming solution is appropriate.
- Remember that backpressure is important: it prevents a fast readable stream from overwhelming a slower writable stream.
- Use the `finish` event to observe successful completion of a writable stream when working directly with stream events. When using `pipeline()`, use its callback or returned Promise to observe completion.

## Key Takeaways

- Piping connects streams so data flows from a source to a destination.
- `.pipe()` is a readable-stream method and supports backpressure.
- Chaining `.pipe()` calls is convenient, but error handling and cleanup require additional care.
- `pipeline()` coordinates stream completion, error propagation, and cleanup.
- The promise-based `pipeline()` API is useful with `async/await`.
