# Fundamentals of Node.js

## Overview

This section introduces the core fundamentals of Node.js, focusing on its module systems, package management, and filesystem operations.

It covers the CommonJS module system, ES6 modules, the internal working of `module.exports`, `exports`, the `module` object, the module wrapper function, and the custom `require()` function.

It also explores the differences between CommonJS and ES6 modules, different types of Node.js modules, NPM packages, publishing packages to NPM, and understanding the `package.json` file in depth.

Additionally, this section introduces shebangs, CLI and library packages, local and global package installations, and how NPX works.

Finally, it explores the Node.js File System (FS) module through practical file operations, including reading, writing, renaming, deleting, moving, and copying files. It also includes a practical Word Counter CLI project.

By the end of this section, you will understand the essential building blocks of Node.js applications and how to work with modules, packages, and filesystem operations.

## Learning Objectives

- Understand the module system in Node.js and why modules are important.
- Learn the fundamentals of the CommonJS module system.
- Understand how `module.exports` and `exports` work.
- Explore the `module` object and its important properties.
- Understand the module wrapper function used internally by Node.js.
- Learn how the `require()` function works internally.
- Understand the fundamentals of ES6 modules.
- Learn how to access `__filename` and `__dirname` equivalents in ES6 modules.
- Understand why Node.js supports different module systems.
- Differentiate between CommonJS and ES6 modules.
- Understand the different types of modules available in Node.js.
- Learn how NPM modules work and how to use external packages.
- Understand how to publish packages to the NPM registry.
- Understand the structure and important properties of `package.json`.
- Learn what a shebang is and why it is used.
- Differentiate between library packages and CLI packages.
- Understand local and global package installations.
- Learn how NPX works and how it executes packages.
- Understand the purpose and functionality of NPX.
- Learn the fundamentals of the Node.js File System (FS) module.
- Build a practical Word Counter CLI application.
- Learn how to write data to files using Node.js.
- Perform common filesystem operations such as renaming, deleting, moving, and copying files.
- Develop a practical understanding of Node.js modules, package management, and filesystem operations.

## Key Concepts Covered

- Node.js Module System.
- CommonJS Module System.
- `require()`.
- `module.exports` vs. `exports`.
- The `module` object.
- Module wrapper function.
- Custom `require()` function.
- ES6 Modules (ESM).
- `import` and `export`.
- `import.meta.url`.
- Accessing filename and directory paths in ES6 modules.
- CommonJS vs. ES6 Modules.
- Different types of Node.js modules.
- Built-in modules.
- Local modules.
- Third-party modules.
- NPM (Node Package Manager).
- NPM packages and dependencies.
- Publishing packages to NPM.
- `package.json` and its properties.
- Shebang (`#!`).
- Library packages vs. CLI packages.
- Local vs. global package installation.
- NPX fundamentals.
- How NPX works.
- Node.js File System (FS) module.
- File reading and writing.
- Word Counter CLI project.
- File operations (rename, delete, move, and copy).
- Working with files and directories using Node.js.

## Chapter List

|   # | Chapter                                              | Type  | Duration |
| --: | ---------------------------------------------------- | ----- | -------: |
|  01 | Module System in Node.js                             | Video |    5 min |
|  02 | Introduction to CommonJS Module System               | Video |   38 min |
|  03 | Module.exports VS Exports                            | Video |   17 min |
|  04 | Module Object in Node.js                             | Video |   31 min |
|  05 | Module Wrapper Function                              | Video |   17 min |
|  06 | Custom Require Function                              | Video |   37 min |
|  07 | ES6 Modules                                          | Video |   20 min |
|  08 | Accessing filename and dirname in ES6 Modules        | Video |   20 min |
|  09 | Why Different Module Systems?                        | Video |    3 min |
|  10 | Difference Between CommonJS and ES6 Modules          | Video |   44 min |
|  11 | Different Types of Modules                           | Video |   16 min |
|  12 | NPM Modules                                          | Video |   20 min |
|  13 | Publishing Package on NPM                            | Video |   30 min |
|  14 | Understanding package.json File in Depth             | Video |   56 min |
|  15 | What Is Shebang?                                     | Video |   24 min |
|  16 | Library VS CLI Packages and Local VS Global Packages | Video |   17 min |
|  17 | How NPX Works?                                       | Video |    1h 6m |
|  18 | What Is NPX?                                         | Video |   42 min |
|  19 | Introduction to FS Module                            | Video |   42 min |
|  20 | Word Counter CLI Project                             | Video |   25 min |
|  21 | Writing to a File Using Node.js                      | Video |   33 min |
|  22 | Node.js File Operations: Rename, Delete, Move, Copy  | Video |   52 min |

**Total Chapters:** 22

**Total Video Duration:** 10h 55m

## Section Structure

This section is organized into 22 numbered chapters, following the original course curriculum.

Each chapter contains its own documentation, learning notes, code examples, and practical implementations wherever applicable.

```text
Section-04-Fundamentals-of-Node.js/
│
├── README.md
│
├── 01-Module-System-in-Node.js/
│   └── README.md
│
├── 02-Introduction-to-CommonJS-Module-System/
│   └── README.md
│
├── 03-Module-Exports-vs-Exports/
│   └── README.md
│
├── 04-Module-Object-in-Node.js/
│   └── README.md
│
├── 05-Module-Wrapper-Function/
│   └── README.md
│
├── 06-Custom-Require-Function/
│   └── README.md
│
├── 07-ES6-Modules/
│   └── README.md
│
├── 08-Accessing-Filename-and-Dirname-in-ES6-Modules/
│   └── README.md
│
├── 09-Why-Different-Module-Systems/
│   └── README.md
│
├── 10-Difference-Between-CommonJS-and-ES6-Modules/
│   └── README.md
│
├── 11-Different-Types-of-Modules/
│   └── README.md
│
├── 12-NPM-Modules/
│   └── README.md
│
├── 13-Publishing-Package-on-NPM/
│   └── README.md
│
├── 14-Understanding-package.json-File-in-Depth/
│   └── README.md
│
├── 15-What-Is-Shebang/
│   └── README.md
│
├── 16-Library-vs-CLI-Packages-and-Local-vs-Global-Packages/
│   └── README.md
│
├── 17-How-NPX-Works/
│   └── README.md
│
├── 18-What-Is-NPX/
│   └── README.md
│
├── 19-Introduction-to-FS-Module/
│   └── README.md
│
├── 20-Word-Counter-CLI-Project/
│   └── README.md
│
├── 21-Writing-to-a-File-Using-Node.js/
│   └── README.md
│
└── 22-Node.js-File-Operations/
    └── README.md
```

_Note: The folder names above are suggested conventions. Adjust them to match your actual files and implementations._

## Progress

**Status:** Not specified

| Metric             | Count |
| ------------------ | ----: |
| Total Chapters     |    22 |
| Completed Chapters |     — |
| Remaining Chapters |     — |
| Completion         |     — |

## Learning Philosophy

Build a strong understanding of Node.js fundamentals before moving toward more advanced backend development concepts.

Focus on understanding how modules work internally, why Node.js supports different module systems, and how packages are organized, installed, and executed.

Pay particular attention to the internal working of CommonJS, ES6 modules, the `require()` function, and package management tools such as NPM and NPX.

Apply these concepts through practical implementations, especially filesystem operations and the Word Counter CLI project.

Understand the underlying mechanisms rather than simply memorizing syntax or copying code.

---

**Learn. Build. Understand. Repeat.**
