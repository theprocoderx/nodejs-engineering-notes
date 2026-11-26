# Writable Streams in Node.js

A Writable Stream is a stream to which data can be written incrementally, piece by piece, rather than writing the entire dataset at once.
In Node.js, Writable Streams are commonly used for:

- Writing data to files.
- Creating file downloads.
- Sending HTTP responses.
- Writing data to network connections.
- Saving large datasets.
- Writing logs and application output.
  Let's understand Writable Streams sequentially, including how Node.js handles buffering and backpressure.

## 1. What is a Writable Stream?

Imagine you have a file named output.txt and want to write some data into it.
Node.js provides fs.createWriteStream() to create a Writable Stream.

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt");
```

Here:

- fs is Node.js's built-in File System module.
- createWriteStream() creates a Writable Stream.
- writableStream is an instance of fs.WriteStream.
- Data can be written into the stream using the write() method.
  The stream handles writing data to the destination incrementally.

How does it work?

```text
+------------------------------------+
|             DATA SOURCE            |
|                                    |
| Application / User Input / Stream  |
+------------------------------------+
                 |
                 v
+------------------------------------+
|          WRITABLE STREAM           |
|                                    |
| Receives data through write()      |
+------------------------------------+
                 |
                 v
+------------------------------------+
|          INTERNAL BUFFER           |
|                                    |
| Temporarily holds data waiting     |
| to be written                      |
+------------------------------------+
                 |
                 v
+------------------------------------+
|             DESTINATION            |
|                                    |
| output.txt                         |
+------------------------------------+
```

The Writable Stream maintains an internal buffer. Data is accepted into this buffer and written to the underlying destination as the system processes it.
This allows your application to continue producing data without having to wait for every individual write operation to finish.

## 2. Creating a Writable Stream Using fs.createWriteStream()

The fs.createWriteStream() method creates a stream that writes data to a file.
Syntax:

```js
fs.createWriteStream(path[, options])
```

- path: The destination file path.
- options: Optional configuration such as flags, encoding, and highWaterMark.
  Let's create a basic example.

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt");

writableStream.write("Hello, Node.js!\n");
writableStream.write("Learning Writable Streams.\n");

writableStream.end();
```

When you execute this code, Node.js creates output.txt and writes the supplied content into it.
The file will contain:

```text
Hello, Node.js!
Learning Writable Streams.
```

Let's understand each operation:

1. createWriteStream() creates the Writable Stream.
2. write() submits data to the stream.
3. end() signals that no more data will be written.
4. The stream finishes writing the queued data.
   Important: Calling write() does not necessarily mean that the data has already been written to the file. It means the stream has accepted the data for writing.
   This distinction is important when understanding buffering and backpressure.

## 3. The write() Method

The write() method is used to write data into a Writable Stream.
Syntax:

```js
writableStream.write(chunk[, encoding][, callback])
```

Parameters:

| Parameter | Description                                                       |
| :-------- | :---------------------------------------------------------------- |
| chunk     | Data to write (string, Buffer, or Uint8Array)                     |
| encoding  | Character encoding when the chunk is a string                     |
| callback  | Optional callback invoked when the supplied data has been handled |

The write() method returns a Boolean value (true or false).
This return value is particularly important because it helps us understand backpressure.

### A. Basic example

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt");

writableStream.write("First line\n");
writableStream.write("Second line\n");
writableStream.write("Third line\n");

writableStream.end();
```

Each call to write() submits another chunk of data to the Writable Stream.
The stream buffers the data and writes it to the destination.

### B. Understanding the return value

Consider this:

```js
const canContinue = writableStream.write("Hello Node.js");

