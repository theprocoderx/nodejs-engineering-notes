# Different States of Writable Streams in Node.js

## 1. Introduction

A Writable Stream in Node.js can exist in different states during its lifecycle, depending on whether it is accepting data, processing queued data, or has completed or terminated its writing operation.

Understanding these states is important because they help us determine:

- Whether a stream is still accepting new data.
- Whether the writing process has completed.
- Whether the stream has been destroyed.
- Whether pending data remains in the internal buffer.
- Whether the underlying resources have been closed.

Node.js provides several properties that help us inspect the current state of a Writable Stream.

---

## 2. Important Writable Stream State Properties

The following properties are particularly useful for understanding a Writable Stream's lifecycle.

| Property                | Description                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `writable`              | Indicates whether the stream is still valid for writing.                                                                |
| `writableEnded`         | Indicates whether `end()` has been called.                                                                              |
| `writableFinished`      | Indicates whether all data has been flushed to the underlying system, immediately before the `finish` event is emitted. |
| `writableLength`        | Returns the number of bytes or objects currently queued for writing.                                                    |
| `writableNeedDrain`     | Indicates whether the stream needs to emit `drain` before more data should be written.                                  |
| `writableHighWaterMark` | Returns the configured high-water mark for the stream.                                                                  |
| `destroyed`             | Indicates whether `destroy()` has been called.                                                                          |
| `closed`                | Indicates whether the stream has been closed.                                                                           |

**Important:** These properties describe different aspects of a stream's state. They should not be treated as interchangeable.

---

## 3. Understanding the Writable Stream States

Let's examine the important stages of a Writable Stream's lifecycle.

### 3.1 Initial State

When a Writable Stream is created, it is ready to accept data.

```js
import { Writable } from 'node:stream';

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

console.log('writable:', writable.writable);
console.log('writableEnded:', writable.writableEnded);
console.log('writableFinished:', writable.writableFinished);
console.log('destroyed:', writable.destroyed);
```

**Output:**

```text
writable: true
writableEnded: false
writableFinished: false
destroyed: false
```

At this stage:

- The stream can accept data.
- `end()` has not been called.
- Writing has not finished.
- The stream has not been destroyed.

### 3.2 Writing State

When we call `write()`, data is submitted to the Writable Stream.

```js
writable.write('Hello Node.js');
```

The stream processes the data through its internal `_write()` implementation.

During writing:

- The stream accepts data if it is still writable.
- Data may be queued in the internal buffer.
- The `_write()` implementation processes the submitted chunk.
- The callback signals that processing of that chunk has completed.

The `writableLength` property helps us inspect the amount of data currently queued.

```js
console.log(writable.writableLength);
```

**Note:** The value can change quickly because the stream processes queued writes asynchronously.

### 3.3 Ending State

Calling `end()` tells the Writable Stream that no more data will be written.

```js
writable.end();
```

After calling `end()`:

```js
console.log(writable.writableEnded);
```

**Output:**

```text
true
```

Important points:

- The stream no longer accepts additional writes.
- Previously submitted writes are allowed to complete.
- The stream moves toward normal completion.
- The `finish` event is emitted after all submitted data has been processed.

### 3.4 Finished State

A Writable Stream emits the `finish` event when all data has been processed after `end()` has been called.

```js
writable.on('finish', () => {
  console.log('Writing completed');
  console.log('writableFinished:', writable.writableFinished);
});
```

**Output:**

```text
Writing completed
writableFinished: true
```

At this stage:

- The normal writing process has completed.
- All submitted data has been processed by the Writable implementation.
- The `writableFinished` property becomes `true`.

**Important:** The `finish` event does not necessarily guarantee that data has been physically persisted to durable storage. For stronger filesystem durability guarantees, additional operations such as `fsync` may be required.

### 3.5 Destroyed State

A Writable Stream can be terminated before its normal lifecycle completes by calling `destroy()`.

```js
writable.destroy();
```

After destruction:

```js
console.log(writable.destroyed);
```

**Output:**

```text
true
```

Important points:

- The stream is no longer usable for writing.
- Pending operations may be interrupted.
- The `error` event may be emitted if an error is supplied to `destroy(error)`.
- The `close` event is generally emitted when the stream is closed, depending on its implementation and configuration.
- A stream destroyed before normal completion does not emit `finish` as a successful completion event.

---

## 4. Practical Example: Observing Writable Stream States

The following example demonstrates how the state properties change throughout the Writable Stream lifecycle.

