const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const PC = require("../models/PC");
const AuditLog = require("../models/AuditLog");

const activeCafeTimers = new Map();

async function getCafeStatus(cafeId) {
  const activeSessions = await Session.countDocuments({
    cafe: cafeId,
    status: "active",
  });
  const pausedSessions = await Session.countDocuments({
    cafe: cafeId,
    status: "paused",
  });
  const stoppedSessions = await Session.countDocuments({
    cafe: cafeId,
    status: "stopped",
  });
  const onlinePCs = await PC.countDocuments({ cafe: cafeId, status: "online" });
  const busyPCs = await PC.countDocuments({ cafe: cafeId, status: "busy" });
  const offlinePCs = await PC.countDocuments({
    cafe: cafeId,
    status: "offline",
  });

  return {
    activeSessions,
    pausedSessions,
    stoppedSessions,
    onlinePCs,
    busyPCs,
    offlinePCs,
  };
}

async function broadcastCafeSnapshot(io, cafeId) {
  try {
    const status = await getCafeStatus(cafeId);
    io.to(`cafe_${cafeId}`).emit("cafe:status", {
      cafeId,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to broadcast cafe snapshot", error);
  }
}

function startCafePolling(io, cafeId) {
  if (activeCafeTimers.has(cafeId)) return;
  const timer = setInterval(() => {
    broadcastCafeSnapshot(io, cafeId);
  }, 5000);
  activeCafeTimers.set(cafeId, timer);
}

function stopCafePolling(cafeId) {
  const timer = activeCafeTimers.get(cafeId);
  if (!timer) return;
  clearInterval(timer);
  activeCafeTimers.delete(cafeId);
}

function verifySocketToken(token) {
  if (!token) throw new Error("Authentication token missing");
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = function registerSocketHandlers(io) {
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers["authorization"]?.split(" ")[1];
      const payload = verifySocketToken(token);
      socket.user = payload;
      return next();
    } catch (err) {
      return next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const { cafeId, role, userId } = socket.user;
    const room = cafeId ? `cafe_${cafeId}` : `user_${userId}`;

    socket.join(room);
    socket.emit("socket:connected", { room, userId, role });

    if (cafeId) {
      startCafePolling(io, cafeId);
    }

    socket.on("session:refresh", async () => {
      if (!cafeId) return;
      await broadcastCafeSnapshot(io, cafeId);
    });

    socket.on("session:log", async ({ message }) => {
      if (!cafeId || !message) return;
      await AuditLog.create({
        cafe: cafeId,
        user: userId,
        action: "socket-log",
        metadata: { message },
      });
    });

    socket.on("disconnect", () => {
      const remaining = io.sockets.adapter.rooms.get(room);
      if (!remaining && cafeId) {
        stopCafePolling(cafeId);
      }
    });
  });
};
