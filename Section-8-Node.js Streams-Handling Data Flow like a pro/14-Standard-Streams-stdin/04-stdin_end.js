process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  console.log('Received:', JSON.stringify(chunk));
});

process.stdin.on('end', () => {
  console.log('Input stream ended.');
});