```js
import { Writable } from 'node:stream';

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log(`Writing: ${chunk.toString()}`);
    callback();
  },
});

// Initial state
console.log('Initial state:');
console.log('writable:', writable.writable);
console.log('writableEnded:', writable.writableEnded);
console.log('writableFinished:', writable.writableFinished);
console.log('destroyed:', writable.destroyed);

// Writing data
writable.write('Hello');
writable.write(' Node.js');

// Ending the stream
writable.end(' Streams');

// Finished event
writable.on('finish', () => {
  console.log('\nFinished state:');
  console.log('writable:', writable.writable);
  console.log('writableEnded:', writable.writableEnded);
  console.log('writableFinished:', writable.writableFinished);
  console.log('destroyed:', writable.destroyed);
});

// Close event
writable.on('close', () => {
  console.log('\nClose event emitted');
});
```

**Expected output:**

```text
Initial state:
writable: true
writableEnded: false
writableFinished: false
destroyed: false

Writing: Hello
Writing:  Node.js
Writing:  Streams

Finished state:
writable: false
writableEnded: true
writableFinished: true
destroyed: true

Close event emitted
```

**Note:** The exact lifecycle events and the value of `destroyed` depend on the stream implementation and its `autoDestroy` configuration. Modern Node.js Writable streams commonly enable automatic destruction after successful completion. The example demonstrates the default behavior.

---

## 5. Difference Between Writable Stream State Properties

Some properties may appear similar, but they represent different conditions.

| Property            | What it tells us                                                     |
| ------------------- | -------------------------------------------------------------------- |
| `writable`          | Whether the stream can currently accept writes.                      |
| `writableEnded`     | Whether `end()` has been called.                                     |
| `writableFinished`  | Whether writing has completed successfully up to the `finish` event. |
| `destroyed`         | Whether the stream has been destroyed.                               |
| `closed`            | Whether the stream has been closed.                                  |
| `writableLength`    | How much data is currently queued.                                   |
| `writableNeedDrain` | Whether the stream is waiting for its buffer to drain.               |

### Important distinctions

**`writableEnded` vs `writableFinished`**

- `writableEnded` becomes `true` when `end()` is called.
- `writableFinished` becomes `true` when the writing process completes, immediately before the `finish` event.

**`writableFinished` vs `destroyed`**

- `writableFinished` indicates normal writing completion.
- `destroyed` indicates that the stream has been destroyed, which can happen after successful completion or due to premature termination.

**`writable` vs `writableEnded`**

- `writable` indicates whether the stream can accept writes.
- `writableEnded` indicates whether the ending process has been initiated.

---

## 6. Writable Stream Lifecycle Overview

The following diagram illustrates a simplified Writable Stream lifecycle.

```text
       Stream Created
             |
             v
       Initial State
             |
             v
       Writing Data
             |
             v
        end() called
             |
             v
     Pending Writes Processed
             |
             v
       finish Event
             |
             v
      Automatic Destruction
             |
             v
        close Event
```

A stream can also be destroyed before normal completion:

```text
       Writing Data
             |
             v
       destroy() called
             |
             v
       Stream Destroyed
             |
             v
         close Event
```

The second path represents premature termination rather than successful completion.

---

## 7. Key Takeaways

- Writable Streams have several lifecycle states.
- `writable` indicates whether the stream can accept more data.
- `writableEnded` becomes `true` after calling `end()`.
- `writableFinished` indicates that the writing process has completed.
- `destroyed` indicates that the stream has been destroyed.
- `closed` indicates that the stream has been closed.
- `writableLength` helps monitor queued data.
- `writableNeedDrain` helps identify when backpressure requires the producer to wait.
- `finish` represents normal writing completion, whereas `close` represents resource closure.
- Understanding these properties helps us implement reliable stream handling and error management.

---

## 8. Official Node.js Documentation

- [Writable Streams](https://nodejs.org/api/stream.html#writable-streams)
- [Writable Properties](https://nodejs.org/api/stream.html#three-properties-that-are-useful-for-writing-streams)
- [Writable.writable](https://nodejs.org/api/stream.html#writablewritable)
- [Writable.writableEnded](https://nodejs.org/api/stream.html#writablewritableended)
- [Writable.writableFinished](https://nodejs.org/api/stream.html#writablewritablefinished)
- [Writable.destroyed](https://nodejs.org/api/stream.html#writabledestroyed)
- [Writable.closed](https://nodejs.org/api/stream.html#writableclosed)
