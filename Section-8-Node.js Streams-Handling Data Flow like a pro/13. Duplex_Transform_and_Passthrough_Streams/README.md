# Duplex Streams in Node.js.

## 1. What is a Duplex Stream?

A Duplex Stream is a stream that supports both reading and writing data independently.
In other words, a Duplex Stream combines the capabilities of:

- Readable Stream: Allows you to read data.
- Writable Stream: Allows you to write data.
  Unlike a Transform Stream, a Duplex Stream does not necessarily modify the data passing through it.

Let's understand this with a real-world example.
Real-world example: A telephone conversation
Imagine two people talking over a telephone.

- Person A speaks, and Person B receives the audio.
- Person B speaks, and Person A receives the audio.
- Both people can speak and listen independently.
  This is similar to how a Duplex Stream works.

```text
+------------------+                         +------------------+
|     Person A     |                         |     Person B     |
| Writes and reads |                         | Writes and reads |
+--------+---------+                         +---------+--------+
         |                                             ^
         |  A -> B (A speaks, B listens)               |
         +------------> [ Readable side of B ] --------+

         ^                                             |
         |  B -> A (B speaks, A listens)               |
         +------------- [ Readable side of A ] <-------+
```

Both directions can operate independently and simultaneously.
The important idea is that reading and writing are separate operations, even though they belong to the same Duplex Stream abstraction.

## 2. How Does a Duplex Stream Work?

A Duplex Stream has two separate internal sides:

1. A Readable side.
1. A Writable side.
   Each side has its own buffering and flow-control behavior.

```text
+---------------------------------------------------------------+
|                         Duplex Stream                         |
|           One stream abstraction, two independent sides       |
|                                                               |
|  +-------------------------+   +---------------------------+  |
|  |      Readable Side      |   |       Writable Side       |  |
|  |                         |   |                           |  |
|  |  Receives incoming data |   |  Sends outgoing data      |  |
|  |           |             |   |             ^             |  |
|  |           v             |   |             |             |  |
|  |  [ Internal Buffer ]    |   |    [ Internal Buffer ]    |  |
|  |           |             |   |             ^             |  |
|  |           v             |   |             |             |  |
|  |     read() / data       |   |     write() / drain       |  |
|  +-------------------------+   +---------------------------+  |
+---------------------------------------------------------------+
```

For example, a TCP socket allows an application to:

- Receive data from another computer.
- Send data to that computer.
- Perform both operations at the same time.
  The important distinction is that the Readable side does not automatically feed the Writable side. A Duplex Stream can receive and send completely different data.

## 3. Duplex Stream in Node.js

Node.js provides the Duplex class through the built-in node:stream module.
Let's look at its basic structure.

```js
import { Duplex } from "node:stream";

const duplexStream = new Duplex({
  read(size) {
    // Produce data for the readable side.
  },

  write(chunk, encoding, callback) {
    // Process data written to the writable side.
    callback();
  },
});
```

Here:

- read() implements the readable side's data-production logic.
- write() implements the writable side's data-consumption logic.
- callback() signals that the current write operation has completed.
  Notice that read() and write() perform different responsibilities.

Understanding the read() method
The \_read() implementation is responsible for producing data for consumers.
For example:

```js
read(size) {
  this.push('Hello from readable side!');
  this.push(null);
}
```

- this.push() adds data to the Readable Stream's internal buffer.
- this.push(null) indicates that no more readable data will be produced.

Understanding the write() method
The \_write() implementation receives data submitted through the stream's write() method.

```js
write(chunk, encoding, callback) {
  console.log(chunk.toString());

  callback();
}
```

Here, the stream receives a chunk and processes it.
Calling callback() tells Node.js that the write operation has completed.
Note: In custom Duplex implementations, the actual method names are \_read() and \_write(). The constructor accepts them as read() and write() options, as shown above.

## 4. Practical Example: Creating a Custom Duplex Stream

Let's create a custom Duplex Stream to understand how reading and writing work independently.
Our example will:

- Produce data from the Readable side.
- Accept data through the Writable side.
- Demonstrate that both operations can happen on the same stream.
  Create a file named customDuplex.js.

