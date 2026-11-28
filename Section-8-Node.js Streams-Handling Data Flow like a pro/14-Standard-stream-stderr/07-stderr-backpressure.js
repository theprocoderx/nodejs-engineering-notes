import { once } from "node:events";

async function writeErrors() {
  for (let i = 0; i < 100000; i++) {
    const canContinue = process.stderr.write(`Error record ${i}\n`);

    if (!canContinue) {
      await once(process.stderr, "drain");
    }
  }
}

writeErrors().catch((error) => {
  process.exitCode = 1;
});
