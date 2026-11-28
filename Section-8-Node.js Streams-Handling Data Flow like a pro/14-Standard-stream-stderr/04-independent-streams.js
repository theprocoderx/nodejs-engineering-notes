process.stdout.write("Application started.\n");

process.stderr.write("Warning: Configuration is missing.\n");

process.stdout.write("Processing data...\n");

process.stderr.write("Warning: One record was skipped.\n");

process.stdout.write("Application completed.\n");


// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 04-independent-streams.js
// Application started.
// Warning: Configuration is missing.
// Processing data...
// Warning: One record was skipped.
// Application completed.

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 04-independent-streams.js > output.txt
// Warning: Configuration is missing.
// Warning: One record was skipped.

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 04-independent-streams.js 2> errors.txt
// Application started.
// Processing data...
// Application completed.

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ 


// This experiment demonstrates that stdout and stderr are independent destinations.

// Important: Although the streams are separate, their terminal display order is not guaranteed to reflect the exact order of writes in your JavaScript code. Different buffering and operating-system behavior can affect when each stream becomes visible.