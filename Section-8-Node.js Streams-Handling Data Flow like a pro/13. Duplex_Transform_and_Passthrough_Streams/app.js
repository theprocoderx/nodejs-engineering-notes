import fs from "fs";
import { pipeline } from "stream";

console.time("Copy Time");

const readStream = fs.createReadStream(
  "C:\\Users\\user\\Desktop\\streams.mp4",
  { highWaterMark: 1 * 1024 * 1024 },
);
const writeStream = fs.createWriteStream("streams.mp4", {
  highWaterMark: 1 * 1024 * 1024,
});

readStream.pipe(writeStream)