import { once } from "node:events";

async function writeData() {
  for (let i = 0; i < 100000; i++) {
    const canContinue = process.stdout.write(`Writing line ${i}\n`);

    if (!canContinue) {
      await once(process.stdout, "drain");
    }
  }
}

writeData().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exitCode = 1;
});
