const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();
require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.set("io", io); // make socket available globally

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/metrics", require("./routes/metricRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/devices", require("./routes/deviceRoutes"));
app.use("/api/advanced", require("./routes/advancedRoutes"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));