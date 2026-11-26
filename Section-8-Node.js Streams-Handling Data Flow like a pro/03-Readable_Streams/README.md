# Readable Streams in Node.js

A Readable Stream is a stream from which data can be read.
It provides an interface for consuming data from a source in smaller chunks rather than loading the entire data into memory.
In Node.js, Readable Streams are commonly used for:

- Reading files.
- Receiving HTTP request data.
- Reading data from network connections.
- Processing large datasets.
- Consuming data from standard input (process.stdin).
  Let's understand how Readable Streams work, starting with their creation and then moving to events and reading modes.

## 1. What is a Readable Stream?

Consider a file named large-file.txt containing:

```text
Hello Node.js!
Welcome to the world of Streams.
Learning Readable Streams.
```

Suppose you want to read this file.
You can use fs.readFile() to read the entire file, or fs.createReadStream() to read it incrementally.

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");
```

Here:

- fs is Node.js's built-in File System module.
- createReadStream() creates a Readable Stream.
- readableStream is an instance of fs.ReadStream, which extends Node.js's Readable stream.
  The stream reads data from the file and makes it available to your application in chunks.

## 2. How Does Node.js Read Data?

When you create a Readable Stream, Node.js does not necessarily read the entire file immediately.
Instead, it manages an internal buffer and makes data available as the consumer requests or receives it.
The basic process looks like this:

```text
+---------------+      +-----------------+      +-----------------+      +----------+
|  Source File  | ---> | Readable Stream | ---> | Internal Buffer | ---> | Consumer |
| large-file.txt|      | Reads data from |      | Temporarily     |      | Your app |
|               |      | the source      |      | holds available |      | processes|
|               |      |                 |      | chunks          |      | the data |
+---------------+      +-----------------+      +-----------------+      +----------+
```

An important concept here is the internal buffer.
A Readable Stream maintains an internal buffer that temporarily stores data waiting to be consumed.
The highWaterMark property controls the buffering threshold.
For example:

```js
const readableStream = fs.createReadStream("large-file.txt", {
  highWaterMark: 1024,
});
```

Here, highWaterMark: 1024 sets the buffering threshold to 1024 bytes (1 KB).
It is important to understand that highWaterMark is a threshold, not a strict guarantee that the buffer can never exceed that size.
For a regular file Readable Stream, the default highWaterMark is generally 64 KB.

## 3. Readable Stream Events

Node.js Readable Streams emit several events that help you understand and control the reading process.
Let's focus on three important events:

1. data
2. end
3. error

### A. data Event

The 'data' event is emitted whenever a chunk of data becomes available to a Readable Stream in flowing mode.
Example:

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk);
});
```

What happens here?

1. Node.js creates a Readable Stream.
2. The stream starts reading the file.
3. When a chunk becomes available, it emits the 'data' event.
4. The callback receives that chunk.
5. The process continues until the stream finishes or an error occurs.
   If you want to see the actual text rather than a Buffer, use:

```js
readableStream.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Remember: attaching a 'data' listener switches a Readable Stream into flowing mode.

### B. end Event

The 'end' event is emitted when there is no more data available to consume from the Readable Stream.
Example:

```js
readableStream.on("end", () => {
  console.log("File reading completed!");
});
```

The important distinction:

- 'data' tells you that a chunk is available.
- 'end' tells you that all readable data has been consumed.
  The 'end' event is not emitted if the stream is destroyed prematurely.

### C. error Event

The 'error' event is emitted when an error occurs while reading or operating on the stream.
For example, the file might not exist or the application might not have permission to read it.

```js
readableStream.on("error", (error) => {
  console.error("Stream error:", error.message);
});
```

You should handle stream errors explicitly, especially in production applications.
Important: Attach an 'error' listener to handle errors. An emitted 'error' event without a suitable listener can cause the process to throw an exception.

## 4. Two Reading Modes in Node.js

This is one of the most important concepts in Readable Streams.
Node.js Readable Streams operate in two modes:

1. Flowing Mode
2. Paused Mode
   The difference is how data is delivered to your application.

### A. Flowing Mode

In flowing mode, data is automatically read from the underlying system and delivered to your application through 'data' events.
You don't need to manually request each chunk.
Example:

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

readableStream.on("end", () => {
  console.log("Reading completed!");
});

readableStream.on("error", (error) => {
  console.error(error.message);
});
```

How it works:

1. The stream starts reading data.
2. A chunk becomes available.
3. The stream emits a 'data' event.
4. Your callback receives the chunk.
5. This continues until all data has been consumed.

```text
+-----------------+      +------------------------+      +----------+
| Readable Stream | ---> | Chunk 1 / Chunk 2 / ...| ---> | Consumer |
|                 |      | Automatically delivered|      | Receives |
|                 |      | through 'data' events  |      | chunks   |
+-----------------+      +------------------------+      +----------+
```

### B. Paused Mode

