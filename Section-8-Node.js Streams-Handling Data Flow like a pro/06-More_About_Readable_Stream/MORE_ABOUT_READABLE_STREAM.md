# More About Readable Streams in Node.js

## 1. Introduction

Node.js Readable Streams provide several properties, methods, and events that allow us to control how data is read and consumed.

In previous chapters, we explored:

- What are Readable Streams?
- Creating Readable Streams.
- Different States of Readable Streams.
- Internal Buffer of Readable Streams.

In this chapter, we will explore additional properties, methods, and behaviors of Readable Streams to understand how they work in more detail.

Understanding these concepts is important for building efficient applications that process large amounts of data without loading everything into memory.

---

## 2. Important Readable Stream Properties

Node.js provides several properties to inspect the current state and configuration of a Readable Stream.

| Property                | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `readable`              | Indicates whether the stream is still readable.                      |
| `readableFlowing`       | Indicates the current reading mode: `null`, `false`, or `true`.      |
| `readableEnded`         | Indicates whether the `end` event has been emitted.                  |
| `readableLength`        | Returns the number of items currently stored in the internal buffer. |
| `readableHighWaterMark` | Returns the configured high-water mark.                              |
| `readableObjectMode`    | Indicates whether the stream operates in object mode.                |
| `destroyed`             | Indicates whether the stream has been destroyed.                     |

### Example

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

console.log('Readable:', readableStream.readable);
console.log('Flowing:', readableStream.readableFlowing);
console.log('Ended:', readableStream.readableEnded);
console.log('Length:', readableStream.readableLength);
console.log('High Water Mark:', readableStream.readableHighWaterMark);
console.log('Object Mode:', readableStream.readableObjectMode);
console.log('Destroyed:', readableStream.destroyed);
```

**Note:** Property values can change during the stream lifecycle. For example, `readableLength` changes as chunks enter and leave the internal buffer.

---

## 3. Important Readable Stream Methods

Readable Streams provide several methods to control and consume incoming data.

| Method          | Description                                        |
| --------------- | -------------------------------------------------- |
| `read()`        | Reads data from the internal buffer.               |
| `pause()`       | Stops automatic data delivery in flowing mode.     |
| `resume()`      | Resumes flowing mode.                              |
| `isPaused()`    | Checks whether the stream is currently paused.     |
| `pipe()`        | Connects a Readable Stream to a Writable Stream.   |
| `unpipe()`      | Removes a Writable Stream destination.             |
| `destroy()`     | Destroys the stream and optionally emits an error. |
| `setEncoding()` | Sets the character encoding for received data.     |

### Example: Using `isPaused()`

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

console.log('Is Paused:', readableStream.isPaused());

readableStream.pause();

console.log('After pause:', readableStream.isPaused());

readableStream.resume();

console.log('After resume:', readableStream.isPaused());
```

**Expected output:**

```text
Is Paused: false
After pause: true
After resume: false
```

---

## 4. Understanding the `read()` Method

The `read()` method retrieves data from the internal buffer of a Readable Stream.

### Syntax

```javascript
readableStream.read([size]);
```

- `size`: Optional number of bytes to read in byte mode.
- Returns the retrieved data.
- Returns `null` when no data is available to read at that moment.

### Example

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('readable', () => {
  let chunk;

  while ((chunk = readableStream.read()) !== null) {
    console.log(chunk.toString());
  }
});
```

The `readable` event indicates that data is available to be consumed.

The `while` loop continues reading until `read()` returns `null`.

**Important:** Calling `read()` manually is commonly used with the `readable` event. Avoid mixing manual reading with flowing-mode consumption unless you understand how both consumption mechanisms interact.

---

## 5. Understanding `setEncoding()`

By default, Readable Streams return data as Buffer objects.

The `setEncoding()` method allows us to receive data as strings using a specified character encoding.

### Syntax

```javascript
readableStream.setEncoding(encoding);
```

### Example

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.setEncoding('utf8');

readableStream.on('data', (chunk) => {
  console.log(typeof chunk);
  console.log(chunk);
});
```

**Output:**

```text
string
Hello Node.js Streams!
```

Without `setEncoding()`, the received chunks are Buffer objects by default.

**Important:** Using `setEncoding()` also handles multi-byte characters correctly when characters are split across incoming chunks.

---

## 6. Understanding `destroy()`

The `destroy()` method destroys a Readable Stream and releases its underlying resources where applicable.

### Syntax

```javascript
readableStream.destroy([error]);
```

An optional error can be provided to indicate why the stream is being destroyed.

### Example

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());

  readableStream.destroy();
});

readableStream.on('close', () => {
  console.log('Stream closed');
});
```

**Output:**

```text
Hello Node.js Streams!
Stream closed
```

**Important:**

- Calling `destroy()` stops further stream operations.
- The `close` event indicates that the stream and its underlying resources have been closed.
- The `destroyed` property indicates whether the stream has been destroyed.
- Destroying a stream is different from normally completing it using `end()`.

---

## 7. Understanding `readableEnded`

The `readableEnded` property indicates whether the `end` event has been emitted.

### Example

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

console.log('Before reading:', readableStream.readableEnded);

readableStream.on('end', () => {
  console.log('After reading:', readableStream.readableEnded);
});
```

**Expected output:**

```text
Before reading: false
After reading: true
```

**Important:** The `end` event is emitted after all available data has been consumed. Simply receiving all underlying data does not necessarily mean that the `end` event has already been emitted.

---

## 8. Understanding `readableLength`

The `readableLength` property returns the number of bytes or objects currently stored in the internal buffer.

Its meaning depends on the stream's mode:

- In byte mode, it represents the number of buffered bytes.
- In object mode, it represents the number of buffered objects.

### Example

```javascript
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt', {
  highWaterMark: 10,
});

readableStream.on('readable', () => {
  console.log('Buffered length:', readableStream.readableLength);

  readableStream.read();
});
```

The buffered length changes as data is read from the internal buffer.

---

## 9. Practical Exercise

Create a file named `moreAboutReadableStreams.js` and experiment with the following:

- Inspect important Readable Stream properties.
- Check the `readableFlowing` state.
- Use `isPaused()` before and after calling `pause()`.
- Read data using the `read()` method.
- Use `setEncoding('utf8')`.
- Inspect `readableLength` while reading.
- Check `readableEnded` after the `end` event.
- Destroy a stream and observe the `close` event.

---

## 10. Key Takeaways

- Readable Streams provide properties to inspect their current state and configuration.
- The `read()` method retrieves data from the internal buffer.
- The `isPaused()` method checks whether a stream is paused.
- The `setEncoding()` method allows chunks to be received as strings.
- The `destroy()` method terminates stream operations.
- The `readableLength` property indicates the amount of buffered data.
- The `readableEnded` property indicates whether the `end` event has been emitted.
- Understanding these properties and methods helps us control Readable Streams more effectively.

---

## 11. Official Documentation

- [Node.js – Readable Streams](https://nodejs.org/api/stream.html#readable-streams)
- [Node.js – Readable Properties](https://nodejs.org/api/stream.html#readable-properties)
- [Node.js – Readable Methods](https://nodejs.org/api/stream.html#readable-methods)
