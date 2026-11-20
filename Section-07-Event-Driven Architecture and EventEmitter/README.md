# Section 07 – Event-Driven Architecture and EventEmitter in Node.js

## Overview

This section explores the fundamentals of event-driven programming and how Node.js uses events to handle asynchronous operations.

We begin by understanding the difference between CPU operations and I/O operations, followed by an exploration of asynchronous I/O in Node.js. Then, we examine Event-Driven Architecture, learn how the built-in `EventEmitter` class works, and implement a custom EventEmitter to understand its internal behavior.

## Learning Objectives

By completing this section, you will understand how to:

- Differentiate between CPU-bound operations and I/O-bound operations.
- Understand how asynchronous I/O works in Node.js.
- Understand the fundamentals of Event-Driven Architecture.
- Explain how events enable communication between different parts of an application.
- Work with the built-in `EventEmitter` class in Node.js.
- Create, listen to, and emit custom events.
- Understand event listeners and event handling.
- Implement a custom EventEmitter to understand its underlying mechanism.

## Key Concepts Covered

- CPU Operations
- I/O Operations
- CPU-Bound vs. I/O-Bound Tasks
- Asynchronous I/O
- Non-Blocking I/O
- Event-Driven Architecture
- Events and Event Listeners
- EventEmitter in Node.js
- Event Creation and Emission
- Event Handling
- Custom EventEmitter Implementation

## Chapter List

|   # | Chapter                            | Type  | Duration |
| --: | ---------------------------------- | ----- | -------: |
|  01 | CPU Operations VS I/O Operations   | Video |    7 min |
|  02 | Async IO in Node.js                | Video |   21 min |
|  03 | What is Event Driven Architecture? | Video |   22 min |
|  04 | EventEmitter in Node.js            | Video |   27 min |
|  05 | Custom EventEmitter                | Video |   15 min |

**Total Chapters:** 5  
**Total Video Duration:** 1h 32m

## Section Structure

```text
Section-07-Event-Driven-Architecture-and-EventEmitter/
│
├── README.md
│
├── 01-CPU-Operations-VS-IO-Operations/
│   ├── README.md
│   └── cpuVsIoOperations.js
│
├── 02-Async-IO-in-Node.js/
│   ├── README.md
│   └── asyncIO.js
│
├── 03-Event-Driven-Architecture/
│   ├── README.md
│   └── eventDrivenArchitecture.js
│
├── 04-EventEmitter-in-Node.js/
│   ├── README.md
│   └── eventEmitter.js
│
└── 05-Custom-EventEmitter/
    ├── README.md
    └── customEventEmitter.js
```

**Note:** The folder and file names above are suggested conventions. You can adjust them based on the actual implementation and examples covered in each lesson.

## Progress

- **Status:** Not Started
- **Completed Chapters:** 0 / 5
- **Remaining Chapters:** 5 / 5
- **Video Duration:** 1h 32m

## Learning Philosophy

The goal of this section is to understand how Node.js uses events to coordinate asynchronous operations and enable communication between different components.

Focus on understanding the relationship between I/O operations, asynchronous execution, and event-driven programming. Experiment with the built-in `EventEmitter`, then build a custom implementation to understand how event registration, emission, and listener management work internally.

These concepts are important for understanding Node.js internals and building event-driven applications.

---

**Learn. Build. Understand. Repeat.**
