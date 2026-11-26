import { Duplex } from "node:stream";

const duplexStream = new Duplex({
  read() {
    this.push("Hello from readable side!\n");
    this.push(null);
  },

  write(chunk, encoding, callback) {
    console.log("Received:", chunk.toString());

    callback();
  },
});

// Reading data
duplexStream.on("data", (chunk) => {
  console.log("Read:", chunk.toString());
});

duplexStream.on("end", () => {
  console.log("Reading completed!");
});

// Writing data
duplexStream.write("Hello from writable side!\n");

duplexStream.end();