```js
import { Duplex } from "node:stream";

const duplexStream = new Duplex({
  read() {
    this.push("Hello from readable side!\n");
    this.push(null);
  },

  write(chunk, encoding, callback) {
    console.log("Received:", chunk.toString());

    callback();
  },
});

// Reading data
duplexStream.on("data", (chunk) => {
  console.log("Read:", chunk.toString());
});

duplexStream.on("end", () => {
  console.log("Reading completed!");
});

// Writing data
duplexStream.write("Hello from writable side!\n");

duplexStream.end();
```

Expected output:

```text
Received: Hello from writable side!

Read: Hello from readable side!

Reading completed!
```

Let's understand what happens.
Readable side:

```js
read() {
  this.push('Hello from readable side!\n');
  this.push(null);
}
```

The push() method adds data to the readable buffer.
The first call provides data, and the second call (push(null)) indicates that no more data will be produced.
Writable side:

```js
write(chunk, encoding, callback) {
  console.log('Received:', chunk.toString());

  callback();
}
```

When we call:

```js
duplexStream.write("Hello from writable side!\n");
```

Node.js passes that data to the Writable side's implementation.
The callback signals completion of the write operation.
What should you understand from this example?
The stream can receive data through its Writable side while independently producing data through its Readable side.

## 5. TCP Sockets: A Real-World Example of Duplex Streams

Now let's understand where Duplex Streams are actually used in Node.js applications.
One of the best examples is a TCP Socket.
TCP (Transmission Control Protocol) is a communication protocol that allows two devices to exchange data over a network reliably and in order.
Node.js provides the built-in node:net module for creating TCP servers and clients.
A TCP socket is a Duplex Stream because it supports both:

- Reading incoming network data.
- Writing outgoing network data.

How TCP communication works
Imagine two applications communicating:

- Application A runs a TCP server.
- Application B connects as a TCP client.
  Both applications can send and receive data.

```text
+-----------------------+                      +-----------------------+
|      TCP Client       |                      |      TCP Server       |
|   (Application B)     |                      |   (Application A)     |
+-----------+-----------+                      +-----------+-----------+
            |                                              ^
            |  Client -> Server (Outgoing data)            |
            +-------- socket.write() -----> [ TCP ] -------+
                                            [ Conn. ]
            ^                                              |
            |  Server -> Client (Incoming response)        |
            +-------- socket.on('data') <-- [ TCP ] <------+
```

Both endpoints have independent readable and writable sides.

A. Create a TCP Server
Create a file named server.js.

```js
import net from "node:net";

const server = net.createServer((socket) => {
  console.log("Client connected!");

  // Read incoming data
  socket.on("data", (chunk) => {
    const message = chunk.toString();

    console.log("Client says:", message);

    // Send response to client
    socket.write(`Server received: ${message}`);
  });

  socket.on("end", () => {
    console.log("Client ended its writable connection.");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error.message);
  });

  socket.on("close", () => {
    console.log("Client connection closed.");
  });
});

server.listen(3000, () => {
  console.log("TCP server listening on port 3000");
});
```

Let's understand the important parts.

1. Creating the server

```js
const server = net.createServer((socket) => {
  // ...
});
```

net.createServer() creates a TCP server.
Whenever a client establishes a connection, Node.js invokes the callback with a socket object. 2. Reading incoming data

```js
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

The socket's Readable side emits incoming network data through the 'data' event. 3. Sending outgoing data

```js
socket.write("Hello from server!");
```

The socket's Writable side sends data to the connected client.
Notice that the same socket object provides both on('data') and write().
That is exactly why a TCP socket is a Duplex Stream.

B. Create a TCP Client
Create another file named client.js.

```js
import net from "node:net";

const client = net.createConnection({ port: 3000, host: "127.0.0.1" }, () => {
  console.log("Connected to TCP server!");

  // Send data to server
  client.write("Hello from client!");
});

// Receive server response
client.on("data", (chunk) => {
  console.log("Server says:", chunk.toString());

  // Close the writable side after receiving response
  client.end();
});