console.log(canContinue);
```

The write() method returns:

- true: The stream can continue accepting data without the producer needing to wait for the buffer to drain.
- false: The buffering threshold has been reached or exceeded. You should stop writing temporarily and wait for the 'drain' event.
  Important: false does not mean writing failed. The chunk was accepted into the stream's buffer. It means the producer should respect backpressure.
  To understand why this matters, we first need to understand backpressure.

## 4. What is Backpressure?

Backpressure is a mechanism that prevents a Writable Stream from being overwhelmed when data is being written faster than the destination can process it.
Let's understand this with a real-world example.
Imagine you are filling a water tank.

- A pipe supplies water at 100 litres per minute.
- The tank can process or release only 20 litres per minute.
  Water enters faster than it can be processed.
  Eventually, the tank overflows.
  The same problem can happen with streams.
  Imagine:
- Your application produces data very quickly.
- The Writable Stream writes data to the destination more slowly.
- Data accumulates in the internal buffer.
- Memory consumption increases if the application keeps writing without respecting backpressure.

Without backpressure handling:

```text
+-------------------+      +-----------------------+      +-----------------+
| Fast data producer| ---> | Writable Stream Buffer| ---> | Slow destination|
|                   |      | Buffer keeps growing  |      |                 |
+-------------------+      +-----------------------+      +-----------------+
```

With backpressure handling:

```text
+-------------------+      +-----------------------+      +-----------------+
| Fast data producer| ---> | Writable Stream Buffer| ---> | Slow destination|
|                   |      | Controlled buffering  |      |                 |
+-------------------+      +-----------------------+      +-----------------+
```

Conceptual illustration of uncontrolled versus controlled buffering.
Node.js provides a mechanism to handle this situation through the write() return value and the 'drain' event.

## 5. The drain Event

The 'drain' event is emitted when the Writable Stream's internal buffer becomes empty after backpressure has occurred.
In simple terms:
When write() returns false, stop writing temporarily. Wait for the 'drain' event before continuing.
Let's understand this step by step.

### A. How does drain work?

1. Your application calls write() to submit data.
2. The stream accepts the data into its internal buffer.
3. The buffer reaches or exceeds the highWaterMark threshold.
4. write() returns false.
5. Your application stops producing more data.
6. Node.js continues processing the buffered data.
7. Once the buffer becomes empty, the 'drain' event is emitted.
8. Your application resumes writing.

```text
Call write(chunk)
       |
       v
Check return value
  |            |
  | true       | false
  v            v
Continue     Stop writing
writing      Wait for drain
No need to     |
wait for       v
drain        Buffer becomes empty
               |
               v
             'drain' event
               |
               v
             Resume writing
```

### B. Practical example using drain

Let's create a Writable Stream with a small highWaterMark so that we can observe backpressure more easily.

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt", {
  highWaterMark: 16,
});

const canContinue = writableStream.write("Hello, Node.js Streams!");

console.log("Can continue writing:", canContinue);

writableStream.on("drain", () => {
  console.log("Buffer is empty. Ready to continue.");
});

writableStream.end();
```

Because the string contains more than 16 bytes, write() returns false in this example.
However, notice something important: we call end() immediately.
This example demonstrates the return value, but it does not demonstrate resuming a producer after 'drain'.
Let's implement that properly.

### C. Handling backpressure correctly

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt", {
  highWaterMark: 16,
});

let index = 0;

function writeData() {
  let canContinue = true;

  while (index < 100 && canContinue) {
    const data = `Line ${index + 1}\n`;

    canContinue = writableStream.write(data);

    index++;
  }

  if (index < 100) {
    console.log("Waiting for drain event...");
    writableStream.once("drain", writeData);
  } else {
    writableStream.end();
  }
}

writableStream.on("finish", () => {
  console.log("All data has been written!");
});

writableStream.on("error", (error) => {
  console.error("Write error:", error.message);
});

writeData();
```

Let's understand the important part:

```js
while (index < 100 && canContinue) {
  const data = `Line ${index + 1}\n`;

  canContinue = writableStream.write(data);

  index++;
}
```

The loop continues writing while write() returns true.
When it returns false, the loop stops.
Then:

```js
writableStream.once("drain", writeData);
```

This registers a one-time listener for the 'drain' event.
When the buffer becomes empty, writeData() runs again and continues writing from where it stopped.
Why use once() instead of on()?
Because we want the callback to execute only once for that particular backpressure cycle. We register another listener if another cycle occurs.
This is a fundamental pattern for implementing backpressure manually.

## 6. The end() Method

The end() method signals that no more data will be written to the Writable Stream.
It tells Node.js:
"I have finished submitting data. Write any remaining buffered data and complete the stream."
Syntax:

```js
writableStream.end([chunk][, encoding][, callback]);
```

Let's understand a basic example:

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("output.txt");

writableStream.write("Hello Node.js!\n");
writableStream.write("Learning Writable Streams.\n");

writableStream.end();
```

What happens?

