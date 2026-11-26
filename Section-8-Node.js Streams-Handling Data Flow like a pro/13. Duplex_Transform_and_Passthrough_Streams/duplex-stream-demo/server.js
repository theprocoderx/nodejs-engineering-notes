import net from "node:net";

const server = net.createServer((socket) => {
  console.log("Client connected!");

  // Read incoming data
  socket.on("data", (chunk) => {
    const message = chunk.toString();

    console.log("Client says:", message);

    // Send response to client
    socket.write(`Server received: ${message}`);
  });

  socket.on("end", () => {
    console.log("Client ended its writable connection.");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error.message);
  });

  socket.on("close", () => {
    console.log("Client connection closed.");
  });
});

server.listen(3000, () => {
  console.log("TCP server listening on port 3000");
});

// C. Run the application
// Open two terminals in VS Code.
// Terminal 1 – Start the server
// node server.js enter

// ========== Server running =========== expected output

// TCP server listening on port 3000
// Client connected!
// Client says: Hello from client!
// Client ended its writable connection.
// Client connection closed.