client.on("end", () => {
  console.log("Server ended its writable connection.");
});

client.on("error", (error) => {
  console.error("Client error:", error.message);
});

client.on("close", () => {
  console.log("Connection closed.");
});
```

C. Run the Application
Open two terminals in VS Code.
Terminal 1 – Start the server

```bash
node server.js
```

```text
Server running
TCP server listening on port 3000
Client connected!
Client says: Hello from client!
Client ended its writable connection.
Client connection closed.
```

Terminal 2 – Start the client

```bash
node client.js
```

```text
Client connected
Connected to TCP server!
Server says: Server received: Hello from client!
Server ended its writable connection.
Connection closed.
```

This example demonstrates bidirectional communication through TCP sockets.
Important networking detail: TCP is a byte-stream protocol, not a message-based protocol. A single write() on one side does not guarantee one corresponding 'data' event on the other side. For real applications, you need a message-framing strategy, such as newline-delimited messages or length-prefixed messages.

## 6. Duplex Stream vs Transform Stream

These two stream types are closely related, but they have different responsibilities.

| Feature               | Duplex Stream   | Transform Stream                 |
| :-------------------- | :-------------- | :------------------------------- |
| Reading               | Yes             | Yes                              |
| Writing               | Yes             | Yes                              |
| Transforms data       | Not necessarily | Yes, its primary purpose         |
| Read/write operations | Independent     | Connected through transformation |
| Example               | TCP socket      | Gzip compression                 |

Let's understand the difference with examples.
Duplex Stream:
A TCP socket receives data from a client and sends data back. Both directions can carry different data.
Transform Stream:
A Gzip stream receives uncompressed data, transforms it into compressed data, and makes the compressed result available for reading.

```text
Duplex Stream:
  Read  -> Incoming data
  Write -> Outgoing data

Transform Stream:
  Input data -> Transformation (Modify or process data) -> Output data
```

## 7. Important Properties and Methods

A Duplex Stream supports the capabilities of both Readable and Writable Streams.

| Readable side  | Writable side         |
| :------------- | :-------------------- |
| read()         | write()               |
| push()         | end()                 |
| pause()        | writableLength        |
| resume()       | writableHighWaterMark |
| readable event | drain event           |
| data event     | finish event          |
| end event      | writableEnded         |

Remember that a Duplex Stream has two independent sides, so its readable and writable lifecycles can finish at different times.
For example, calling socket.end() ends the writable side of a TCP socket. It does not necessarily mean that the readable side has also ended.

8. Quick Recap
   Let's summarize what we have learned.
1. A Duplex Stream supports both reading and writing.
1. Its Readable and Writable sides operate independently.
1. Both sides maintain their own internal buffers.
1. A Duplex Stream does not necessarily transform data.
1. TCP sockets are practical examples of Duplex Streams.
1. Node.js provides the Duplex class through node:stream.
1. The node:net module provides TCP sockets.

# Transform Streams in Node.js

A **Transform Stream** is a special type of Duplex Stream that takes input, processes or transforms it, and produces output.

You have already learned that:

- **Readable Stream**: Reads data from a source.
- **Writable Stream**: Writes data to a destination.
- **Duplex Stream**: Supports both reading and writing.
- **Transform Stream**: Reads input, transforms it, and makes the transformed output available to be read.

Transform Streams are commonly used for data compression, decompression, encryption, decryption, parsing, and modifying text or binary data.

---

## 1. What is a Transform Stream?

Consider a simple example: you receive lowercase text and want to convert it into uppercase text.

```text
+---------------+
| hello node.js |  --> Readable data entering the stream
+-------+-------+
        |
        v
+---------------+
|   Transform   |
|    Stream     |  --> Processes each incoming chunk (Convert to uppercase)
+-------+-------+
        |
        v
