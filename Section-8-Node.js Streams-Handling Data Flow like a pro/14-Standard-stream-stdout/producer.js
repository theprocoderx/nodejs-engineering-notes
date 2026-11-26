// producer.js
import { once } from "node:events";

const totalChunks = 250000;
const chunkData = "X".repeat(4096*4); // 1 KB per chunk (total ~200 KB)
let pauseCount = 0;

for (let i = 1; i <= totalChunks; i++) {
  const line = `${i}:${chunkData}\n`;
  const ok = process.stdout.write(line);

  if (!ok) {
    pauseCount++;
    process.stderr.write(
      `[Producer] Buffer full at chunk #${i} (writableLength=${process.stdout.writableLength}). Waiting for drain...\n`,
    );
    await once(process.stdout, "drain");
    process.stderr.write(`[Producer] Drained! Resuming...\n`);
  }
}

process.stderr.write(`[Producer] Done! Total pauses: ${pauseCount}\n`);
