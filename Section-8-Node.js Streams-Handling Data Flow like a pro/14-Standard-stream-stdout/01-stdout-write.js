process.stdout.write("Hello Node.js!\n");

process.stdout.write("Learning Writable Streams.\n");

process.stdout.write("Understanding process.stdout.\n");

// Notice that we manually add \n when using write().
// Because process.stdout.write() gives you more direct control over the output.
console.log("Hello Node.js");

// For example, you can display a progress indicator on the same terminal line:
process.stdout.write("Processing...");

process.stdout.write(" Done!\n");

// You can also overwrite the current terminal line using \r:
process.stdout.write("Processing 10%\r");
process.stdout.write("Processing 50%\r");
process.stdout.write("Processing 100%\n");

async function fakeDownload() {
  for (let p = 0; p <= 100; p += 2) {
    if (p < 100) {
      process.stdout.write(`Downloading... ${p}%\r`);
    } else {
      process.stdout.write(`Downloading ${p}% done!\n`); // last mein \n
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

fakeDownload();
