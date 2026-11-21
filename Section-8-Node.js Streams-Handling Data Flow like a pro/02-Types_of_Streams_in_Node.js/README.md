# Types of Streams in Node.js

## Introduction

In the previous chapter, we learned what streams are, how chunks work, and why Node.js processes data incrementally.

Now, let's understand the different types of streams available in Node.js.

Node.js provides four fundamental types of streams:

1. Readable Streams
2. Writable Streams
3. Duplex Streams
4. Transform Streams

Each stream type has a different responsibility depending on how data needs to be handled.

Some streams are designed to read data, some to write data, while others support both operations or transform data during processing.

Let's understand each type individually.

---

## 1. Understanding the Four Types of Streams

Before exploring each stream type in detail, let's understand their basic responsibilities.

| Stream Type      | Responsibility                                  |
| ---------------- | ----------------------------------------------- |
| Readable Stream  | Provides data to be consumed                    |
| Writable Stream  | Receives data to be written                     |
| Duplex Stream    | Supports both reading and writing independently |
| Transform Stream | Reads, transforms, and produces output          |

Let's understand their basic data flow.

### 1.1 Readable Stream

A Readable Stream provides data that an application can consume.

```text
Data Source
     |
     ↓
Readable Stream
     |
     ↓
Application
```

Example: Reading a file using `fs.createReadStream()`.

### 1.2 Writable Stream

A Writable Stream receives data from an application and writes it to a destination.

```text
Application
     |
     ↓
Writable Stream
     |
     ↓
Destination
```

Example: Writing a file using `fs.createWriteStream()`.

### 1.3 Duplex Stream

A Duplex Stream supports both reading and writing.

Its readable and writable sides operate independently.

```text
        Duplex Stream

Input Data          Output Data
    ↓                    ↑
Writable Side       Readable Side
```

Example: TCP sockets.

### 1.4 Transform Stream

A Transform Stream is a special type of Duplex Stream that transforms incoming data before producing output.

```text
Input Data
    |
    ↓
Writable Side
    |
    ↓
Transformation
    |
    ↓
Readable Side
    |
    ↓
Output Data
```

Example: Compressing data using `zlib.createGzip()`.

---

## 2. Readable Streams

A **Readable Stream is a stream from which data can be read or consumed.**

It represents a source of data that provides information to an application.

Instead of loading the entire dataset into memory, a Readable Stream makes data available incrementally in chunks.

### 2.1 How Does a Readable Stream Work?

Imagine you have a large file that you want to read.

A Readable Stream processes the file incrementally.

```text
       DATA SOURCE
        large.txt
            |
            ↓
      READABLE STREAM
            |
      ┌─────┼─────┐
      ↓     ↓     ↓
   Chunk  Chunk  Chunk
      1     2      3
      |     |      |
      └─────┼──────┘
            ↓
       APPLICATION
```

**How it works:**

1. Node.js creates a Readable Stream connected to the data source.
2. The stream reads a portion of the available data.
3. The data becomes available as a chunk.
4. The application consumes the chunk.
5. The process continues until the source has no more data.

### 2.2 Examples of Readable Streams

Readable Streams are commonly used for:

- Reading files using `fs.createReadStream()`.
- Receiving HTTP request bodies.
- Reading data from TCP connections.
- Receiving data from standard input using `process.stdin`.

