require("dotenv").config();
// test
const path = require("path");
const http = require("http");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const apiRoutes = require("./routes");
const registerSocketHandlers = require("./sockets/socket");

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`CyberDesk backend listening on http://localhost:${PORT}`);
});
