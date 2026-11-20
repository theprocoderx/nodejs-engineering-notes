# Node.js Streams

## Overview

This section covers Node.js Streams, including how streams handle data efficiently and how to process data without loading everything into memory at once.

It explores the internal workings of Readable and Writable streams, buffering, backpressure, piping, file descriptors, and stream-based file operations.

## Learning Objectives

- Understand the fundamentals and types of streams in Node.js.
- Work with Readable and Writable streams.
- Understand the different states and internal buffering mechanisms of Readable and Writable streams.
- Learn about backpressure and how to handle it.
- Understand piping and `pipeline()`.
- Explore Duplex, Transform, and PassThrough streams.
- Work with standard input, output, and error streams.
- Understand file descriptors and file operations.
- Compare the performance of streams and file operations.
- Implement internal buffering in custom streams.
- Work with files and streams using Promises.
- Understand how browsers use streams and explore Streams in JavaScript.

## Key Concepts Covered

- Stream fundamentals and stream types.
- Readable and Writable streams.
- Internal buffering and `highWaterMark`.
- Backpressure and flow control.
- Stream states and lifecycle events.
- Piping and `pipeline()`.
- Duplex, Transform, and PassThrough streams.
- Standard input, output, and error streams.
- File descriptors and low-level file operations.
- Stream performance and memory efficiency.
- Custom stream implementations.
- Promise-based file and stream operations.
- Web Streams API and browser streams.

## Chapter List

|   # | Chapter                                              | Video Duration |
| --: | ---------------------------------------------------- | -------------: |
|  01 | Introduction to Streams                              |         28 min |
|  02 | Types of Streams in Node.js                          |         10 min |
|  03 | Readable Streams                                     |          1h 4m |
|  04 | Different States of Readable Streams                 |         33 min |
|  05 | Internal Buffer of Readable Streams                  |         17 min |
|  06 | More About Readable Streams                          |         21 min |
|  07 | Writable Streams                                     |         17 min |
|  08 | Backpressure and Internal Buffer of Writable Streams |         30 min |
|  09 | Closing Writable Streams                             |         10 min |
|  10 | States of Writable Streams                           |         10 min |
|  11 | Piping Streams                                       |         14 min |
|  12 | Piping Using Pipeline                                |          6 min |
|  13 | Duplex, Transform and Passthrough Streams            |         13 min |
|  14 | Data Streams                                         |         43 min |
|  15 | Piping and Redirection of Data Streams               |         13 min |
|  16 | Writing One Lakh Numbers                             |         21 min |
|  17 | Why Streams Are So Fast?                             |         12 min |
|  18 | What Is a File Descriptor?                           |          8 min |
|  19 | Reading File with File Descriptor                    |         16 min |
|  20 | Opening Files in Different Modes                     |          7 min |
|  21 | Writing to a File with File Descriptor               |          9 min |
|  22 | Write One Lakh Numbers Faster than Streams           |         11 min |
|  23 | Implementing Internal Buffer in Our Custom Stream    |         52 min |
|  24 | Handling Files Using Promises                        |         15 min |
|  25 | Working with Streams Using Promises                  |         10 min |
|  26 | How Browsers Use Streams?                            |         28 min |
|  27 | Streams in JavaScript                                |  Not specified |

**Total Chapters:** 27

**Total Video Duration:** 9h 16m (excluding Chapter 27)

## Section Structure

