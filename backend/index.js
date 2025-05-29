import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// --- In-memory state ---
const rooms = {};

// --- Helper: Generate unique code ---
function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// --- Socket.io logic ---
io.on("connection", (socket) => {
  socket.on("createRoom", (nickname, cb) => {
    let code;
    do { code = generateRoomCode(); } while (rooms[code]);
    rooms[code] = {
      owner: socket.id,
      users: {},
      state: "waiting",
      drawings: {},
      dragDropData: {},
      results: {},
      order: [],
    };
    rooms[code].users[socket.id] = { nickname, socketId: socket.id };
    socket.join(code);
    cb({ code });
    io.to(code).emit("roomUpdate", rooms[code]);
  });

  socket.on("joinRoom", ({ code, nickname }, cb) => {
    if (!rooms[code]) return cb({ error: "Room not found" });
    rooms[code].users[socket.id] = { nickname, socketId: socket.id };
    socket.join(code);
    cb({ success: true, code });
    io.to(code).emit("roomUpdate", rooms[code]);
  });

  socket.on("startGame", (code) => {
    if (!rooms[code]) return;
    rooms[code].state = "drawing";
    rooms[code].order = Object.keys(rooms[code].users);
    io.to(code).emit("gameStarted");
  });

  socket.on("saveDrawing", ({ code, drawing }, cb) => {
    if (!rooms[code]) return;
    rooms[code].drawings[socket.id] = drawing;
    // Check if all drawings are in
    if (Object.keys(rooms[code].drawings).length === Object.keys(rooms[code].users).length) {
      rooms[code].state = "dragdrop";
      io.to(code).emit("allDrawingsSaved");
    }
    cb({ success: true });
  });

  socket.on("saveDragDrop", ({ code, drawingOwnerId, assignedNameId, assignedText }, cb) => {
    if (!rooms[code]) return;
    if (!rooms[code].dragDropData[drawingOwnerId]) rooms[code].dragDropData[drawingOwnerId] = [];
    rooms[code].dragDropData[drawingOwnerId].push({ assignedNameId, assignedText });
    // Check if all assignments are in for all drawings
    let total = 0;
    Object.values(rooms[code].dragDropData).forEach(arr => total += arr.length);
    if (total === Object.keys(rooms[code].users).length * (Object.keys(rooms[code].users).length - 1)) {
      rooms[code].state = "results";
      io.to(code).emit("showResults");
    }
    cb({ success: true });
  });

  socket.on("disconnect", () => {
    for (const code of Object.keys(rooms)) {
      if (rooms[code].users[socket.id]) {
        delete rooms[code].users[socket.id];
        if (Object.keys(rooms[code].users).length === 0) {
          delete rooms[code];
        } else {
          io.to(code).emit("roomUpdate", rooms[code]);
        }
        break;
      }
    }
  });
});

// --- Simple health check ---
app.get("/", (req, res) => res.send("Backend running"));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));