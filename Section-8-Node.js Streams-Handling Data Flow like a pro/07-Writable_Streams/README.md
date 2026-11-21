# Writable Streams in Node.js

## 1. Introduction

A Writable Stream in Node.js is a type of stream that allows us to write data to a destination in chunks.

Instead of writing an entire file or sending all data at once, Writable Streams allow us to write data incrementally.

This makes them useful for handling large amounts of data efficiently without loading everything into memory.

Common examples of Writable Streams include:

- Writing data to files.
- Sending HTTP responses.
- Writing data to network sockets.
- Writing data to standard output (`stdout`).
- Compressing and writing data.

Node.js provides the `Writable` class through the built-in `node:stream` module.

---

## 2. Understanding Writable Streams

A Writable Stream represents a destination where data can be written.

For example, when writing data to a file, the Writable Stream receives chunks and writes them to the underlying file system.

### How It Works

1. Create a Writable Stream.
2. Pass data using the `write()` method.
3. Node.js processes the incoming chunks.
4. Call `end()` when no more data needs to be written.
5. The stream emits the `finish` event after all written data has been processed.

### Basic Syntax

```javascript
writableStream.write(data);
writableStream.end();
```

---

## 3. Creating a Writable Stream

Node.js provides multiple ways to create Writable Streams.

One common approach is using `fs.createWriteStream()` from the built-in File System module. You can also implement a custom in-memory Writable Stream directly with `new Writable({ write(chunk, encoding, callback) { ... } })`.

### Example (`fs.createWriteStream`)

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

writableStream.write('Hello ');
writableStream.write('Node.js ');
writableStream.write('Streams!');

writableStream.end();
```

**Output in `output.txt`:**

```text
Hello Node.js Streams!
```

### Example (Custom `Writable` Stream)

```javascript
import { Writable } from 'node:stream';

const memoryStream = new Writable({
  write(chunk, encoding, callback) {
    console.log('Chunk:', chunk.toString());
    callback();
  },
});

memoryStream.write('Hello ');
memoryStream.end('Writable!');
```

### Explanation

- `fs.createWriteStream()` creates a Writable Stream connected to a file.
- `write()` sends data to the stream.
- Multiple `write()` calls can be used to write multiple chunks.
- `end()` indicates that no more data will be written.
- Always attach an `'error'` listener—if a stream emits an `'error'` event with no listener attached, Node.js throws an uncaught exception.

**Important:** The write operations are asynchronous. Because opening a file is also asynchronous, `fs.createWriteStream` queues initial writes until the file descriptor is ready, and calling `end()` does not mean all data has already been physically flushed to disk.

---

## 4. Understanding the `write()` Method

The `write()` method is used to send data to a Writable Stream.

### Syntax

```javascript
writableStream.write(chunk[, encoding][, callback]);
```

### Parameters

| Parameter  | Description                                                                              |
| ---------- | ---------------------------------------------------------------------------------------- |
| `chunk`    | Data to write. Usually a string, Buffer, or Uint8Array (or any JS value in object mode). |
| `encoding` | Character encoding used when the chunk is a string (defaults to `'utf8'`).               |
| `callback` | Function called when the chunk has been handled by the stream.                           |

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

writableStream.write('Hello Node.js!', 'utf8', (error) => {
  if (error) {
    console.error('Write failed:', error);
    return;
  }

  console.log('Chunk written successfully');
});

writableStream.end();
```

**Important:**

The callback is invoked when the chunk has been handled by the Writable implementation. It does not necessarily mean that the data has been physically persisted to storage.

---

## 5. Understanding the `end()` Method

The `end()` method indicates that no more data will be written to the stream.

It signals the end of the writing process.

### Syntax

```javascript
writableStream.end([chunk][, encoding][, callback]);
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

writableStream.write('Hello ');

writableStream.write('Node.js ');

writableStream.end('Streams!');

writableStream.on('finish', () => {
  console.log('All data has been written');
});
```

**Output:**

```text
All data has been written
```

**Important:**

- `end()` prevents further writes.
- An optional final chunk can be passed directly to `end()`.
- The `finish` event is emitted after all written data has been processed by the stream.
- Calling `end()` is not the same as destroying the stream.

---

## 6. Understanding the Return Value of `write()`

The `write()` method returns a Boolean value.

