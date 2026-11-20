# Piping Streams in Node.js

## 1. Introduction

Piping is a mechanism in Node.js that allows us to connect a Readable Stream to a Writable Stream.

It transfers data from the source stream to the destination stream without requiring us to manually read and write every chunk.

For example, when copying a large file, instead of reading the entire file into memory and then writing it to another file, we can use piping to transfer data chunk by chunk.

Node.js provides the `.pipe()` method for this purpose.

### Why do we need piping?

Piping is useful because it:

- Connects Readable and Writable Streams.
- Transfers data chunk by chunk.
- Automatically handles backpressure.
- Reduces unnecessary memory consumption.
- Makes stream processing easier to implement.

---

## 2. Understanding How Piping Works

Piping involves two main streams:

| Stream          | Responsibility            |
| --------------- | ------------------------- |
| Readable Stream | Produces data.            |
| Writable Stream | Receives and writes data. |

The Readable Stream acts as the source, while the Writable Stream acts as the destination.

### Basic flow

```text
    Readable Stream
          |
          | Data chunks
          v
     Writable Stream
          |
          v
      Destination
```

For example:

```text
     input.txt
         |
         v
  Readable Stream
         |
         v
  Writable Stream
         |
         v
    output.txt
```

The data is transferred incrementally instead of loading the entire file into memory.

---

## 3. The `pipe()` Method

The `pipe()` method connects a Readable Stream to a Writable Stream.

### Syntax

```js
readable.pipe(destination[, options]);
```

### Parameters

| Parameter     | Description                             |
| ------------- | --------------------------------------- |
| `destination` | The Writable Stream that receives data. |
| `options`     | Optional configuration object.          |

The `options` object supports the following property:

| Property | Description                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------- |
| `end`    | If `true`, calls `destination.end()` when the Readable Stream emits `end`. Defaults to `true`. |

### Return value

The `.pipe()` method returns the destination Writable Stream.

This allows us to chain multiple streams together.

---

## 4. Basic Example of Piping Streams

Let's create a Readable Stream and connect it to a Writable Stream.

```js
import { Readable, Writable } from 'node:stream';

const readable = Readable.from(['Hello ', 'Node.js ', 'Streams!']);

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log(`Received: ${chunk.toString()}`);
    callback();
  },
});

readable.pipe(writable);
```

### Expected Output

```text
Received: Hello
Received: Node.js
Received: Streams!
```

### How does it work?

1. `Readable.from()` creates a Readable Stream from an iterable.
2. `.pipe()` connects the Readable Stream to the Writable Stream.
3. The Readable Stream produces data chunks.
4. The Writable Stream receives each chunk through its `_write()` implementation.
5. The Writable Stream processes the chunks.

The `.pipe()` method manages the transfer automatically.

---

## 5. Piping Automatically Handles Backpressure

One of the most important features of `.pipe()` is automatic backpressure handling.

Consider a situation where:

- The Readable Stream produces data quickly.
- The Writable Stream processes data slowly.

Without backpressure management, the Writable Stream's internal buffer could grow excessively and consume unnecessary memory.

The `.pipe()` method handles this situation automatically.

### How does it work?

1. The Readable Stream sends a chunk to the Writable Stream.
2. The Writable Stream accepts the chunk through `write()`.
3. If `write()` returns `false`, the destination needs time to process its buffered data.
4. The Readable Stream pauses automatically.
5. When the Writable Stream emits `drain`, the Readable Stream resumes.

### Flow diagram

```text
      Readable Stream
             |
             v
       Writable.write()
             |
             v
       Returns false?
          /      \
        Yes       No
         |         |
         v         v
       Pause     Continue
         |
         v
   Wait for drain
         |
         v
       Resume
         |
         v
   Continue reading
```

**Important:** You do not need to manually implement `pause()` and `resume()` when using `.pipe()` for a standard Readable-to-Writable connection. It manages backpressure automatically.

---

## 6. Piping a File Using `fs.createReadStream()` and `fs.createWriteStream()`

A common real-world use case of piping is copying files.

Instead of reading an entire file into memory, we can connect a Readable Stream to a Writable Stream.

### Example

```js
import fs from 'node:fs';

const readable = fs.createReadStream('./input.txt');

const writable = fs.createWriteStream('./output.txt');

readable.pipe(writable);

writable.on('finish', () => {
  console.log('File copied successfully.');
});

readable.on('error', (error) => {
  console.error('Error reading file:', error.message);
});

writable.on('error', (error) => {
  console.error('Error writing file:', error.message);
});
```

### Expected Output

```text
File copied successfully.
```

### How does it work?

1. `createReadStream()` creates a Readable Stream for `input.txt`.
2. `createWriteStream()` creates a Writable Stream for `output.txt`.
3. `.pipe()` connects both streams.
4. Data is transferred chunk by chunk.
5. Backpressure is handled automatically.
6. When the source finishes reading, the destination is ended by default.
7. The destination emits `finish` after all submitted data has been processed.

**Important:** The example demonstrates basic piping and separate error listeners. For production stream pipelines, prefer `pipeline()` because it provides better error propagation and stream cleanup.

---

## 7. The `end` Option in `pipe()`

By default, when the Readable Stream emits the `end` event, `.pipe()` calls `end()` on the destination Writable Stream.

Sometimes, we may want to prevent the destination from ending automatically.

We can achieve this using the `end: false` option.

### Syntax

```js
readable.pipe(writable, { end: false });
```

### Example

```js
import { Readable, Writable } from 'node:stream';

const readable = Readable.from(['Hello ', 'Node.js']);

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

readable.pipe(writable, { end: false });

readable.on('end', () => {
  console.log('Readable stream ended');

  writable.end();
});

writable.on('finish', () => {
  console.log('Writable stream finished');
});
```

