import net from "node:net";

const client = net.createConnection({ port: 3000, host: "127.0.0.1" }, () => {
  console.log("Connected to TCP server!");

  // Send data to server
  client.write("Hello from client!");
});

// Receive server response
client.on("data", (chunk) => {
  console.log("Server says:", chunk.toString());

  // Close the writable side after receiving response
  client.end();
});

client.on("end", () => {
  console.log("Server ended its writable connection.");
});

client.on("error", (error) => {
  console.error("Client error:", error.message);
});

client.on("close", () => {
  console.log("Connection closed.");
});

// C. Run the application
// Open two terminals in VS Code.
// Terminal 2 – Start the client
// node client.js enter

// ========== Client connected =========== expected output

// Connected to TCP server!
// Server says: Server received: Hello from client!
// Server ended its writable connection.
// Connection closed.
