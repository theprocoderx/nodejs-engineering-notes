import fs from 'node:fs';

const writableStream = fs.createWriteStream('large-output.txt', {
  highWaterMark: 16 * 1024,
});

let index = 0;
const totalLines = 100_000;

function writeData() {
  let canContinue = true;

  while (index < totalLines && canContinue) {
    const line = `This is line ${(index + 1, canContinue)}\n`;

    canContinue = writableStream.write(line);
    // Yahan terminal me check karo ki kis line par false hua
    if (!canContinue) {
      console.log(
        `⚠️ Buffer full ho gaya! Line number ${index + 1} par write() ne false return kiya.`
      );
    }
    index++;
  }

  if (index < totalLines) {
    writableStream.once('drain', writeData);
  } else {
    writableStream.end();
  }
}

writableStream.on('finish', () => {
  console.log('File writing completed!');
});

writableStream.on('error', (error) => {
  console.error('Stream error:', error.message);
});

writeData();
