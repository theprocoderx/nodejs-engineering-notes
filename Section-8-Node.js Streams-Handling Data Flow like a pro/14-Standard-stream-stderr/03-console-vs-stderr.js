console.log("Normal application output.");

console.info("Application information.");

console.warn("Warning: Configuration is missing.");

console.error("Error: File not found.");

// You will see all four messages in the terminal.

// But internally, their destinations differ.
// Why does this matter?
// Suppose you run:
// node 03-console-vs-stderr.js > output.txt
// The file will contain the normal output and informational messages.

// The warnings and errors will still go to stderr, which normally remains connected to the terminal.

// This gives you control over how application output and diagnostics are handled.

// Important: The console methods can also perform formatting and argument inspection. They are convenient logging interfaces, whereas process.stderr.write() gives you direct control over the data written to stderr.

//========= A. Redirect stdout using >    =======

// The result of terminal after running above command
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 03-console-vs-stderr.js > output.txt
// Warning: Configuration is missing.
// Error: File not found.
// node 03-console-vs-stderr.js > output.txt This redirects file descriptor 1 to output.txt.

// In other words:
// stdout (FD 1) → output.txt
// stderr (FD 2) → Terminal

// ========= B. Redirect stderr using 2>   =====

// The result of terminal after running above command
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 03-console-vs-stderr.js 2> errors.txt
// Normal application output.
// Application information.
// node 03-console-vs-stderr.js 2> errors.txt

// This redirects file descriptor 2 to errors.txt.

// Now:
// stdout (FD 1) → Terminal
// stderr (FD 2) → errors.txt

// ==============  C. Redirect both streams independently  =============

// The result of terminal after running above command
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 03-console-vs-stderr.js > output.txt 2> errors.txt

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜
// node node 03-console-vs-stderr.js > output.txt 2> errors.txt

// This is particularly useful for production command-line tools.

// Independent redirection

// Node.js process

// (FD 1)

// stdout

// output.txt

// (FD 2)

// stderr

// errors.txt

// Both streams are redirected to separate files.

// ========== D. Combine stdout and stderr using 2>&1 ========

// The result of terminal after running above command
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 03-console-vs-stderr.js > all-output.txt 2>&1
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜
// Sometimes you want to capture everything in one file.
// node 03-console-vs-stderr.js > all-output.txt 2>&1
// if you want both stdout and stderr in all-output.txt then use these above sequence
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 03-console-vs-stderr.js > all-output.txt 2>&1

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜

// node 03-console-vs-stderr.j 2>&1 > all-output.txt
// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 03-console-vs-stderr.js 2>&1 > all-output.txt
// Warning: Configuration is missing.
// Error: File not found.
// In the second command, stderr is first redirected to the original stdout destination. Then stdout is redirected to the file.

// Consequently, stderr does not follow stdout into the file.
