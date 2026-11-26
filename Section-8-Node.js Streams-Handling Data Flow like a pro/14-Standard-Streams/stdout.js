process.stdout.write("Hello Node.js!\n");

process.stdout.write("Learning standard streams.\n");

//  the difference between write() and console.log() including new line
console.log("Hello");

// Here console.log apply automatically new line. and write() method needs to append a \n for new line


// Under standing backpressure by using return value
const canContinue = process.stdout.write('Hello Node.js\n');

console.log('Can continue:', canContinue);