1. First write() submits the first chunk.
2. Second write() submits the second chunk.
3. end() signals that no additional data will be written.
4. Node.js flushes the remaining buffered data.
5. The stream emits the 'finish' event after all data has been processed by the underlying system.

### A. Writing data directly through end()

You can also pass a final chunk to end().

```js
writableStream.end("Final line of data.");
```

This is equivalent in purpose to writing the final chunk and then ending the stream.

```js
writableStream.write("Final line of data.");
writableStream.end();
```

### B. finish Event

The 'finish' event is emitted after:

- end() has been called.
- All data has been written to the underlying system.
- All write operations have completed.
  Example:

```js
writableStream.on("finish", () => {
  console.log("Writing completed successfully!");
});
```

Important distinction:

| Event  | Meaning                                              |
| :----- | :--------------------------------------------------- |
| drain  | Internal buffer has emptied after backpressure       |
| finish | All submitted data has been processed after end()    |
| error  | An error occurred                                    |
| close  | Stream and its underlying resources have been closed |

The 'finish' event does not necessarily mean that the file has been physically persisted to storage hardware. It indicates completion of the stream's writing operations.

### C. Important Rules for end()

There are a few rules you should remember:

1. Call end() when you have finished writing data.
2. Do not call write() after calling end().
3. You should not call end() multiple times.
4. The 'finish' event indicates that all submitted data has been handled.
5. If an error occurs, the stream might not emit 'finish'.

## 7. Other Important Writable Stream Properties and Events

Here are some additional concepts you will encounter while working with Writable Streams.
Properties

| Property              | Description                                                    |
| :-------------------- | :------------------------------------------------------------- |
| writable              | Indicates whether the stream is still open for writing         |
| writableEnded         | Indicates whether end() has been called                        |
| writableFinished      | Indicates whether all data has been flushed through the stream |
| writableLength        | Returns the number of bytes or objects queued for writing      |
| writableHighWaterMark | Returns the configured buffering threshold                     |

Example:

```js
console.log(writableStream.writableHighWaterMark);
console.log(writableStream.writableLength);
console.log(writableStream.writableEnded);
```

Important Events

| Event  | Description                                |
| :----- | :----------------------------------------- |
| drain  | Buffer becomes empty after backpressure    |
| finish | All submitted data has been processed      |
| error  | An error occurs                            |
| close  | Stream and underlying resources are closed |

## 8. Practical Example: Writing a Large File

Let's combine the concepts you have learned into one example.
Our goal is to write 100,000 lines into a file while handling backpressure.

```js
import fs from "node:fs";

const writableStream = fs.createWriteStream("large-output.txt", {
  highWaterMark: 16 * 1024,
});

let index = 0;
const totalLines = 100_000;

function writeData() {
  let canContinue = true;

  while (index < totalLines && canContinue) {
    const line = `This is line ${index + 1}\n`;

    canContinue = writableStream.write(line);

    index++;
  }

  if (index < totalLines) {
    writableStream.once("drain", writeData);
  } else {
    writableStream.end();
  }
}

writableStream.on("finish", () => {
  console.log("File writing completed!");
});

writableStream.on("error", (error) => {
  console.error("Stream error:", error.message);
});

writeData();
```

This example demonstrates:

- createWriteStream() creates the Writable Stream.
- write() submits data incrementally.
- highWaterMark controls the buffering threshold.
- write() returning false signals backpressure.
- drain allows writing to resume.
- end() signals completion.
- finish confirms that writing has completed.
  This is a useful pattern for understanding how Node.js handles large-scale data writing.
  For production applications, also consider stream lifecycle management, cancellation, and error propagation. Node.js provides stream.pipeline() for connecting streams with centralized error handling.

## 9. Readable Streams vs Writable Streams

Now that you understand both types, let's compare them.

| Feature         | Readable                  | Writable                                   |
| :-------------- | :------------------------ | :----------------------------------------- |
| Purpose         | Read data                 | Write data                                 |
| Main method     | read()                    | write()                                    |
| File API        | createReadStream()        | createWriteStream()                        |
| Internal buffer | Holds incoming data       | Holds outgoing data                        |
| Important event | data, end                 | drain, finish                              |
| Backpressure    | Controls data consumption | Signals when the producer should slow down |

The key distinction:

- Readable Streams produce data for consumers.
- Writable Streams consume data from producers.
