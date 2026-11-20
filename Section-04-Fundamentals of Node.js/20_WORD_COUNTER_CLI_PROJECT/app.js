import { readFile } from 'node:fs/promises';

const filePath = process.argv[2];
const targetWord = process.argv[3] ? process.argv[3].toLowerCase() : null;
if (!filePath) {
  console.error(
    'Please provide a file path. Example: node counter.js sample.txt'
  );
  process.exit(1);
}

try {
  const fileContent = await readFile(filePath, 'utf-8');

  const wordsArray = fileContent
    .toLowerCase()
    .split(/[\W]/)
    .filter((w) => w);
  if (!wordsArray) {
    console.log('No words found in the file.');
    process.exit(0);
  }
  if (targetWord) {
    const count = wordsArray.filter((word) => word === targetWord).length;
    console.log(
      `"${targetWord}" appears ${count} time${count === 1 ? '' : 's'}.`
    );
  } else {
    const wordsCount = {};

    wordsArray.forEach((word) => {
      if (word in wordsCount) {
        wordsCount[word] += 1;
      } else {
        wordsCount[word] = 1;
      }
    });
    console.log(wordsCount);
  }
} catch (error) {
    console.error(`Error reading file: ${error.message}`);
}
