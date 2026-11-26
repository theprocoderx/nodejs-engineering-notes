let counter = 0;

function writeData() {
  while (counter < 100000) {
    const canContinue = process.stdout.write(`Writing line ${counter}\n`);

    counter++;

    if (!canContinue) {
      console.error("Backpressure detected. Waiting for drain...");

      process.stdout.once("drain", () => {
        console.error("Drain received. Continuing...");
        writeData();
      });

      return;
    }
  }

  console.error("All data written.");
}

writeData();
