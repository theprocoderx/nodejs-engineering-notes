# Readable Streams in Node.js

## 1. Introduction to Readable Streams

A **Readable Stream** is a type of stream used to read or consume data from a source in chunks.

Instead of loading the entire data into memory at once, a Readable Stream allows us to process data incrementally as it becomes available.

Readable Streams are commonly used when working with:

- Reading files.
- Receiving HTTP requests.
- Reading data from databases.
- Processing large datasets.
- Reading user input from the terminal.
- Receiving data over network connections.

### Example: Reading a File

Node.js provides the `fs.createReadStream()` method to create a Readable Stream from a file.

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk);
});

readableStream.on('end', () => {
  console.log('Finished reading the file.');
});
```

In this example:

1. `createReadStream()` creates a Readable Stream.
2. The `data` event is emitted whenever a chunk of data is available.
3. The `end` event is emitted when there is no more data to read.

---

## 2. How Readable Streams Work

A Readable Stream has an internal buffer that temporarily stores chunks of data before they are consumed.

The general workflow is:

```text
       Data Source
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

For example, when reading a file:

1. Node.js reads data from the file.
2. The data is stored in the stream's internal buffer.
3. The consumer reads the available chunks.
4. The process continues until the entire file has been consumed.

### Important Concepts

| Concept         | Description                                  |
| --------------- | -------------------------------------------- |
| Source          | The origin from which data is read           |
| Chunk           | A small piece of data                        |
| Internal Buffer | Temporarily stores chunks before consumption |
| Consumer        | The code that reads or processes the data    |
| `highWaterMark` | Defines the buffering threshold              |

---

## 3. Reading Data Using the `data` Event

Readable Streams can be consumed using the `data` event.

When a Readable Stream is in flowing mode, it emits `data` events whenever chunks become available.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

readableStream.on('end', () => {
  console.log('Reading completed.');
});

readableStream.on('error', (error) => {
  console.error('Stream error:', error.message);
});
```

### Understanding the `data` Event

- Emitted whenever a chunk of data is available.
- Automatically consumes chunks from the internal buffer.
- Typically places the stream into flowing mode.

**Important:** The `data` event is useful when you want to process incoming chunks as they arrive.

---

## 4. Reading Data Using the `read()` Method

The `read()` method allows us to read data manually from a Readable Stream's internal buffer.

Unlike the `data` event, which automatically delivers chunks, `read()` gives us control over when data is consumed.

### Syntax

```js
readableStream.read([size]);
```

- `size`: Optional number of bytes to read.
- Returns a chunk of data or `null` when no data is currently available.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('readable', () => {
  let chunk;

  while ((chunk = readableStream.read()) !== null) {
    console.log('Received:', chunk);
  }
});

readableStream.on('end', () => {
  console.log('Reading completed.');
});
```

### Understanding the `readable` Event

The `readable` event indicates that data is available to be read from the internal buffer.

It is commonly used with the `read()` method to consume data manually.

**Important:** Do not confuse the `readable` event with the `data` event.

- `data` automatically delivers chunks.
- `readable` notifies us that data is available, allowing us to call `read()` manually.

---

## 5. Flowing Mode vs Paused Mode

Readable Streams operate in two major reading modes:

1. Flowing Mode
2. Paused Mode

### Flowing Mode

In flowing mode, data is automatically read from the underlying system and delivered to the consumer as quickly as possible.

The `data` event is commonly used in this mode.

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk);
});
```

### Paused Mode

In paused mode, data remains in the internal buffer until the consumer explicitly requests it using the `read()` method.

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('readable', () => {
  let chunk;

  while ((chunk = readableStream.read()) !== null) {
    console.log(chunk);
  }
});
```

### Comparison

| Flowing Mode                               | Paused Mode                                |
| ------------------------------------------ | ------------------------------------------ |
| Data is delivered automatically            | Data is consumed manually                  |
| Commonly uses the `data` event             | Commonly uses `readable` and `read()`      |
| Less control over when chunks are consumed | More control over when chunks are consumed |
| Useful for straightforward data processing | Useful for controlled reading              |

---

## 6. Important Readable Stream Events

| Event      | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `data`     | Emitted when a chunk of data is available in flowing mode       |
| `end`      | Emitted when there is no more data to consume                   |
| `error`    | Emitted when an error occurs                                    |
| `readable` | Emitted when data becomes available to be read                  |
| `close`    | Emitted when the stream and its underlying resources are closed |

### Important Note

The `end` event is emitted only after the stream has been fully consumed.

The `close` event indicates that the stream has been closed. It is not guaranteed to occur in every stream implementation.