In paused mode, the stream does not automatically deliver chunks through 'data' events.
Instead, your application controls when to read data using the read() method.
Example:

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("readable", () => {
  let chunk;

  while ((chunk = readableStream.read()) !== null) {
    console.log(chunk.toString());
  }
});

readableStream.on("end", () => {
  console.log("Reading completed!");
});

readableStream.on("error", (error) => {
  console.error(error.message);
});
```

Let's understand the important part:

```js
let chunk;

while ((chunk = readableStream.read()) !== null) {
  console.log(chunk.toString());
}
```

- read() retrieves data from the internal buffer.
- It returns a chunk when data is available.
- It returns null when no data is currently available.
  The 'readable' event indicates that data can be read from the stream.
  Important: read() returning null does not necessarily mean the stream has finished. More data might arrive later. The 'end' event indicates that no more data remains to be consumed.

```text
+-----------------+      +-----------------+      +----------------------+      +----------+
| Readable Stream | ---> | Internal Buffer | <--- | Application requests | ---> | Consumer |
|                 |      |                 |      | data via read()      |      | Processes|
|                 |      |                 |      |                      |      | chunks   |
+-----------------+      +-----------------+      +----------------------+      +----------+
```

### Flowing Mode vs Paused Mode

| Feature        | Flowing Mode       | Paused Mode             |
| :------------- | :----------------- | :---------------------- |
| Data delivery  | Automatic          | Controlled by consumer  |
| Main event     | data               | readable                |
| Reading method | Automatic delivery | read()                  |
| Control        | pause() / resume() | Call read() when needed |

When should you use each?

- Flowing mode: When you want to receive and process chunks automatically.
- Paused mode: When you want more direct control over when data is consumed.

## 5. How to Control a Readable Stream

Node.js provides methods to control the reading process.
The most important methods are:

- pause()
- resume()
- read()
- isPaused()
- destroy()

### A. pause()

The pause() method stops a flowing Readable Stream from emitting further 'data' events.
Example:

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString());

  readableStream.pause();

  console.log("Stream paused!");
});
```

Here, the stream pauses after delivering a chunk.
Important: pause() does not erase the buffered data or permanently stop the stream. Data can continue accumulating in the internal buffer up to the stream's buffering behavior.

### B. resume()

The resume() method restarts a paused Readable Stream and allows it to emit 'data' events again.
Example:

```js
import fs from "node:fs";

const readableStream = fs.createReadStream("large-file.txt");

readableStream.on("data", (chunk) => {
  console.log(chunk.toString());

  readableStream.pause();

  setTimeout(() => {
    console.log("Resuming stream...");
    readableStream.resume();
  }, 1000);
});
```

Here:

1. The stream emits a chunk.
2. We pause the stream.
3. We wait for one second.
4. We resume the stream.
5. The next chunks continue arriving.
   This is useful when you need to temporarily slow down data consumption.

### C. read()

The read() method retrieves data from the internal buffer of a Readable Stream.

```js
const chunk = readableStream.read();
```

It returns:

- A chunk if data is available.
- null if no data is currently available.
  You can also specify how much data to read:

```js
const chunk = readableStream.read(10);
```

This requests up to 10 bytes from the stream in byte mode.
Remember that read() is primarily used in paused mode.

### D. isPaused()

The isPaused() method checks whether a Readable Stream is currently paused.

```js
console.log(readableStream.isPaused());
```

It returns a Boolean:

```text
true  // Stream is paused.
false // Stream is not paused.
```

### E. destroy()

The destroy() method destroys the stream and optionally accepts an error.

```js
readableStream.destroy();
```

Once destroyed, the stream cannot be used to continue reading.
This is useful when you want to stop processing a stream because of an error, cancellation, or application requirement.

## 6. Important Events and Methods – Quick Reference

| Event / Method | Purpose                                       |
| :------------- | :-------------------------------------------- |
| data           | Receives chunks in flowing mode               |
| end            | Indicates all readable data has been consumed |
| error          | Reports a stream error                        |
| readable       | Indicates data is available to read           |
| read()         | Retrieves data from the internal buffer       |
| pause()        | Stops flowing-mode data delivery              |
| resume()       | Restarts flowing-mode data delivery           |
| isPaused()     | Checks whether the stream is paused           |
| destroy()      | Destroys the stream                           |

## 7. Important Things to Remember

Before moving forward, keep these points clear:

1. A Readable Stream maintains an internal buffer.
2. highWaterMark controls the buffering threshold.
3. In flowing mode, chunks are delivered automatically through 'data' events.
4. In paused mode, you retrieve chunks using read().
5. pause() and resume() control flowing-mode data delivery.
6. end means all readable data has been consumed.
7. destroy() terminates the stream; it does not mean normal reading completed.
   One additional distinction: The 'end' and 'close' events are not the same. 'end' indicates successful consumption of all readable data, whereas 'close' indicates that the stream and its underlying resources have been closed. A stream can close without emitting 'end', for example, if it is destroyed prematurely.
