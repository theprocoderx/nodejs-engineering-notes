process.stdin.setEncoding("utf8");

let input = "";

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);

    const result = {
      ...data,
      processed: true,
    };

    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } catch (error) {
    process.stderr.write(`Invalid JSON: ${error.message}\n`);

    process.exitCode = 1;
  }
});

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ echo '{"name":"ProCoderX","role":"Developer"}' | node 05-json-processor.js
// {
//   "name": "ProCoderX",
//   "role": "Developer",
//   "processed": true
// }

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ node 05-json-processor.js < input.json
// {
//   "name": "ProCoderX",
//   "role": "Developer",
//   "processed": true
// }

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜ echo '{name: ProCoderX}' | node 05-json-processor.js > out.json 2> err.log

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜echo '{name: ProCoderX}' | node 05-json-processor.js
// Invalid JSON: Expected property name or '}' in JSON at position 1 (line 1 column 2)

// user@DESKTOP-UVPBEK7 MINGW64 14-Standard-stream-stderr  (main)➜