+---------------+
| HELLO NODE.JS |  --> Transformed data available to the next stream
+---------------+
```

The important point is that the Transform Stream has two sides:

1. Its **writable side** receives input chunks.
2. Its **readable side** produces transformed output chunks.

The transformation happens between these two sides.

---

## 2. How Transform Streams differ from Duplex Streams

A Transform Stream is a specialized form of Duplex Stream. Both support reading and writing, but their behavior is different.

| Feature                    | Duplex Stream   | Transform Stream      |
| :------------------------- | :-------------- | :-------------------- |
| Reading                    | Yes             | Yes                   |
| Writing                    | Yes             | Yes                   |
| Transforms input           | Not necessarily | Yes, by design        |
| Relationship between sides | Independent     | Input produces output |
| Example                    | TCP socket      | Gzip compression      |

### Duplex Stream

A Duplex Stream has independent readable and writable sides.

```text
Writable side (Input)               Readable side (Output)
  Client sends data    [ Duplex ]     Server sends data
                       [ Stream ]
```

The readable output does not have to be derived from the writable input.

### Transform Stream

A Transform Stream connects the two sides through a transformation operation.

```text
Writable side -- Input          Transform operation          Readable side -- Output
    hello node.js       -->     Convert to uppercase     -->      HELLO NODE.JS
```

> **Remember:** Every Transform Stream is a Duplex Stream, but not every Duplex Stream is a Transform Stream.

---

## 3. Understanding `_transform()` and `_flush()`

Node.js provides the `Transform` class through the built-in `node:stream` module.

```js
import { Transform } from "node:stream";
```

When creating a custom Transform Stream, the two important methods are:

- `_transform()` — processes incoming chunks.
- `_flush()` — optionally handles any remaining data when no more input is coming.

You normally provide these as `transform()` and `flush()` options when constructing a `Transform` instance. Node.js uses them to implement the corresponding internal methods.

### A. `_transform(chunk, encoding, callback)`

This method is called for each incoming chunk. It receives three arguments:

| Argument   | Description                                       |
| :--------- | :------------------------------------------------ |
| `chunk`    | The incoming data, usually a `Buffer`             |
| `encoding` | The encoding, relevant when the chunk is a string |
| `callback` | Signals that processing of this chunk is complete |

The callback has this general form:

```js
callback(error, outputChunk);
```

- `callback(null, outputChunk)` — successfully provides transformed output.
- `callback(error)` — reports a transformation error.
- `callback()` — signals completion without producing output.

You can also use `this.push(outputChunk)` to produce output, then call `callback()`.

> Do not provide the same output through both `this.push()` and the `callback`.

### B. `_flush(callback)`

Sometimes a Transform Stream needs to retain data until all input has arrived.

For example, imagine you are building a stream that converts incoming text into complete lines. Input may arrive in chunks like this:

```text
Chunk 1: Hello No
Chunk 2: de.js\nWelcome
Chunk 3: Back\n
```

The first chunk does not contain a complete line. The second chunk completes `Hello Node.js` but leaves `Welcome` incomplete.

A Transform Stream can temporarily store incomplete data and emit it when a complete line becomes available.

What happens if the input ends while some data is still stored? That is where `_flush()` is useful. Node.js calls it when no more input will arrive, allowing you to process or emit any remaining buffered data.

> **Important:** `_flush()` is optional. You do not need it when your transform processes every chunk independently.

---

## 4. Creating a Custom Transform Stream

Let's build a practical Transform Stream that converts incoming text to uppercase.

### Project structure

```text
transform-stream-demo/
└── uppercase.js
```

### Implementation

```js
import { Transform } from "node:stream";

const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    try {
      const transformedData = chunk.toString().toUpperCase();

      callback(null, transformedData);
    } catch (error) {
      callback(error);
    }
  },
});

