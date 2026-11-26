
import { PassThrough } from 'node:stream';

const passThrough = new PassThrough();

// Read data from the stream
passThrough.on('data', (chunk) => {
  console.log('Output:', chunk.toString());
});

// Write data into the stream
passThrough.write('Hello Node.js!\n');
passThrough.write('Learning PassThrough Streams!\n');

// Signal that no more data will be written
passThrough.end();