| Return Value | Meaning                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------- |
| `true`       | The stream can continue accepting data without requiring the producer to wait for a `drain` event. |
| `false`      | The producer should stop writing temporarily and wait for the `drain` event.                       |

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt', {
  highWaterMark: 16,
});

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

const canContinue = writableStream.write('Hello Node.js Streams!');

console.log(canContinue);

writableStream.end();
```

The returned value depends on the amount of buffered data and the configured `highWaterMark`. If a single chunk is larger than `highWaterMark` (for example, 24 bytes against a `highWaterMark` of `16`), even the first `write()` can return `false`.

**Note:** Returning `false` does not mean that the chunk was rejected. The chunk has been accepted into the stream's buffering mechanism.

We will explore this behavior in detail in the Backpressure chapter.

---

## 7. Understanding Writable Stream Events

Writable Streams emit events that help us monitor the writing process.

| Event    | Description                                                                                |
| -------- | ------------------------------------------------------------------------------------------ |
| `drain`  | Emitted when the internal buffer has become available for more writing after backpressure. |
| `finish` | Emitted after `end()` has been called and all data has been processed.                     |
| `error`  | Emitted when an error occurs during writing.                                               |
| `close`  | Emitted when the stream and its underlying resources have been closed.                     |
| `pipe`   | Emitted on the Writable stream when a Readable stream is piped into it via `pipe()`.       |

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('finish', () => {
  console.log('Writing completed');
});

writableStream.on('close', () => {
  console.log('Stream closed');
});

writableStream.on('error', (error) => {
  console.error('Stream error:', error.message);
});

writableStream.write('Hello Node.js Streams!');

writableStream.end();
```

**Expected output:**

```text
Writing completed
Stream closed
```

**Note:** The `close` event is not equivalent to `finish`. A stream can finish writing without necessarily emitting `close` in every implementation.

---

## 8. Understanding `highWaterMark`

The `highWaterMark` option specifies the threshold at which a Writable Stream starts applying backpressure.

It does not represent a strict maximum buffer size.

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt', {
  highWaterMark: 16,
});

console.log(writableStream.writableHighWaterMark);

writableStream.end();
```

**Output:**

```text
16
```

### Important Points

- Default `highWaterMark` is `65536` bytes (64 KiB) for byte streams on most platforms (16 KiB on Windows), and `16` for `objectMode: true`.
- In byte mode, `highWaterMark` is measured in **bytes**, not string character count (`str.length`)—multi-byte UTF-8 characters or emojis take multiple bytes.
- In object mode, it is measured in objects.
- When buffered data reaches or exceeds the threshold, `write()` returns `false`.
- The producer should wait for `drain` before continuing.

We will explore internal buffering and backpressure in separate chapters.

---

## 9. Practical Exercise

Create a file named `writableStreams.js` and experiment with the following:

- Create a Writable Stream using `fs.createWriteStream()`.
- Write multiple chunks using `write()`.
- Write a final chunk using `end()`.
- Inspect the return value of `write()`.
- Set a custom `highWaterMark`.
- Listen for the `finish` event.
- Listen for the `close` event.
- Handle errors using the `error` event.
- Compare writing a string and a Buffer (including multi-byte UTF-8 characters).

---

## 10. Key Takeaways

- Writable Streams allow data to be written incrementally to a destination.
- The `write()` method sends data to a Writable Stream.
- The `end()` method signals that no more data will be written.
- The `write()` method returns a Boolean indicating whether the producer should continue writing.
- The `finish` event indicates that all written data has been processed.
- The `drain` event helps producers resume writing after backpressure.
- The `highWaterMark` defines a buffering threshold, not a strict memory limit.
- Writable Streams are useful for efficiently handling large amounts of data.

---

# Internal Buffer of Writable Streams in Node.js

## 1. Introduction

When data is written to a Writable Stream using the `write()` method, Node.js does not necessarily write that data to the underlying destination immediately.

Instead, Writable Streams maintain an internal buffer to temporarily hold incoming chunks until they can be processed by the underlying resource.

For example, when writing data to a file, the Writable Stream can receive multiple chunks while the file system is still processing previously submitted data.

The internal buffer helps manage this difference between the speed at which data is produced and the speed at which it can be written.

Understanding the internal buffer is important because it helps us understand:

- How Writable Streams handle incoming chunks.
- How `write()` works internally.
- What happens when multiple chunks are written.
- How `highWaterMark` controls buffering.
- Why backpressure is necessary.

---

## 2. How the Internal Buffer Works

A Writable Stream maintains an internal buffer for managing chunks waiting to be processed.

When we call `write()`, Node.js passes the chunk to the Writable Stream.

Depending on the stream's current state, the chunk may be processed immediately or queued for later processing.

### How It Works

1. The producer sends data using `write()`.
2. Node.js accepts the chunk.
3. If the stream is already processing another write, additional chunks are queued.
4. The underlying destination processes the current chunk.
5. The stream continues processing queued chunks.
6. When the buffer becomes sufficiently available after backpressure, the stream emits the `drain` event.

### Conceptual Diagram

```text
          Producer
              |
              |
          write(chunk)
              |
              v
      Writable Stream
              |
              v
       Internal Buffer
        +-----------+
        | Chunk 1   |
        | Chunk 2   |
        | Chunk 3   |
        | Chunk 4   |
        +-----------+
              |
              v
      Underlying Resource
              |
              v
        Destination