process.stdin.pipe(uppercaseTransform).pipe(process.stdout);
```

### Understanding the code

1. **Import `Transform`**

   ```js
   import { Transform } from "node:stream";
   ```

   We import Node.js's built-in `Transform` class.

2. **Create the Transform Stream**

   ```js
   const uppercaseTransform = new Transform({
     transform(chunk, encoding, callback) {
       // Transformation logic
     },
   });
   ```

   The `transform()` option implements the stream's internal `_transform()` method.

3. **Convert the incoming chunk**

   ```js
   const transformedData = chunk.toString().toUpperCase();
   ```

   Incoming chunks are generally Buffers when working with binary streams. We convert the `Buffer` to a string and then uppercase it.

4. **Return the transformed output**

   ```js
   callback(null, transformedData);
   ```

   This tells Node.js that processing is complete and provides the transformed output to the readable side.

5. **Connect the streams**

   ```js
   process.stdin.pipe(uppercaseTransform).pipe(process.stdout);
   ```

   Here is what each stream does:

   | Stream               | Role                                    |
   | :------------------- | :-------------------------------------- |
   | `process.stdin`      | Readable — receives terminal input      |
   | `uppercaseTransform` | Transform — converts input to uppercase |
   | `process.stdout`     | Writable — displays the output          |

### Run the example

In your VS Code terminal:

```bash
node uppercase.js
```

Enter:

```text
hello node.js
```

Output:

```text
HELLO NODE.JS
```

On Windows, press `Ctrl + Z`, then `Enter` on a new line to signal the end of standard input. You can also use `Ctrl + C` to terminate the process, but that is not the same as gracefully ending the input stream.

### Important: chunks are not necessarily complete messages

One subtle but important detail: a Transform Stream receives chunks, not necessarily complete lines, sentences, or application-level messages.

For example, a long text input might arrive as:

```text
Chunk 1: hello
Chunk 2:  node
Chunk 3: .js
```

Our uppercase transform works correctly because each chunk can be converted independently. However, transformations that depend on context across chunks—such as parsing complete lines or matching a pattern across chunk boundaries—need to maintain their own intermediate state. This is one reason `_flush()` exists.

---

## 5. Practical Example: `zlib.createGzip()`

Now let's move from a custom transformation to a real-world use case: data compression.

Node.js provides the built-in `node:zlib` module for compression and decompression. One of its methods is:

`createGzip()`

It creates a Gzip compression Transform Stream.

### How Gzip compression works

Suppose you have a file: `input.txt`

It contains:

```text
Node.js is a JavaScript runtime.

Node.js allows developers to build scalable
network applications.
```

We want to compress this file into: `input.txt.gz`

The stream flow looks like this:

```text
+-----------+      +---------------+      +--------------+
| input.txt | ---> | createGzip()  | ---> | input.txt.gz |
+-----------+      +---------------+      +--------------+
  Readable           Transform                Writable
  Original file      Compresses data          Compressed file
```

### Implementation using `pipeline()`

Create a file named `compress.js`:

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

    console.log("File compressed successfully!");
  } catch (error) {
    console.error("Compression failed:", error.message);
  }
}

compressFile();
```

### Understanding the implementation

1. **Read the original file**
   `createReadStream('input.txt')` creates a Readable Stream that reads the file in chunks.

2. **Create the Gzip Transform Stream**
   `createGzip()` receives chunks from the readable side of the pipeline, compresses them, and makes compressed chunks available through its readable side.

3. **Write the compressed data**
   `createWriteStream('input.txt.gz')` creates a Writable Stream that writes the compressed output to a new file.

4. **Connect everything with `pipeline()`**
   ```js
   await pipeline(
     createReadStream("input.txt"),
     createGzip(),
     createWriteStream("input.txt.gz"),
   );
   ```
   `pipeline()` connects the streams and handles backpressure and stream errors across the chain. It rejects if the pipeline fails. This is generally preferable to manually chaining `.pipe()` calls for production stream processing.

### Run it

Make sure `input.txt` exists in the same directory.

```bash
node compress.js
```

Expected output:

```text
File compressed successfully!
```

You should now have:

```text
transform-stream-demo/
├── input.txt
├── input.txt.gz
└── compress.js
```

The compressed file is binary data. Do not expect to read it as ordinary text.

---

## 6. Data Decompression using `zlib.createGunzip()`

Compression reduces the size of data. Decompression restores the original data.

Node.js provides:

`createGunzip()`

It creates a Gzip decompression Transform Stream. The flow is the reverse of compression:

