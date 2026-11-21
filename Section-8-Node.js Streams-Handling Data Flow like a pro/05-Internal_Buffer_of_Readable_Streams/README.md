# Internal Buffer of Readable Streams in Node.js

## 1. Introduction

A Readable Stream uses an **internal buffer** to temporarily store chunks of data before they are consumed.

The internal buffer acts as an intermediate storage layer between the data source and the consumer.

For example, when reading a file:

1. Node.js reads data from the file.
2. The incoming data is stored in the Readable Stream's internal buffer.
3. The consumer retrieves data from the buffer.
4. Node.js continues reading more data as needed.

### Basic Workflow

```text
        Data Source
        (File System)
             |
             v
       Incoming Chunks
             |
             v
    +--------------------+
    |  Readable Stream   |
    |                    |
    |   Internal Buffer  |
    |                    |
    +--------------------+
             |
             v
          Consumer
       (Application)
```

The internal buffer helps manage differences between the speed at which data is produced and the speed at which it is consumed.

---

## 2. What Is an Internal Buffer?

An internal buffer is a temporary storage area maintained by a Readable Stream.

When data arrives from the underlying resource, Node.js stores it in this buffer until the consumer reads it.

For example, imagine a file containing 100 KB of data.

Instead of requiring the application to load the entire file into memory at once, a Readable Stream can read smaller chunks and make them available incrementally.

```text
File: 100 KB
      |
      v
+-------------+
|   Chunk 1   |
+-------------+
|   Chunk 2   |
+-------------+
|   Chunk 3   |
+-------------+
      |
      v
Readable Stream
      |
      v
Internal Buffer
      |
      v
Consumer
```

**Important:** The internal buffer is managed by Node.js. We do not normally manipulate its internal data structures directly.

---

## 3. How Does the Internal Buffer Work?

Let's understand the process step by step.

1. A Readable Stream is created.
2. Node.js requests data from the underlying resource.
3. The stream receives data in chunks.
4. These chunks are added to the internal buffer.
5. The consumer reads available data.
6. As buffered data is consumed, the stream can request more data.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

readableStream.on('end', () => {
  console.log('Finished reading the file.');
});
```

In this example:

- `fs.createReadStream()` creates a Readable Stream.
- Node.js reads data from the file.
- Incoming chunks are temporarily buffered.
- The `data` event delivers chunks to the consumer.
- The stream continues until all data has been consumed.

---

## 4. Understanding `highWaterMark`

The `highWaterMark` option defines the buffering threshold of a stream.

It determines how much data a Readable Stream attempts to store in its internal buffer before it stops requesting more data from the underlying resource.

### Syntax

```js
const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 1024,
});
```

Here, `highWaterMark` is set to 1024 bytes (1 KB).

For a file Readable Stream, Node.js generally reads data in chunks of up to this size.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 4,
});

readableStream.on('data', (chunk) => {
  console.log('Chunk:', chunk);
  console.log('Chunk size:', chunk.length);
});
```

With a `highWaterMark` of 4, the stream generally reads up to 4 bytes per chunk.

**Important:** `highWaterMark` is a threshold, not a strict maximum memory limit. A stream can temporarily exceed it in certain situations.

---

## 5. Understanding `readableLength`

Node.js provides the `readableLength` property to determine how much data is currently stored in a Readable Stream's internal buffer.

### Syntax

```js
readableStream.readableLength;
```

It returns:

- The number of buffered bytes when the stream is operating in byte mode.
- The number of buffered objects when the stream is operating in object mode.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 10,
});

readableStream.on('readable', () => {
  console.log('Buffered data:', readableStream.readableLength);
});
```

The `readableLength` value changes as chunks enter and leave the internal buffer.

For example:

```text
Data arrives:
readableLength = 10

Consumer reads 4 bytes:
readableLength = 6

More data arrives:
readableLength = 10
```

These numbers illustrate buffer behavior; actual values depend on the timing of data production and consumption.

---

## 6. Understanding `readableHighWaterMark`

The `readableHighWaterMark` property returns the configured buffering threshold for a Readable Stream.

### Syntax

```js
readableStream.readableHighWaterMark;
```

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 1024,
});

console.log(readableStream.readableHighWaterMark);
```

### Output

```text
1024
```

### Difference Between `readableLength` and `readableHighWaterMark`

| Property                | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `readableLength`        | Amount of data currently stored in the internal buffer |
| `readableHighWaterMark` | Configured buffering threshold                         |

For example:

```text
readableHighWaterMark = 10
readableLength       = 6
```

This means the configured threshold is 10 bytes, while 6 bytes are currently buffered.

---

## 7. How Does `read()` Consume Data from the Internal Buffer?

The `read()` method retrieves data from the internal buffer.

When the consumer calls `read()`, the requested data is removed from the buffer and returned.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 10,
});

