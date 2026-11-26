process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  console.log('Chunk type:', typeof chunk);
  console.log('Received:', chunk);
});