```text
+--------------+      +-----------------+      +----------------+
| input.txt.gz | ---> | createGunzip()  | ---> | decompressed.txt |
+--------------+      +-----------------+      +----------------+
  Readable              Transform                  Writable
  Compressed file       Decompresses data          Restored data
```

### Implementation

Create a file named `decompress.js`:

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

async function decompressFile() {
  try {
    await pipeline(
      createReadStream("input.txt.gz"),
      createGunzip(),
      createWriteStream("decompressed.txt"),
    );

    console.log("File decompressed successfully!");
  } catch (error) {
    console.error("Decompression failed:", error.message);
  }
}

decompressFile();
```

### Run

```bash
node decompress.js
```

Expected output:

```text
File decompressed successfully!
```

You should now have:

```text
transform-stream-demo/
├── input.txt
├── input.txt.gz
├── decompressed.txt
├── compress.js
└── decompress.js
```

Compare the original and decompressed files:

```bash
fc /b input.txt decompressed.txt
```

On Windows, `fc /b` performs a binary comparison. If the files match, it reports no differences.

### Compression vs. decompression

| Operation     | Transform Stream | Purpose                  |
| :------------ | :--------------- | :----------------------- |
| Compression   | `createGzip()`   | Compresses data          |
| Decompression | `createGunzip()` | Restores compressed data |

Both are Transform Streams because they receive data on their writable side and produce processed data on their readable side.

Real-world applications include:

- Compressing HTTP responses to reduce network transfer size.
- Decompressing uploaded or downloaded `.gz` files.
- Processing compressed log files.
- Reducing storage requirements for suitable data.

> One important point: compression does not guarantee a smaller output for every input. Small files or already-compressed data may not shrink and can sometimes become slightly larger because of compression metadata and overhead.

---

## 7. Understanding Stream Lifecycle in a Transform Stream

A Transform Stream has both a writable lifecycle and a readable lifecycle. This means two different completion events matter:

| Event    | Meaning                                                          |
| :------- | :--------------------------------------------------------------- |
| `finish` | All input has been written and the writable side has finished.   |
| `end`    | All transformed output has been consumed from the readable side. |
| `error`  | An error occurred during processing.                             |
| `close`  | The stream has closed.                                           |

For example:

```js
transformStream.on("finish", () => {
  console.log("No more input data.");
});

transformStream.on("end", () => {
  console.log("All transformed output has been read.");
});
```

These events represent different stages. Do not assume `finish` and `end` mean the same thing.

Also remember that a Transform Stream can experience backpressure. If its readable output is not consumed quickly enough, it can slow down the writable side. When using `pipeline()`, Node.js coordinates this flow automatically.

---

## 8. Quick Revision

| Concept          | What you should remember                              |
| :--------------- | :---------------------------------------------------- |
| Transform Stream | A Duplex Stream that transforms input into output     |
| `transform()`    | Processes incoming chunks                             |
| `_transform()`   | Internal method implemented by the `transform` option |
| `flush()`        | Optional final processing hook                        |
| `_flush()`       | Internal method implemented by the `flush` option     |
| `this.push()`    | Adds data to the readable side                        |
| `callback()`     | Signals completion of the current transformation      |
| `createGzip()`   | Creates a compression Transform Stream                |
| `createGunzip()` | Creates a decompression Transform Stream              |
| `pipeline()`     | Connects streams and handles backpressure and errors  |

# PassThrough Stream in Node.js

A PassThrough Stream is a special type of Transform Stream that passes incoming data to its readable side without modifying it.
In simple terms:

- It receives data through its writable side.
- It forwards the same data through its readable side.
- It does not intentionally transform or modify the data.

Node.js provides the PassThrough class through the built-in node:stream module.

```js
import { PassThrough } from "node:stream";
```

---

## 1. How does a PassThrough Stream work?

Consider this example:
You send the following text into a PassThrough Stream:

```text
Hello Node.js Streams!
```

The stream forwards the same data as output.

```text
+-----------------------+      +-----------------------+      +-----------------------+
| Hello Node.js Streams!| ---> |   PassThrough Stream  | ---> | Hello Node.js Streams!|
+-----------------------+      +-----------------------+      +-----------------------+
         Input                         Forwards data                        Output
                                         unchanged
