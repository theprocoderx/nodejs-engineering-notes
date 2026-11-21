# Closing Writable Streams in Node.js

## 1. Introduction

A Writable Stream allows us to write data incrementally to a destination, such as a file, network socket, or HTTP response.

After writing all the required data, we need to properly close or finish the stream.

Node.js provides methods and events to manage the Writable Stream lifecycle.

Understanding how to close Writable Streams is important because it helps us:

- Ensure all pending data is processed.
- Prevent accidental data loss.
- Release underlying resources.
- Handle errors during the writing process.
- Manage stream lifecycle correctly.

In this chapter, we will explore how Writable Streams are finished, closed, and destroyed.

---

## 2. Understanding the Writable Stream Lifecycle

A Writable Stream follows a lifecycle from creation to completion.

The general lifecycle looks like this:

```text
       Stream Created
              |
              v
       Writing Data
              |
              v
        write() calls
              |
              v
          end()
              |
              v
     Pending Writes Processed
              |
              v
         finish Event
              |
              v
         close Event
```

**Important:** The `close` event is not guaranteed to occur for every Writable Stream. It depends on the stream implementation and its underlying resource.

---

## 3. Understanding the `end()` Method

The `end()` method signals that no more data will be written to the Writable Stream.

It indicates that the producer has finished sending data.

### Syntax

```javascript
writableStream.end([chunk][, encoding][, callback]);
```

### Parameters

| Parameter  | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `chunk`    | Optional final data to write before ending the stream.          |
| `encoding` | Character encoding used when the final chunk is a string.       |
| `callback` | Function called when the stream finishes processing its writes. |

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.write('Hello ');

writableStream.write('Node.js ');

writableStream.end('Streams!');

writableStream.on('finish', () => {
  console.log('Writing completed');
});
```

### Output in `output.txt`

```text
Hello Node.js Streams!
```

### Console Output

```text
Writing completed
```

### Explanation

- `write()` sends chunks to the Writable Stream.
- `end()` indicates that no additional chunks will be written.
- Node.js processes all pending writes.
- After all data has been processed, the `finish` event is emitted.

**Important:** Calling `end()` does not immediately close the underlying resource. The stream first processes its pending writes.

---

## 4. Understanding the `finish` Event

The `finish` event is emitted after:

1. The `end()` method has been called.
2. All previously submitted data has been processed by the Writable Stream.

### Syntax

```javascript
writableStream.on('finish', () => {
  console.log('Writing finished');
});
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('finish', () => {
  console.log('All data has been processed');
});

writableStream.write('Hello Node.js');

writableStream.end();
```

### Output

```text
All data has been processed
```

### Important Points

- The `finish` event is associated with successful completion of the Writable Stream's writing process.
- It is emitted after `end()` has been called.
- All submitted writes have been processed.
- It does not necessarily guarantee that data has been physically persisted to storage.

---

## 5. Understanding the `close` Event

The `close` event is emitted when the stream and its underlying resources have been closed.

For example, when using `fs.createWriteStream()`, the `close` event indicates that the associated file descriptor has been closed.

### Syntax

```javascript
writableStream.on('close', () => {
  console.log('Stream closed');
});
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('finish', () => {
  console.log('Writing finished');
});

writableStream.on('close', () => {
  console.log('Stream closed');
});

writableStream.write('Hello Node.js');

writableStream.end();
```

### Expected Output

```text
Writing finished
Stream closed
```

### Important Points

- `close` indicates that the stream's underlying resources have been closed.
- It may occur after `finish`.
- It can also occur when a stream is destroyed prematurely.
- Not every Writable Stream emits `close`.

---

## 6. Difference Between `finish` and `close`

These two events are related but represent different stages of the stream lifecycle.
| Feature | `finish` | `close` |
| --------------------------- | ---------------------------------------------- | -------------------------------- |
| Meaning | Writing process completed | Stream resources closed |
| Trigger | After `end()` and pending writes are processed | When stream resources are closed |
| Related to | Write completion | Resource cleanup |
| Guaranteed | For a successfully completed Writable Stream | Not guaranteed |
| Can occur after destruction | Not necessarily | Yes |

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('finish', () => {
  console.log('Finish event');
});

writableStream.on('close', () => {
  console.log('Close event');
});

writableStream.end('Hello Node.js');
```

### Expected Output

```text
Finish event
Close event
```

**Remember:**

- `finish` means the writing process is complete.
- `close` means the underlying stream resources are closed.

---

## 7. Understanding the `destroy()` Method

The `destroy()` method destroys a Writable Stream and stops further writing operations.

It is commonly used when an error occurs or when the stream must be terminated before normal completion.

### Syntax

```javascript
writableStream.destroy([error]);
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('error', (error) => {
  console.error('Stream error:', error.message);
});

writableStream.on('close', () => {
  console.log('Stream destroyed and closed');
});

writableStream.write('Hello Node.js');

writableStream.destroy();
```

