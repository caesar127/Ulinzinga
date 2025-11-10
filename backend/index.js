import http from "http";
import os from "os";
import app from "./main.js";
import "./src/config/passport.js";
import connectDB from "./src/config/database.js";

const port = process.env.PORT || 8000;
const server = http.createServer(app);

connectDB();

server.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  for (const [key, value] of Object.entries(networkInterfaces)) {
    for (const net of value) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  console.log(`Server running at http://${addresses[0]}:${port}`);
});