```

The input and output data are the same.

---

## 2. PassThrough Stream is a Transform Stream

Remember the relationship:

- A Duplex Stream supports independent reading and writing.
- A Transform Stream processes input and produces output.
- A PassThrough Stream is a Transform Stream that forwards input without changing its contents.

Therefore:

```text
+-------------------------------------------------------------------+
|                           Duplex Stream                           |
|                   Supports reading and writing                    |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  |                       Transform Stream                      |  |
|  |                 Produces output from input                  |  |
|  |                                                             |  |
|  |  +-------------------------------------------------------+  |  |
|  |  |                  PassThrough Stream                   |  |  |
|  |  |            Forwards input without modifying it        |  |  |
|  |  +-------------------------------------------------------+  |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 3. Creating a PassThrough Stream

Let's create a simple example.
File: `passThrough.js`

```js
import { PassThrough } from "node:stream";

const passThrough = new PassThrough();

// Read data from the stream
passThrough.on("data", (chunk) => {
  console.log("Output:", chunk.toString());
});

// Write data into the stream
passThrough.write("Hello Node.js!\n");
passThrough.write("Learning PassThrough Streams!\n");

// Signal that no more data will be written
passThrough.end();
```

Run:

```bash
node passThrough.js
```

Output:

```text
Output: Hello Node.js!

Output: Learning PassThrough Streams!
```

### Understanding the implementation

1. Import the class

```js
import { PassThrough } from "node:stream";
```

2. Create the stream

```js
const passThrough = new PassThrough();
```

This creates a Transform Stream whose default behavior is to forward incoming chunks unchanged.

3. Listen for output

```js
passThrough.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

The data event receives chunks from the readable side.

4. Write input

```js
passThrough.write("Hello Node.js!\n");
```

This writes data to the writable side. The same data becomes available on the readable side.

5. End the writable side

```js
passThrough.end();
```

This signals that no more input will be written.

---

## 4. Practical Use Cases

A PassThrough Stream may appear unnecessary at first because it does not modify data. However, it is useful when you need to observe, forward, or control a stream without changing its contents.

### Use Case 1: Monitoring data

Suppose you want to monitor how much data passes through a stream.

```js
import { PassThrough } from "node:stream";

const monitor = new PassThrough();

let totalBytes = 0;

monitor.on("data", (chunk) => {
  totalBytes += chunk.length;
});

monitor.on("end", () => {
  console.log(`Total bytes processed: ${totalBytes}`);
});

monitor.write("Hello ");
monitor.write("Node.js!");
monitor.end();
```

Here, the PassThrough Stream forwards the original data while allowing you to count the bytes.

### Use Case 2: Connecting streams

A PassThrough Stream can act as an intermediate stream when an API expects a readable or writable stream.
For example, it can serve as a bridge between different parts of an application.

### Use Case 3: Testing streams

You can use PassThrough Streams to simulate input and output streams in unit tests without needing actual files or network connections.
This is useful when testing stream-processing functions.

---

## 5. Difference Between Transform and PassThrough

| Feature           | Transform        | PassThrough            |
| :---------------- | :--------------- | :--------------------- |
| Type              | Duplex subclass  | Transform subclass     |
| Reads data        | Yes              | Yes                    |
| Writes data       | Yes              | Yes                    |
| Modifies data     | Can modify       | No, forwards unchanged |
| Custom processing | Yes              | Not by default         |
| Example           | Gzip compression | Data monitoring        |

Important: PassThrough is not a separate fundamental stream category. It is a built-in specialized Transform Stream.

---

## 6. Quick Revision

| Concept        | Explanation                                     |
| :------------- | :---------------------------------------------- |
| PassThrough    | A Transform Stream that forwards data unchanged |
| Input          | Received through the writable side              |
| Output         | Produced through the readable side              |
| Transformation | No intentional modification                     |
| Module         | node:stream                                     |
| Common uses    | Monitoring, testing, and stream bridging        |