Example:

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('input.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
```

Here:

- `fs.createReadStream()` creates a Readable Stream.
- The stream reads data from `input.txt`.
- The `'data'` event is emitted when a chunk becomes available.
- The callback receives the chunk.

### 2.3 Important Readable Stream Concepts

While learning Readable Streams, you will encounter several important concepts:

| Concept      | Description                                               |
| ------------ | --------------------------------------------------------- |
| `data`       | Emitted when a chunk of data is available in flowing mode |
| `end`        | Emitted when no more data is available to consume         |
| `error`      | Emitted when an error occurs                              |
| `readable`   | Indicates that data is available to be read               |
| `read()`     | Reads data from the internal buffer                       |
| `pause()`    | Temporarily stops flowing-mode data emission              |
| `resume()`   | Resumes flowing-mode data emission                        |
| Flowing Mode | Data is consumed automatically through events             |
| Paused Mode  | Data is consumed explicitly using `read()`                |

We will explore these events, methods, and modes in detail in the Readable Streams chapter.

---

## 3. Writable Streams

A **Writable Stream is a stream to which data can be written.**

It represents a destination that receives and consumes data.

Instead of writing an entire dataset at once, a Writable Stream allows data to be written incrementally.

### 3.1 How Does a Writable Stream Work?

Imagine you want to write a large amount of data into a file.

A Writable Stream accepts data in chunks and writes it to the destination.

```text
       APPLICATION
            |
      ┌─────┼─────┐
      ↓     ↓     ↓
   Chunk  Chunk  Chunk
      1     2      3
      |     |      |
      └─────┼──────┘
            ↓
      WRITABLE STREAM
            |
            ↓
       DESTINATION
         output.txt
```

**How it works:**

1. Node.js creates a Writable Stream connected to a destination.
2. The application provides data using the `write()` method.
3. The stream buffers and processes the incoming data.
4. The data is written to the destination.
5. The application calls `end()` when no more data needs to be written.

### 3.2 Examples of Writable Streams

Writable Streams are commonly used for:

- Writing files using `fs.createWriteStream()`.
- Sending HTTP responses.
- Writing data to TCP connections.
- Writing application output to standard output using `process.stdout`.

Example:

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('output.txt');

writableStream.write('Hello ');
writableStream.write('Node.js Streams!');

writableStream.end();
```

Here:

- `fs.createWriteStream()` creates a Writable Stream.
- `write()` sends data to the stream.
- `end()` indicates that no more data will be written.

### 3.3 Important Writable Stream Concepts

While learning Writable Streams, you will encounter several important concepts:

| Concept                | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `write()`              | Writes data to the stream                                                                   |
| `end()`                | Signals that no more data will be written                                                   |
| `drain`                | Indicates that the internal buffer has become available for more writing after backpressure |
| `finish`               | Emitted when all data has been flushed to the underlying system                             |
| `error`                | Emitted when an error occurs                                                                |
| `highWaterMark`        | Defines the buffering threshold                                                             |
| `write()` return value | Indicates whether the stream can accept more data without reaching its buffering threshold  |

We will explore these methods, events, and buffering mechanisms in the Writable Streams chapter.

---

## 4. Duplex Streams

A **Duplex Stream is a stream that supports both reading and writing.**

It contains two independent sides:

- A readable side that provides data to be consumed.
- A writable side that accepts data to be written.

Unlike a Transform Stream, a Duplex Stream does not necessarily transform the data passing through it.

### 4.1 How Does a Duplex Stream Work?

Imagine a TCP connection between two applications.

Both applications can send and receive data through the same connection.

A Duplex Stream makes this bidirectional communication possible.

```text
             DUPLEX STREAM

        ┌──────────────────────┐
        │                      │
Input ──┤   Writable Side      │
        │                      │
        │                      │
Output ◀┤   Readable Side      │
        │                      │
        └──────────────────────┘
```

**How it works:**

1. The writable side accepts incoming data from the application.
2. The readable side makes data available to the application.
3. Both sides operate independently.
4. Reading and writing can happen simultaneously.

### 4.2 Examples of Duplex Streams

Duplex Streams are commonly used for:

- TCP sockets.
- Network communication.
- Bidirectional data transfer.
- Custom communication channels.

Example:

```javascript
import net from 'node:net';

const socket = net.createConnection({
  port: 3000,
  host: 'localhost',
});

socket.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

socket.write('Hello from Node.js!');
```

Here:

- `net.createConnection()` creates a TCP connection.
- `socket.write()` sends data through the writable side.
- The `'data'` event receives data through the readable side.

The same socket supports both reading and writing.

### 4.3 Important Duplex Stream Concepts

While learning Duplex Streams, you will encounter:

| Concept                | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| Readable Side          | Provides data to be consumed                              |
| Writable Side          | Accepts data to be written                                |
| `_read()`              | Implements the custom readable-side data generation logic |
| `_write()`             | Implements the custom writable-side data handling logic   |
| Independent Operations | Reading and writing can happen independently              |

We will explore custom Duplex Streams and their internal methods in the Duplex Streams chapter.

---

## 5. Transform Streams

A **Transform Stream is a special type of Duplex Stream that transforms incoming data before producing output.**

It supports both reading and writing, but unlike a regular Duplex Stream, it processes the data passing through it.

The output is generated based on the transformation performed on the incoming data.

### 5.1 How Does a Transform Stream Work?

Imagine you have a large text file and want to compress it using Gzip.

A Transform Stream allows you to read the original data, compress it incrementally, and produce compressed output.

```text
       INPUT DATA
            |
            ↓
      WRITABLE SIDE
            |
            ↓
       TRANSFORMATION
       Gzip Compression
            |
            ↓
      READABLE SIDE
            |
            ↓
       OUTPUT DATA
     Compressed Data
```

**How it works:**

1. The writable side receives incoming data.
2. The Transform Stream processes the incoming chunks.
3. The transformation logic modifies or processes the data.
4. The resulting data becomes available through the readable side.
5. The process continues until the input has been completely processed.

### 5.2 Examples of Transform Streams

Transform Streams are commonly used for:

- Compressing data using Gzip.
- Decompressing compressed files.
- Encrypting and decrypting data.
- Converting data formats.
- Processing and filtering data.

Example:

```javascript
import { createGzip } from 'node:zlib';

const gzipStream = createGzip();
```

Here, `createGzip()` creates a Transform Stream that compresses incoming data.

### 5.3 Important Transform Stream Concepts

While learning Transform Streams, you will encounter:

| Concept        | Description                                             |
| -------------- | ------------------------------------------------------- |
| `_transform()` | Implements the transformation logic for incoming chunks |
| `_flush()`     | Handles any remaining data before the stream finishes   |
| Writable Side  | Receives incoming data                                  |
| Readable Side  | Provides transformed output                             |
| Transformation | Processes incoming data and generates output            |

We will explore custom Transform Streams, `_transform()`, `_flush()`, and practical compression examples in the Transform Streams chapter.

---

## 6. Difference Between Duplex and Transform Streams

Both Duplex and Transform Streams support reading and writing.

However, their primary responsibilities are different.

### Duplex Stream

A Duplex Stream provides independent readable and writable sides.

It does not necessarily transform the data.

```text
Input Data
    |
    ↓
Writable Side

Readable Side
    |
    ↓
Output Data
```

Example: TCP sockets.

### Transform Stream

A Transform Stream processes incoming data and produces transformed output.

```text
Input Data
    |
    ↓
Writable Side
    |
    ↓
Transformation
    |
    ↓
Readable Side
    |
    ↓
Output Data
```

Example: Gzip compression.

### Key Differences

| Feature                     | Duplex Stream               | Transform Stream                       |
| --------------------------- | --------------------------- | -------------------------------------- |
| Reading                     | Yes                         | Yes                                    |
| Writing                     | Yes                         | Yes                                    |
| Data transformation         | Not necessarily             | Yes                                    |
| Readable and writable sides | Independent                 | Connected through transformation logic |
| Main purpose                | Bidirectional communication | Data processing                        |
| Example                     | TCP socket                  | Gzip compression                       |

**Important:** Every Transform Stream is a Duplex Stream, but not every Duplex Stream is a Transform Stream.

---

## 7. Comparison of All Four Stream Types

Let's compare all four stream types to understand their responsibilities more clearly.

| Feature             | Readable      | Writable      | Duplex                      | Transform        |
| ------------------- | ------------- | ------------- | --------------------------- | ---------------- |
| Reads data          | Yes           | No            | Yes                         | Yes              |
| Writes data         | No            | Yes           | Yes                         | Yes              |
| Transforms data     | No            | No            | Not necessarily             | Yes              |
| Main responsibility | Provides data | Receives data | Bidirectional communication | Processes data   |
| Example             | File reader   | File writer   | TCP socket                  | Gzip compression |

### Visual Comparison

```text
1. READABLE STREAM

Source ──────> Readable Stream ──────> Application


2. WRITABLE STREAM

Application ──────> Writable Stream ──────> Destination


3. DUPLEX STREAM

             Duplex Stream
          ┌─────────────────┐
Input ───>│ Writable Side   │
Output <──│ Readable Side   │
          └─────────────────┘


4. TRANSFORM STREAM

Input ──> Writable Side
                 |
                 ↓
           Transformation
                 |
                 ↓
          Readable Side ──> Output
```

---

## 8. Real-World Applications of Stream Types

Streams are widely used in backend development because applications frequently need to read, write, transfer, and transform data.

Here are some common real-world applications:

| Application                   | Stream Type | Example                  |
| ----------------------------- | ----------- | ------------------------ |
| Reading large files           | Readable    | `fs.createReadStream()`  |
| Writing files                 | Writable    | `fs.createWriteStream()` |
| Receiving HTTP request bodies | Readable    | `http.IncomingMessage`   |
| Sending HTTP responses        | Writable    | `http.ServerResponse`    |
| TCP communication             | Duplex      | `net.Socket`             |
| Data compression              | Transform   | `zlib.createGzip()`      |
| Data decompression            | Transform   | `zlib.createGunzip()`    |
| Data encryption               | Transform   | Encryption streams       |

### Example: File Compression Pipeline

Imagine building a backend application that needs to compress large files.

You can connect three stream types to accomplish this:

```text
       Original File
            |
            ↓
      Readable Stream
            |
            ↓
      Transform Stream
       Gzip Compression
            |
            ↓
      Writable Stream
            |
            ↓
      Compressed File
```

Each stream has a specific responsibility:

1. **Readable Stream:** Reads the original file in chunks.
2. **Transform Stream:** Compresses the incoming data.
3. **Writable Stream:** Writes the compressed data into a new file.

This demonstrates how different stream types can work together to build an efficient data-processing pipeline.

---

## 9. What Should You Learn Next?

Now that you understand the four fundamental types of streams, the next step is to study each type individually.

Follow this learning sequence:

| No. | Topic                     | Description                                   |
| --- | ------------------------- | --------------------------------------------- |
| 1   | Readable Streams          | Understanding how to read data incrementally  |
| 2   | Writable Streams          | Understanding how to write data incrementally |
| 3   | Duplex Streams            | Understanding bidirectional communication     |
| 4   | Transform Streams         | Understanding data transformation             |
| 5   | Stream Events and Methods | Understanding important stream APIs           |
| 6   | Piping Streams            | Connecting streams using `pipe()`             |
| 7   | Pipeline API              | Managing stream pipelines using `pipeline()`  |
| 8   | Backpressure              | Understanding stream flow control             |
| 9   | Object Mode               | Processing JavaScript objects through streams |

### Recommended Practical Projects

After studying the individual stream types, build these projects:

1. **Large File Reader:** Read and process large files using Readable Streams.
2. **File Copy Utility:** Copy files using Readable and Writable Streams.
3. **File Compression Utility:** Compress files using Transform Streams.
4. **File Decompression Utility:** Decompress Gzip files.
5. **TCP Communication Application:** Exchange data using Duplex Streams.
6. **HTTP File Downloader:** Transfer large files using streams.
7. **Express.js File Upload:** Handle uploaded files using streaming techniques.

---

## 10. Key Takeaways

Node.js provides four fundamental types of streams, each designed for a specific data-handling responsibility.

- **Readable Stream:** Used to read or consume data.
- **Writable Stream:** Used to write or produce data.
- **Duplex Stream:** Supports reading and writing independently.
- **Transform Stream:** Supports reading and writing while transforming incoming data.

The most important distinction to remember is:

**Readable and Writable Streams handle individual data-flow directions, Duplex Streams support both directions independently, and Transform Streams process incoming data before producing output.**

Once you understand these differences, learning the internal working, events, methods, and practical implementation of each stream type becomes much easier.

---

## References

- [Node.js Official Documentation — Streams](https://nodejs.org/api/stream.html)
- [Node.js Official Documentation — File System](https://nodejs.org/api/fs.html)
- [Node.js Official Documentation — Net](https://nodejs.org/api/net.html)
- [Node.js Official Documentation — Zlib](https://nodejs.org/api/zlib.html)
