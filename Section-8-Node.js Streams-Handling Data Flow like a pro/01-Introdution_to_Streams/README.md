# What Are Streams in Node.js?

**Streams** are a way to process data piece by piece (in chunks) instead of loading the entire data into memory at once.
In Node.js, streams allow you to read, write, or transfer data efficiently, especially when working with large amounts of data.

Let's understand them sequentially, starting from the basics.

---

## 1. Understanding Streams with a Real-World Example

Imagine you have a video file that is 2 GB in size. You want to play this video. There are two possible approaches:

### Approach 1: Without Streams

1. Load the entire 2 GB video into memory.
2. Wait until the loading finishes.
3. Start playing the video.

Result: **High memory consumption**.

### Approach 2: With Streams

1. Read a small chunk of video data.
2. Process or play that chunk.
3. Read the next chunk.
4. Continue until the entire video is processed.

Result: **Memory efficient**.

This is the fundamental idea behind streams.

---

## 2. What is a Stream?

A **Stream** is an abstraction that represents a continuous flow of data from a source to a destination.
In simple terms, a stream allows us to work with data as it becomes available rather than waiting for all the data to be available.

Let's break this definition down:

- **Source**: Where the data comes from, such as a file, network, or user input.
- **Stream**: The mechanism through which data flows.
- **Destination**: Where the data goes, such as another file, an HTTP response, or a network connection.

For example, imagine reading a file in Node.js:

```text
+-------------------------+      +---------------------------+      +--------------------------+
| Source: large-file.txt  | ---> |      Readable Stream      | ---> | Destination: Application |
|                         |      | Controls the flow of data |      |                          |
+-------------------------+      +---------------------------+      +--------------------------+
```

Here, the file is the source, the readable stream provides the data, and your application consumes it.

> **Important:** A stream is not the actual data itself. It is an abstraction/API for handling the flow of data.

In Node.js, streams are implemented using the `node:stream` module.

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk);
});
```

Here:

- `createReadStream()` creates a readable stream.
- The stream reads data from the file.
- The `'data'` event is emitted when a chunk of data is available.
- The callback receives that chunk.

---

## 3. What is a Chunk?

A **Chunk** is a small piece of data that is processed or transferred as part of a larger data stream.
Instead of handling an entire file as one large piece of data, streams divide the data into smaller pieces called chunks.

Suppose you have a text file containing the following data:

```text
Hello, Node.js Streams!
```

Imagine the stream reads this data in chunks of 5 bytes. The data might be divided like this:

```text
Original data:
+-------------------------+
| Hello, Node.js Streams! |
+-------------------------+

Data divided into chunks (5 bytes each):
+---------+  +---------+  +---------+  +---------+  +---------+
| Chunk 1 |  | Chunk 2 |  | Chunk 3 |  | Chunk 4 |  | Chunk 5 |
|  Hello  |  |  , Nod  |  |  e.js   |  |  Strea  |  |   ms!   |
+---------+  +---------+  +---------+  +---------+  +---------+
```

_Illustrative division of data into 5-byte chunks._

Each chunk represents a portion of the original data. In Node.js, chunks from a file stream are generally represented as `Buffer` objects by default.

Let's verify this with actual code:

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt", {
  highWaterMark: 5,
});

readableStream.on("data", (chunk) => {
  console.log(chunk);
  console.log(chunk.toString());
});
```

### What is `highWaterMark`?

It specifies the buffering threshold used by a stream.
For a regular file readable stream, its default value is typically **64 KB (65,536 bytes)**.
Here, we set it to `5`, so the stream will generally read up to 5 bytes per chunk.

The output will look something like:

```text
<Buffer 48 65 6c 6f>
Hello

<Buffer 20 2c 4e 64 6f>
, Nod

<Buffer 20 2e 65 6a 73>
e.js

...
```

Notice that:

- `chunk` contains binary data represented by a `Buffer`.
- `chunk.toString()` converts the `Buffer` into a string using UTF-8 by default.
- Each `'data'` event provides another chunk.

> **Important:** A chunk is not necessarily a complete sentence, line, or meaningful piece of information. It is simply a portion of data.