```

**Important:** This diagram represents the logical buffering process. Node.js can process the first chunk immediately while queuing subsequent chunks. The internal buffer is not necessarily a separate array containing every chunk at all times.

---

## 3. Understanding `writableLength`

The `writableLength` property returns the total number of bytes or objects currently queued for writing.

It helps us inspect how much data is waiting to be processed by the Writable Stream.

### Syntax

```javascript
writableStream.writableLength;
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt', {
  highWaterMark: 16,
});

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

console.log('Initial:', writableStream.writableLength);

writableStream.write('Hello');

console.log('After first write:', writableStream.writableLength);

writableStream.write(' Node.js');

console.log('After second write:', writableStream.writableLength);

writableStream.end();
```

### Expected Output

```text
Initial: 0
After first write: 5
After second write: 13
```

**Explanation:**

- Initially, no data is queued.
- The first chunk contains 5 bytes.
- The second chunk contains 8 bytes.
- The total queued length becomes 13 bytes.

**Note:** These values are illustrative for the example. Actual observations depend on stream state, byte encoding, and write processing timing.

---

## 4. Understanding `writableHighWaterMark`

The `writableHighWaterMark` property returns the configured high-water mark of a Writable Stream.

The high-water mark represents the threshold at which the stream starts applying backpressure.

### Syntax

```javascript
writableStream.writableHighWaterMark;
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt', {
  highWaterMark: 16,
});

console.log(writableStream.writableHighWaterMark);

writableStream.end();
```

### Output

```text
16
```

### Important Points

- In byte mode, the high-water mark is measured in bytes.
- In object mode, it is measured in objects.
- When the queued data reaches or exceeds the threshold, `write()` returns `false`.
- It is not a strict maximum buffer size.

---

## 5. Understanding How `write()` Uses the Internal Buffer

The `write()` method accepts a chunk and submits it to the Writable Stream.

Its return value indicates whether the producer should continue writing immediately.

| Return Value | Meaning                                                |
| ------------ | ------------------------------------------------------ |
| `true`       | The producer can continue writing.                     |
| `false`      | The producer should stop writing and wait for `drain`. |

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt', {
  highWaterMark: 10,
});

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

console.log('High Water Mark:', writableStream.writableHighWaterMark);

console.log('First write:', writableStream.write('Hello'));

console.log('Buffered Length:', writableStream.writableLength);

console.log('Second write:', writableStream.write('Node.js'));

console.log('Buffered Length:', writableStream.writableLength);

writableStream.end();
```

### Expected Output

```text
High Water Mark: 10
First write: true
Buffered Length: 5
Second write: false
Buffered Length: 12
```

**Explanation:**

1. The high-water mark is 10 bytes.
2. The first chunk contains 5 bytes.
3. The queued length is 5, so `write()` returns `true`.
4. The second chunk contains 7 bytes.
5. The total queued length reaches 12 bytes.
6. Since the threshold has been reached or exceeded, `write()` returns `false`.

**Important:** Returning `false` does not mean that the second chunk was rejected. It has already been accepted by the stream. It means the producer should stop sending more data temporarily.

---

## 6. Understanding the `drain` Event

When `write()` returns `false`, the producer should wait for the `drain` event before writing additional chunks.

The `drain` event indicates that the Writable Stream's buffered data has been sufficiently processed and the producer can resume writing.

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt', {
  highWaterMark: 10,
});

writableStream.on('error', (error) => {
  console.error('Stream error:', error);
});

writableStream.on('finish', () => {
  console.log('Finished writing to file');
});

