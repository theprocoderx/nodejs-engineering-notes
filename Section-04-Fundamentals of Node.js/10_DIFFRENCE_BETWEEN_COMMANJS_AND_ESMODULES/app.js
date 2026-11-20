// const timer = require('./timer.js');
// In this situation require function its self load and search file and these all work is done in side javascript main thread.

import timer from './timer.js';

// COMMON JS MODULES //
// Synchronous file loading
// cjs imports are not hoisted
// Top level await is not allowed
// Only one value can be exported in cjs
// 'use strict' mode is not enabled by default
// file extension is optional
// If we give full file path then we can load any file using cjs
// It is a convention to add cjs in the file extension
// It is optional to  set "type": "commonjs" in package.json because commonjs is the default module system of Node.js.
// In cjs this keyword points to module.exports by default
// _filename, _dirname are accessed by using _filename, and _dirname

// ES6 MODULES //
// Asynchronous file loading
// mjs imports are hoisted
// Top level await is allowed
// multiple value can be exported in mjs
// 'use strict' mode is enabled by default

// file extension is mandatory
// We can not load any file, only js and mjs files are allowed
// It is a convention to add mjs in the file extension
// We have to set "type": "module" in package.json\
// In cjs this keyword is undefined
// filename and dirname are accessed by using import.meta.filename and import.meta.dirname
//
