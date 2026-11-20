import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [, , sourceArg, destArg] = process.argv;

async function copyFile(source, destination) {
  try {
    // 1. Resolve the source and destination paths
    const sourcePath = resolve(source);
    const destinationPath = resolve(destination);

    // 2. Read the source file into a Buffer
    const contentBuffer = await readFile(sourcePath);

    // 3. Write the Buffer to the destination file
    await writeFile(destinationPath, contentBuffer);

    console.log(`Successfully copied "${source}" to "${destination}"`);
  } catch (error) {
    console.error(`Failed to copy file: ${error.message}`);
  }
}

// node copy.js <source> <destination>
if (!sourceArg || !destArg) {
  console.log('Usage: node copy.js <source-file-path> <destination-file-path>');
} else {
  copyFile(sourceArg, destArg);
}
