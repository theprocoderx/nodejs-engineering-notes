# Different States of Readable Streams in Node.js

## 1. Introduction

A Readable Stream in Node.js can operate in different reading states depending on how data is consumed.

Understanding these states is important because they determine:

- When data is consumed.
- How chunks are delivered to the consumer.
- Whether data is automatically read.
- How we control the flow of incoming data.

Node.js Readable Streams have three possible values for the `readableFlowing` property:

1. `null` – Initial state.
2. `false` – Paused mode.
3. `true` – Flowing mode.

---

## 2. Understanding `readableFlowing`

The `readableFlowing` property indicates the current reading mode of a Readable Stream.

### Syntax

```js
readableStream.readableFlowing;
```

It returns one of three values:

| Value   | State         | Description                                           |
| ------- | ------------- | ----------------------------------------------------- |
| `null`  | Initial state | No mechanism has been selected to consume the stream  |
| `false` | Paused mode   | Data is not automatically delivered to the consumer   |
| `true`  | Flowing mode  | Data is automatically delivered through `data` events |

---

## 3. Initial State (`null`)

When a Readable Stream is created, its `readableFlowing` property is initially `null`.

At this point, the stream has not entered flowing or paused mode.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

console.log(readableStream.readableFlowing);
```

### Output

```text
null
```

The stream remains in this initial state until a mechanism for consuming data is selected.

For example:

- Adding a `data` event listener switches the stream into flowing mode.
- Calling `pause()` switches it into paused mode.
- Adding a `readable` event listener switches it into paused mode.

---

## 4. Flowing Mode (`true`)

In flowing mode, data is automatically read from the underlying system and delivered to the consumer through `data` events.

The stream continuously makes data available as quickly as possible, subject to its buffering and backpressure behavior.

### How to Enter Flowing Mode

A Readable Stream can enter flowing mode through mechanisms such as:

- Adding a `data` event listener.
- Calling `resume()`.
- Calling `pipe()` to connect it to a Writable Stream.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

console.log(readableStream.readableFlowing);
```

### Output

```text
true
```

### Key Characteristics

- Data is delivered automatically.
- The `data` event is used to receive chunks.
- The consumer does not need to call `read()` manually for each chunk.
- Calling `pause()` can stop automatic data delivery.

---

## 5. Paused Mode (`false`)

In paused mode, data is not automatically delivered through `data` events.

Instead, data remains available in the internal buffer until the consumer explicitly reads it using the `read()` method.

### How to Enter Paused Mode

A Readable Stream can enter paused mode through mechanisms such as:

- Calling `pause()`.
- Adding a `readable` event listener.
- Calling `unpipe()` when it removes the final pipe destination, provided the stream is not otherwise flowing.

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.pause();

console.log(readableStream.readableFlowing);
```

### Output

```text
false
```

### Reading Data Manually

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

readableStream.on('readable', () => {
  let chunk;

  while ((chunk = readableStream.read()) !== null) {
    console.log(chunk.toString());
  }
});
```

### Key Characteristics

- Data is not automatically delivered through `data` events.
- The consumer controls when data is read.
- The `read()` method retrieves available data from the internal buffer.
- The `readable` event indicates that data is available to be read.

---

## 6. Switching Between Flowing and Paused Modes

A Readable Stream can switch between flowing and paused modes during its lifecycle.

Node.js provides two important methods:

| Method     | Description                                      |
| ---------- | ------------------------------------------------ |
| `pause()`  | Stops the stream from emitting `data` events     |
| `resume()` | Resumes flowing mode and automatic data delivery |

### Example

```js
import fs from 'node:fs';

const readableStream = fs.createReadStream('./example.txt');

console.log('Initial:', readableStream.readableFlowing);

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

console.log('After data listener:', readableStream.readableFlowing);

readableStream.pause();

console.log('After pause:', readableStream.readableFlowing);

readableStream.resume();

console.log('After resume:', readableStream.readableFlowing);
```

### Expected State Transitions

```text
Initial: null
After data listener: true
After pause: false
After resume: true
```

**Note:** The output demonstrates the expected synchronous state changes. Actual chunk delivery and stream completion happen asynchronously.

---

## 7. State Transition Diagram

```text
                  Stream Created
                        |
                        v
                  Initial State
                     null
                        |
             +----------+----------+
             |                     |
         data listener          pause()
         resume()               readable listener
         pipe()                    |
             |                     |
             v                     v
       Flowing Mode           Paused Mode
          true                   false
             ^                     |
             |                     |
             +------ resume() -----+
                       |
                       |
                  pause()
                       |
                       v
                 Paused Mode
```

---

## 8. Important Differences

| Feature               | Initial (`null`)     | Paused (`false`)          | Flowing (`true`)   |
| --------------------- | -------------------- | ------------------------- | ------------------ |
| Data consumption mode | Not selected         | Manual                    | Automatic          |
| `data` events         | Not flowing          | Not automatically emitted | Emitted            |
| `read()`              | Can be called        | Used to consume data      | Can also be called |
| `pause()`             | Can switch to paused | Remains paused            | Switches to paused |
| `resume()`            | Switches to flowing  | Switches to flowing       | Remains flowing    |

**Important:** These states describe the stream's reading mode, not whether the stream has finished or whether its underlying resource is open.

---

## 9. Practical Exercise

Create a file named `readableStreamStates.js` and experiment with the following:

- [ ] Create a Readable Stream using `fs.createReadStream()`.
- [ ] Check its initial `readableFlowing` value.
- [ ] Add a `data` event listener and inspect the value.
- [ ] Call `pause()` and inspect the value.
- [ ] Call `resume()` and inspect the value.
- [ ] Use the `readable` event and observe the state.
- [ ] Compare automatic and manual data consumption.

---

## 10. Key Takeaways

- Readable Streams have three possible `readableFlowing` values: `null`, `false`, and `true`.
- `null` represents the initial state, where the consumption mode has not yet been selected.
- `false` represents paused mode, where data is not automatically delivered.
- `true` represents flowing mode, where data is automatically delivered through `data` events.
- `pause()` switches a flowing stream into paused mode.
- `resume()` switches a paused stream into flowing mode.
- The `readable` event is commonly used for manually consuming data.
- A stream's reading mode can change during its lifecycle.

---

## 11. Official Documentation

- [Node.js – Three States](https://nodejs.org/api/stream.html#three-states)
- [Node.js – Two Modes](https://nodejs.org/api/stream.html#two-modes)
- [Node.js – Readable.readableFlowing](https://nodejs.org/api/stream.html#readablereadableflowing)

**Next Chapter:** Consuming Readable Streams in Node.js