---

## 7. Important Readable Stream Methods

| Method       | Description                                       |
| ------------ | ------------------------------------------------- |
| `read()`     | Reads data from the internal buffer               |
| `pause()`    | Stops emitting `data` events                      |
| `resume()`   | Resumes flowing mode                              |
| `isPaused()` | Returns whether the stream is currently paused    |
| `pipe()`     | Connects a Readable Stream to a Writable Stream   |
| `unpipe()`   | Removes a destination from a Readable Stream      |
| `unshift()`  | Pushes a chunk back into the internal buffer      |
| `destroy()`  | Destroys the stream and optionally emits an error |

---

## 8. Understanding `highWaterMark`

The `highWaterMark` option defines the buffering threshold for a Readable Stream.

It controls how much data the stream attempts to store in its internal buffer before it stops requesting more data from the underlying resource.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 4,
});

readableStream.on('data', (chunk) => {
  console.log(chunk);
});
```

In this example, the stream uses a `highWaterMark` of 4 bytes.

For a file Readable Stream, this means Node.js will generally read data in chunks of up to 4 bytes.

**Important:** `highWaterMark` is a buffering threshold, not a strict maximum memory limit.

---

## 9. Creating a Custom Readable Stream

Node.js allows us to create our own Readable Streams by extending the `Readable` class from the `node:stream` module.

To implement a custom Readable Stream, we need to define the `_read()` method.

### Understanding `_read()`

The `_read()` method is an internal method that should be implemented by custom Readable Streams.

It is called by the stream implementation when more data is needed.

We provide data to the stream using:

```js
this.push(chunk);
```

When no more data is available, we signal the end of the stream using:

```js
this.push(null);
```

### Example

```js
import { Readable } from 'node:stream';

class CustomReadable extends Readable {
  constructor(options) {
    super(options);

    this.index = 1;
  }

  _read() {
    if (this.index <= 5) {
      this.push(`Chunk ${this.index}\n`);
      this.index++;
    } else {
      this.push(null);
    }
  }
}

const readableStream = new CustomReadable();

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

readableStream.on('end', () => {
  console.log('Reading completed.');
});
```

### Output

```text
Chunk 1
Chunk 2
Chunk 3
Chunk 4
Chunk 5
Reading completed.
```

### Understanding the Example

1. We extend the `Readable` class.
2. We implement the `_read()` method.
3. Each call to `_read()` pushes a new chunk into the stream.
4. Once all chunks have been pushed, `this.push(null)` signals the end of the stream.
5. The consumer receives the chunks through the `data` event.

**Important:** Do not call `_read()` directly. Node.js manages when it needs more data.

---

## 10. Real-World Applications

Readable Streams are used in many real-world applications.

| Use Case              | Example                                           |
| --------------------- | ------------------------------------------------- |
| File Reading          | Reading large files using `fs.createReadStream()` |
| HTTP Requests         | Reading incoming request bodies                   |
| Network Communication | Receiving data through TCP sockets                |
| Database Operations   | Consuming query results incrementally             |
| Data Processing       | Processing large datasets chunk by chunk          |
| File Uploads          | Receiving uploaded file data                      |

---

## 11. Practical Exercises

Practice the following examples to understand Readable Streams more deeply.

- [ ] Read a text file using `fs.createReadStream()`.
- [ ] Observe how the `data` event receives chunks.
- [ ] Change the `highWaterMark` value and compare chunk sizes.
- [ ] Read data using the `read()` method.
- [ ] Compare flowing mode and paused mode.
- [ ] Use `pause()` and `resume()` to control data consumption.
- [ ] Create a custom Readable Stream using the `Readable` class.
- [ ] Handle stream errors using the `error` event.
- [ ] Read a large file without loading the entire file into memory.

---

## 12. Key Takeaways

- A Readable Stream is used to consume data incrementally.
- Data is delivered in chunks instead of loading everything into memory.
- The `data` event is commonly used in flowing mode.
- The `readable` event and `read()` method provide manual control over reading.
- Readable Streams support flowing and paused modes.
- `highWaterMark` defines the internal buffering threshold.
- Custom Readable Streams can be created by extending the `Readable` class.
- The `_read()` method is responsible for providing data to a custom Readable Stream.
- `this.push(null)` signals that no more data will be provided.

---

## 13. Official Documentation

- [Node.js Streams Documentation](https://nodejs.org/api/stream.html)
- [Node.js File System Documentation](https://nodejs.org/api/fs.html)
- [Node.js Readable Streams](https://nodejs.org/api/stream.html#class-streamreadable)

**Next Chapter:** Writable Streams in Node.js
