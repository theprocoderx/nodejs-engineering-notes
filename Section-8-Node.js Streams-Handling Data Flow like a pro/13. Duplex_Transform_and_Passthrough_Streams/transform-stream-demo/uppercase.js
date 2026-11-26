import { Transform } from "node:stream";

const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    try {
      const transformedData = chunk.toString().toUpperCase();

      callback(null, transformedData);
    } catch (error) {
      callback(error);
    }
  },
});

process.stdin.pipe(uppercaseTransform).pipe(process.stdout);