---

## 4. Why Do Streams Process Data Incrementally?

Incremental processing means processing data piece by piece as it becomes available instead of waiting for the entire dataset to be loaded.

Consider reading a large file using Node.js:

**Without Streams:**

```js
import fs from "node:fs";

fs.readFile("large-file.txt", (err, data) => {
  if (err) throw err;

  console.log(data);
});
```

**With Streams:**

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.length);
});
```

### Reason 1: Memory Efficiency

Without streams, `fs.readFile()` reads the entire file into memory before invoking the callback, requiring enough memory to hold the file contents alongside other application memory needs. With streams, Node.js reads smaller chunks incrementally.

**Memory usage comparison (conceptual):**

```text
Without streams:
[================================================] Large allocation

With streams:
[====] Smaller buffer
```

_Illustrative comparison, not measured memory usage. Actual stream memory depends on buffering, chunk sizes, and processing._

### Reason 2: Faster Processing

Without streams, you generally wait until the entire file has been read before processing it. With streams, you can start processing as chunks arrive—for example, on a 1 GB file:

- First chunk arrives → Start processing.
- Second chunk arrives → Continue processing.
- Third chunk arrives → Continue processing.
- Remaining chunks arrive → Continue processing.

### Reason 3: Better Data Handling & Responsiveness

Streams improve responsiveness and allow you to connect operations together—for example, reading a large file, compressing it, and saving the compressed output in a **stream pipeline** (`pipe()` and `pipeline()`).

---

## 5. Four Types of Streams in Node.js

Node.js provides four fundamental types of streams:

1. **Readable Streams**: Streams from which data can be read.
   - _Example:_ Reading a file using `fs.createReadStream()`.
2. **Writable Streams**: Streams to which data can be written.
   - _Example:_ Writing a file using `fs.createWriteStream()`.
3. **Duplex Streams**: Streams that can both read and write data independently.
   - _Example:_ TCP network sockets.
4. **Transform Streams**: Streams that can read data, transform it, and write the transformed output.
   - _Example:_ Compression using `zlib.createGzip()`.

---

## 6. How Streams Work Internally & Backpressure

A simplified stream workflow looks like this:

```text
+-----------------------------------+
|            Data Source            |
|   Large file / Network / Input    |
+-----------------+-----------------+
                  |
                  v
+-----------------------------------+
|          Readable Stream          |
|       Reads data in chunks        |
+-----------------+-----------------+
                  |
                  v
+-----------------------------------+
|            Processing             |
|      Optional transformation      |
+-----------------+-----------------+
                  |
                  v
+-----------------------------------+
|          Writable Stream          |
|      Writes or sends chunks       |
+-----------------+-----------------+
                  |
                  v
+-----------------------------------+
|            Destination            |
| File / HTTP Response / Network    |
+-----------------------------------+
```

One important concept you will encounter while learning streams is **Backpressure**.
Backpressure occurs when data is being produced faster than the destination can consume it. Node.js streams provide mechanisms to manage this flow and prevent excessive memory consumption.

---

## 7. Real-World Applications

Streams are widely used in backend development:

| Use case        | Stream application                     |
| :-------------- | :------------------------------------- |
| File processing | Reading large files                    |
| File uploads    | Receiving uploaded files               |
| File downloads  | Sending files to clients               |
| Video streaming | Delivering video chunks                |
| Compression     | Compressing data using Gzip            |
| Networking      | Transferring TCP data                  |
| HTTP            | Processing request and response bodies |

For example, when building an Express.js application, streams are useful for uploading and downloading large files without loading the entire file into memory.

---

## 8. Quick Recap

| Concept                    | Meaning                                                                          |
| :------------------------- | :------------------------------------------------------------------------------- |
| **Stream**                 | An abstraction for handling a continuous flow of data from source to destination |
| **Chunk**                  | A small piece of data                                                            |
| **Incremental processing** | Processing data piece by piece as it becomes available                           |
| **Main advantage**         | Efficient memory usage, faster/continuous processing, and better responsiveness  |
