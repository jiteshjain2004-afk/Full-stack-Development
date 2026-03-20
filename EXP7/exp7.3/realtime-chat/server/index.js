require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// ── Socket.IO setup ────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// ── REST health check ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chat server running',
    onlineUsers: onlineUsers.size,
    timestamp: new Date().toISOString(),
  });
});

// ── In-memory state ────────────────────────────────────────
// Map<socketId, { username, joinedAt }>
const onlineUsers = new Map();

// Helper: broadcast updated user list to all clients
const broadcastUserList = () => {
  const users = Array.from(onlineUsers.values()).map((u) => u.username);
  io.emit('users:update', users);
};

// ── Socket.IO event handlers ───────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] Socket connected: ${socket.id}`);

  // ── User joins ──────────────────────────────────────────
  socket.on('user:join', (username) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    onlineUsers.set(socket.id, { username: trimmed, joinedAt: new Date() });
    socket.username = trimmed;

    console.log(`[JOIN] ${trimmed}`);

    // Notify everyone else
    socket.broadcast.emit('message:system', {
      id: Date.now(),
      type: 'join',
      text: `${trimmed} joined the chat`,
      timestamp: new Date().toISOString(),
    });

    // Send current user list to ALL clients
    broadcastUserList();

    // Confirm join back to this socket
    socket.emit('user:joined', { username: trimmed });
  });

  // ── Chat message ────────────────────────────────────────
  socket.on('message:send', (text) => {
    if (!socket.username || !text.trim()) return;

    const message = {
      id: Date.now() + Math.random(),
      username: socket.username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    console.log(`[MSG] ${socket.username}: ${text}`);
    // Broadcast to ALL including sender
    io.emit('message:receive', message);
  });

  // ── Typing indicators ───────────────────────────────────
  socket.on('typing:start', () => {
    if (!socket.username) return;
    socket.broadcast.emit('typing:update', { username: socket.username, isTyping: true });
  });

  socket.on('typing:stop', () => {
    if (!socket.username) return;
    socket.broadcast.emit('typing:update', { username: socket.username, isTyping: false });
  });

  // ── Disconnect ──────────────────────────────────────────
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`[LEAVE] ${user.username}`);
      onlineUsers.delete(socket.id);

      io.emit('message:system', {
        id: Date.now(),
        type: 'leave',
        text: `${user.username} left the chat`,
        timestamp: new Date().toISOString(),
      });

      // Clear typing if they were typing
      io.emit('typing:update', { username: user.username, isTyping: false });

      broadcastUserList();
    }
  });
});

// ── Start server ───────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO ready for connections`);
});