### Expected Output

```text
Hello
Node.js
Readable stream ended
Writable stream finished
```

### Why use `end: false`?

This option is useful when:

- We want to write additional data to the destination after the source ends.
- Multiple Readable Streams need to write to the same Writable Stream sequentially.
- We want to control when the destination is closed.

**Important:** If you use `end: false`, you are responsible for ending the destination when appropriate.

---

## 8. Chaining Multiple Streams

The `.pipe()` method returns the destination stream.

Because of this, we can chain multiple streams together.

### Example

```js
readable.pipe(transform).pipe(writable);
```

### Data flow

```text
   Readable Stream
          |
          v
   Transform Stream
          |
          v
   Writable Stream
```

In this pipeline:

1. The Readable Stream produces data.
2. The Transform Stream receives and modifies the data.
3. The Writable Stream receives the transformed data.

This approach is useful for tasks such as:

- Compressing files.
- Processing incoming data.
- Encrypting or decrypting data.
- Transforming file formats.

**Note:** Transform Streams are covered separately.

---

## 9. Unpiping a Stream

Node.js provides the `.unpipe()` method to disconnect a Readable Stream from its destination.

### Syntax

```js
readable.unpipe([destination]);
```

The `destination` parameter is optional.

| Usage                       | Description                            |
| --------------------------- | -------------------------------------- |
| `readable.unpipe(writable)` | Disconnects the specified destination. |
| `readable.unpipe()`         | Disconnects all destinations.          |

### Example

```js
import { Readable, Writable } from 'node:stream';

const readable = Readable.from(['Hello ', 'Node.js ', 'Streams!']);

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

readable.pipe(writable);

setTimeout(() => {
  readable.unpipe(writable);
  console.log('Streams disconnected');
}, 0);
```

**Note:** The exact output depends on when the scheduled callback executes relative to stream processing. This example demonstrates disconnection, not a guaranteed number of transferred chunks.

After unpiping, the Readable Stream is no longer connected to that destination. It does not automatically destroy either stream.

---

## 10. Important Limitation of `pipe()`

Although `.pipe()` automatically handles backpressure, it does not provide complete error handling across an entire stream chain.

For example:

```js
readable.pipe(writable);
```

If the Readable Stream encounters an error, `.pipe()` does not automatically forward that error to the destination.

Similarly, errors from the destination do not automatically provide complete cleanup of the source.

You must handle stream errors and cleanup carefully when using `.pipe()` directly.

For production applications, Node.js provides the `pipeline()` utility.

---

## 11. `pipe()` vs `pipeline()`

Both methods connect streams, but they have different responsibilities.

| Feature                                      | `pipe()`                     | `pipeline()`                       |
| -------------------------------------------- | ---------------------------- | ---------------------------------- |
| Connects streams                             | Yes                          | Yes                                |
| Handles backpressure                         | Yes                          | Yes                                |
| Error propagation                            | Requires manual handling     | Handles errors across the pipeline |
| Stream cleanup                               | Requires additional handling | Handles cleanup on errors          |
| Supports multiple streams                    | Yes, through chaining        | Yes                                |
| Recommended for complex production pipelines | Less suitable                | Yes                                |

### Example using `pipeline()`

Node.js provides a promise-based version through `node:stream/promises`.

```js
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

try {
  await pipeline(
    fs.createReadStream('./input.txt'),
    fs.createWriteStream('./output.txt')
  );

  console.log('File copied successfully.');
} catch (error) {
  console.error('Pipeline failed:', error.message);
}
```

### Why prefer `pipeline()`?

- Automatically manages backpressure.
- Propagates errors across the pipeline.
- Destroys connected streams when an error occurs.
- Provides a Promise-based API through `node:stream/promises`.

For most production stream-processing workflows, `pipeline()` is the preferred approach.

---

## 12. Key Takeaways

- Piping connects a Readable Stream to a Writable Stream.
- The `.pipe()` method transfers data chunk by chunk.
- `.pipe()` automatically handles backpressure.
- The default `end` option is `true`.
- Setting `{ end: false }` prevents automatic ending of the destination.
- `.pipe()` returns the destination stream, allowing chaining.
- `.unpipe()` disconnects a Readable Stream from its destination.
- `.pipe()` does not provide complete error propagation and cleanup.
- `pipeline()` is generally preferred for production stream processing.

---

## 13. Practical Exercises

### Exercise 1: Basic Piping

Create a Readable Stream using `Readable.from()` and pipe it into a Writable Stream.

Print every received chunk.

### Exercise 2: File Copy

Use `fs.createReadStream()` and `fs.createWriteStream()` to copy a large file using `.pipe()`.

Observe how data is transferred without loading the entire file into memory.

### Exercise 3: Disable Automatic Ending

Use `.pipe()` with `{ end: false }`.

After the Readable Stream ends, write an additional message to the destination and then call `end()` manually.

### Exercise 4: Unpipe a Destination

Connect a Readable Stream to a Writable Stream and disconnect them using `.unpipe()`.

Observe what happens to subsequent data.

### Exercise 5: Compare `pipe()` and `pipeline()`

Copy a file using both approaches.

Compare their error handling and cleanup behavior.

---

## 14. Official Node.js Documentation

- [Readable.pipe()](https://nodejs.org/api/stream.html#readablepipedestination-options)
- [Readable.unpipe()](https://nodejs.org/api/stream.html#readableunpipedestination)
- [Piping Streams](https://nodejs.org/api/stream.html#piping)
- [stream.pipeline()](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-options)
- [Promise-based Pipeline API](https://nodejs.org/api/stream.html#streampromisespipeline)
