import { once } from "node:events";

async function writeOutput() {
  for (let i = 0; i < 100000; i++) {
    const canContinue = process.stdout.write(`Line ${i}\n`);

    if (!canContinue) {
      await once(process.stdout, "drain");
    }
  }
}

writeOutput().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