writableStream.write('Hello');

const canContinue = writableStream.write(' Node.js');

if (!canContinue) {
  console.log('Backpressure detected');

  writableStream.once('drain', () => {
    console.log('Buffer drained');
    writableStream.write(' Streams!');
    writableStream.end();
  });
} else {
  writableStream.end();
}
```

### Expected Output

```text
Backpressure detected
Buffer drained
Finished writing to file
```

**Explanation:**

- `'Hello'` (5 bytes) + `' Node.js'` (8 bytes) totals 13 bytes against a `highWaterMark` of `10`.
- The second `write()` returns `false`.
- The producer stops writing additional chunks.
- Node.js processes the buffered data.
- The `drain` event is emitted only after a `write()` returned `false` and the buffer has flushed enough to relieve backpressure.
- The producer resumes writing and calls `end()`.

**Note:** The `drain` event is not emitted after every write. It only fires when backpressure was triggered (`write()` returned `false`) and the buffer subsequently drains.

---

## 7. Internal Buffer in Object Mode

By default, Writable Streams operate in byte mode.

However, Node.js also supports object mode, which allows a Writable Stream to accept JavaScript objects.

In object mode, the internal buffer tracks the number of objects instead of the number of bytes.

### Example

```javascript
import { Writable } from 'node:stream';

const writableStream = new Writable({
  objectMode: true,

  write(chunk, encoding, callback) {
    console.log('Received:', chunk);
    callback();
  },

  highWaterMark: 2,
});

console.log('High Water Mark:', writableStream.writableHighWaterMark);

writableStream.write({ name: 'John' });

console.log('Buffered Length:', writableStream.writableLength);

writableStream.write({ name: 'Alex' });

console.log('Buffered Length:', writableStream.writableLength);

writableStream.end();
```

**Important:** The example demonstrates object-mode configuration and buffer inspection. Because writes can be processed immediately, the observed `writableLength` depends on the timing of the write callback.

In object mode:

- Each object counts as one unit.
- The size of the object does not affect `writableLength`.
- `highWaterMark` represents the number of objects rather than bytes (default is `16`).

---

## 8. Difference Between `writableLength` and `writableHighWaterMark`

These two properties are closely related but serve different purposes.

| Property                | Description                         |
| ----------------------- | ----------------------------------- |
| `writableLength`        | Current amount of queued data.      |
| `writableHighWaterMark` | Configured threshold for buffering. |

### Example

```javascript
console.log(writableStream.writableLength);

console.log(writableStream.writableHighWaterMark);
```

Think of it this way:

- `writableLength` tells us how much data is currently queued.
- `writableHighWaterMark` tells us the threshold at which backpressure is applied.

---

## 9. Practical Exercise

Create a file named `internalWritableBuffer.js` and experiment with the following:

- Create a Writable Stream using `fs.createWriteStream()`.
- Configure a custom `highWaterMark`.
- Inspect `writableLength` before and after writing chunks.
- Inspect `writableHighWaterMark`.
- Observe when `write()` returns `true` or `false`.
- Listen for the `drain` event.
- Compare byte mode and object mode.
- Experiment with different chunk sizes (including a single chunk larger than `highWaterMark`).
- Observe how asynchronous write callbacks affect buffer length.

---

## 10. Key Takeaways

- Writable Streams use an internal buffer to manage incoming chunks.
- The `write()` method submits chunks to the Writable Stream.
- `writableLength` reports the amount of data currently queued for writing.
- `writableHighWaterMark` reports the configured buffering threshold.
- When queued data reaches or exceeds the high-water mark, `write()` returns `false`.
- Returning `false` does not mean that the chunk was rejected.
- The `drain` event allows the producer to resume writing after backpressure.
- In object mode, buffering is measured in objects rather than bytes.
- Understanding internal buffering is essential for understanding backpressure.

---

## 11. Official Documentation

- [Node.js – Writable Streams](https://nodejs.org/api/stream.html#writable-streams)
- [Node.js – writable.writableLength](https://nodejs.org/api/stream.html#writablewritablelength)
- [Node.js – writable.writableHighWaterMark](https://nodejs.org/api/stream.html#writablewritablehighwatermark)
- [Node.js – writable.write()](https://nodejs.org/api/stream.html#writablewritechunk-encoding-callback)
- [Node.js – drain Event](https://nodejs.org/api/stream.html#event-drain)