readableStream.on('readable', () => {
  console.log('Before reading:', readableStream.readableLength);

  const chunk = readableStream.read(4);

  if (chunk !== null) {
    console.log('Consumed:', chunk.toString());
  }

  console.log('After reading:', readableStream.readableLength);
});
```

Suppose the buffer contains 10 bytes.

```text
Before reading:
Buffer = 10 bytes

          |
          v

read(4)

          |
          v

Consumer receives 4 bytes

          |
          v

Remaining buffer = 6 bytes
```

**Important:** If the requested amount of data is not currently available, `read(size)` may return `null`. Node.js does not necessarily wait for the requested amount to arrive.

---

## 8. Internal Buffer in Object Mode

So far, we have discussed buffering in byte mode.

However, Readable Streams also support object mode.

In object mode, the internal buffer stores JavaScript objects instead of treating incoming data as a sequence of bytes.

### Example

```js
import { Readable } from 'node:stream';

const readableStream = Readable.from(
  [
    { id: 1, name: 'John' },
    { id: 2, name: 'Alice' },
    { id: 3, name: 'David' },
  ],
  {
    objectMode: true,
    highWaterMark: 2,
  }
);

readableStream.on('data', (chunk) => {
  console.log(chunk);
});
```

Here:

- The stream operates in object mode.
- The internal buffer stores JavaScript objects.
- `highWaterMark: 2` represents a threshold of two objects, not two bytes.

### Byte Mode vs Object Mode

| Byte Mode                                  | Object Mode                                  |
| ------------------------------------------ | -------------------------------------------- |
| Stores data as bytes or strings            | Stores JavaScript objects                    |
| `highWaterMark` is measured in bytes       | `highWaterMark` is measured in objects       |
| `readableLength` represents buffered bytes | `readableLength` represents buffered objects |
| Commonly used for files and network data   | Commonly used for structured data processing |

---

## 9. Relationship Between Internal Buffer and Backpressure

Backpressure occurs when data is produced faster than it can be consumed.

The internal buffer helps Node.js manage this situation.

For example:

- A file source produces data quickly.
- The consumer processes data slowly.
- Buffered data starts accumulating.
- The Readable Stream uses its buffering threshold to regulate further reading.

When a Readable Stream is connected to a Writable Stream using `pipe()`, Node.js coordinates reading and writing to manage backpressure.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./large-file.txt');

const writableStream = fs.createWriteStream('./output.txt');

readableStream.pipe(writableStream);
```

Here:

1. The Readable Stream reads data from the source file.
2. The Writable Stream receives chunks.
3. If the Writable Stream cannot accept more data immediately, `pipe()` manages the flow.
4. Reading is paused when necessary and resumed when the destination can accept more data.

**Important:** Backpressure is not limited to the Readable Stream's internal buffer. It involves coordination between the producer and consumer, including the Writable Stream's buffer.

---

## 10. Important Properties and Methods

| Property / Method       | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `readableLength`        | Returns the amount of data currently stored in the internal buffer |
| `readableHighWaterMark` | Returns the Readable Stream's buffering threshold                  |
| `read()`                | Retrieves data from the internal buffer                            |
| `push()`                | Adds data to a custom Readable Stream                              |
| `pause()`               | Stops automatic data delivery                                      |
| `resume()`              | Resumes flowing mode                                               |
| `isPaused()`            | Checks whether the stream is currently paused                      |

---

## 11. Practical Exercises

Create a file named `readableStreamBuffer.js` and practice the following:

- [ ] Create a Readable Stream using `fs.createReadStream()`.
- [ ] Set a custom `highWaterMark`.
- [ ] Observe the size of incoming chunks.
- [ ] Inspect `readableLength`.
- [ ] Inspect `readableHighWaterMark`.
- [ ] Use `read()` to consume data manually.
- [ ] Observe how `readableLength` changes after reading.
- [ ] Create a Readable Stream in object mode.
- [ ] Compare byte mode and object mode.
- [ ] Connect a Readable Stream to a Writable Stream using `pipe()`.

---

## 12. Key Takeaways

- A Readable Stream maintains an internal buffer to temporarily store incoming data.
- Data is consumed from this buffer incrementally.
- `highWaterMark` defines the buffering threshold.
- `readableLength` indicates how much data is currently buffered.
- `readableHighWaterMark` returns the configured threshold.
- `read()` retrieves data from the internal buffer.
- In object mode, the buffer stores objects rather than bytes.
- Backpressure helps prevent uncontrolled buffer growth when producers and consumers operate at different speeds.

---

## 13. Official Documentation

- [Node.js – Readable Streams](https://nodejs.org/api/stream.html#class-streamreadable)
- [Node.js – Buffering](https://nodejs.org/api/stream.html#buffering)
- [Node.js – `readableLength`](https://nodejs.org/api/stream.html#readablereadablelength)
- [Node.js – `readableHighWaterMark`](https://nodejs.org/api/stream.html#readablereadablehighwatermark)

**Next Chapter:** Reading Data from Readable Streams in Node.js