### Expected Output

```text
Stream destroyed and closed
```

### Important Points

- `destroy()` terminates stream operations.
- Pending writes may be discarded.
- An optional error can be passed to `destroy()`.
- The `close` event is emitted when the stream has been closed, if supported.
- The `finish` event is not emitted when a stream is destroyed before normal completion.

**Important:** Use `end()` for normal completion and `destroy()` for premature termination or cleanup.

---

## 8. Understanding `writableEnded`

The `writableEnded` property indicates whether the `end()` method has been called.

### Syntax

```javascript
writableStream.writableEnded;
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

console.log('Before end:', writableStream.writableEnded);

writableStream.end();

console.log('After end:', writableStream.writableEnded);
```

### Output

```text
Before end: false
After end: true
```

### Important Points

- Initially, `writableEnded` is `false`.
- After calling `end()`, it becomes `true`.
- It does not indicate whether all writes have finished processing.

---

## 9. Understanding `writableFinished`

The `writableFinished` property indicates whether all data has been flushed to the underlying system.

It becomes `true` immediately before the `finish` event is emitted.

### Syntax

```javascript
writableStream.writableFinished;
```

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

console.log('Before writing:', writableStream.writableFinished);

writableStream.end('Hello Node.js');

writableStream.on('finish', () => {
  console.log('After finish:', writableStream.writableFinished);
});
```

### Output

```text
Before writing: false
After finish: true
```

### Difference Between `writableEnded` and `writableFinished`

| Property           | Description                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `writableEnded`    | Indicates that `end()` has been called.                                                                             |
| `writableFinished` | Indicates that all submitted writes have been processed and the stream is about to emit `finish` or has emitted it. |

---

## 10. Handling Errors While Closing Writable Streams

Errors can occur during the writing process because of file permission issues, unavailable resources, or other I/O failures.

We should handle these errors properly.

### Example

```javascript
import fs from 'node:fs';

const writableStream = fs.createWriteStream('./output.txt');

writableStream.on('error', (error) => {
  console.error('Writing failed:', error.message);
});

writableStream.on('finish', () => {
  console.log('Writing completed successfully');
});

writableStream.on('close', () => {
  console.log('Stream closed');
});

writableStream.write('Hello Node.js');

writableStream.end();
```

### Important Points

- Listen for the `error` event to handle stream errors.
- Do not assume that `finish` will occur after a write failure.
- The `close` event may still occur after an error.
- Avoid writing additional data after calling `end()`.

---

## 11. Important Differences Between Writable Stream Methods and Events

| Method / Property / Event | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `write()`                 | Sends data to the Writable Stream.                      |
| `end()`                   | Signals that no more data will be written.              |
| `destroy()`               | Terminates the stream.                                  |
| `writableEnded`           | Indicates whether `end()` has been called.              |
| `writableFinished`        | Indicates whether writing has completed.                |
| `finish`                  | Indicates successful completion of the writing process. |
| `close`                   | Indicates that stream resources have been closed.       |
| `error`                   | Indicates that an error occurred.                       |

---

## 12. Practical Exercise

Create a file named `closingWritableStreams.js` and experiment with the following:

- Create a Writable Stream using `fs.createWriteStream()`.
- Write multiple chunks using `write()`.
- Call `end()` after writing all chunks.
- Pass a final chunk directly to `end()`.
- Listen for the `finish` event.
- Listen for the `close` event.
- Inspect `writableEnded` before and after calling `end()`.
- Inspect `writableFinished` inside the `finish` event.
- Destroy a stream before normal completion.
- Observe the difference between normal completion and premature destruction.
- Handle errors using the `error` event.

---

## 13. Key Takeaways

- The `end()` method signals that no more data will be written.
- The `finish` event indicates that all submitted data has been processed successfully.
- The `close` event indicates that the stream's underlying resources have been closed.
- The `destroy()` method terminates stream operations.
- `writableEnded` indicates whether `end()` has been called.
- `writableFinished` indicates whether the writing process has completed.
- `finish` and `close` represent different stages of the Writable Stream lifecycle.
- Use `end()` for normal completion and `destroy()` for premature termination.

---

## 14. Official Documentation

- [Node.js – Writable Streams](https://nodejs.org/api/stream.html#writable-streams)
- [Node.js – writable.end()](https://nodejs.org/api/stream.html#writableendchunk-encoding-callback)
- [Node.js – finish Event](https://nodejs.org/api/stream.html#event-finish)
- [Node.js – close Event](https://nodejs.org/api/stream.html#event-close)
- [Node.js – writable.destroy()](https://nodejs.org/api/stream.html#writabledestroyerror)
- [Node.js – Writable Properties](https://nodejs.org/api/stream.html#writable-properties)