```text
Section-08-Node.js-Streams/
│
├── README.md
│
├── 01-Introduction-to-Streams/
│   ├── README.md
│   └── introduction.js
│
├── 02-Types-of-Streams-in-Node.js/
│   ├── README.md
│   └── typesOfStreams.js
│
├── 03-Readable-Streams/
│   ├── README.md
│   └── readableStreams.js
│
├── 04-Different-States-of-Readable-Streams/
│   ├── README.md
│   └── differentStatesOfReadableStreams.js
│
├── 05-Internal-Buffer-of-Readable-Streams/
│   ├── README.md
│   └── internalBuffer.js
│
├── 06-More-About-Readable-Streams/
│   ├── README.md
│   └── moreAboutReadableStreams.js
│
├── 07-Writable-Streams/
│   ├── README.md
│   └── writableStreams.js
│
├── 08-Backpressure-and-Internal-Buffer-of-Writable-Streams/
│   ├── README.md
│   └── backpressure.js
│
├── 09-Closing-Writable-Streams/
│   ├── README.md
│   └── closingWritableStreams.js
│
├── 10-States-of-Writable-Streams/
│   ├── README.md
│   └── statesOfWritableStreams.js
│
├── 11-Piping-Streams/
│   ├── README.md
│   └── pipingStreams.js
│
├── 12-Piping-Using-Pipeline/
│   ├── README.md
│   └── pipeline.js
│
├── 13-Duplex-Transform-and-Passthrough-Streams/
│   ├── README.md
│   └── duplexTransformAndPassthrough.js
│
├── 14-Data-Streams/
│   ├── README.md
│   └── dataStreams.js
│
├── 15-Piping-and-Redirection-of-Data-Streams/
│   ├── README.md
│   └── pipingAndRedirection.js
│
├── 16-Writing-One-Lakh-Numbers/
│   ├── README.md
│   └── writingOneLakhNumbers.js
│
├── 17-Why-Streams-Are-So-Fast/
│   ├── README.md
│   └── whyStreamsAreFast.js
│
├── 18-What-Is-a-File-Descriptor/
│   ├── README.md
│   └── fileDescriptor.js
│
├── 19-Reading-File-with-File-Descriptor/
│   ├── README.md
│   └── readingFileWithFileDescriptor.js
│
├── 20-Opening-Files-in-Different-Modes/
│   ├── README.md
│   └── openingFilesInDifferentModes.js
│
├── 21-Writing-to-a-File-with-File-Descriptor/
│   ├── README.md
│   └── writingWithFileDescriptor.js
│
├── 22-Write-One-Lakh-Numbers-Faster-than-Streams/
│   ├── README.md
│   └── writingOneLakhNumbersFaster.js
│
├── 23-Implementing-Internal-Buffer-in-Our-Custom-Stream/
│   ├── README.md
│   └── customStreamBuffer.js
│
├── 24-Handling-Files-Using-Promises/
│   ├── README.md
│   └── handlingFilesWithPromises.js
│
├── 25-Working-with-Streams-Using-Promises/
│   ├── README.md
│   └── streamsWithPromises.js
│
├── 26-How-Browsers-Use-Streams/
│   ├── README.md
│   └── browserStreams.js
│
└── 27-Streams-in-JavaScript/
    ├── README.md
    └── streamsInJavaScript.js
```

_Note: The folder and JavaScript filenames above are suggested conventions. Adjust them to match your actual files and implementations._

## Progress

**Status:** In Progress

| Metric             | Count |
| ------------------ | ----: |
| Total Chapters     |    27 |
| Completed Chapters |     0 |
| Remaining Chapters |    27 |
| Completion         |    0% |

Progress will be updated as I complete each chapter.

## Performance Experiments

Performance-related chapters provide opportunities to explore how Node.js handles file operations, buffering, and data processing.

Where applicable, document the following observations:

- Execution time and benchmark results.
- Memory consumption.
- Buffer sizes and `highWaterMark` configurations.
- File I/O performance.
- Differences between streams and direct file operations.
- Performance trade-offs between different implementations.

For reproducible experiments, record the Node.js version, input size, implementation approach, and relevant system configuration alongside benchmark results.

## Learning Philosophy

Understand the concepts, explore the internals, experiment with code, and build practical implementations.

Focus on understanding how Node.js streams work internally rather than simply memorizing APIs.

---

**Learn. Build. Understand. Repeat.**
