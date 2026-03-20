# Experiment 2.3.3 — Real-Time Chat with Socket.IO

## Tech Stack
- **Backend**: Node.js + Express + Socket.IO v4.7
- **Frontend**: React 18 + Material UI 5.14 + socket.io-client

## Project Structure
```
realtime-chat/
├── server/
│   ├── index.js        ← Express + Socket.IO server
│   ├── .env            ← PORT, CLIENT_URL
│   └── package.json
└── client/
    ├── src/
    │   ├── socket.js              ← Socket singleton
    │   ├── components/
    │   │   ├── Login.jsx          ← Username entry screen
    │   │   ├── ChatRoom.jsx       ← Main chat interface
    │   │   ├── MessageBubble.jsx  ← Individual message
    │   │   └── OnlineUsers.jsx    ← Sidebar user list
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Run Locally
```bash
# Terminal 1 — Backend
cd server && npm install && npm start   # http://localhost:4000

# Terminal 2 — Frontend  
cd client && npm install && npm start   # http://localhost:3000
```

## Socket.IO Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `user:join` | Client → Server | Register username |
| `user:joined` | Server → Client | Confirm join |
| `message:send` | Client → Server | Send a message |
| `message:receive` | Server → Client | Broadcast message |
| `message:system` | Server → Client | Join/leave notification |
| `users:update` | Server → Client | Updated online users list |
| `typing:start` | Client → Server | User started typing |
| `typing:stop` | Client → Server | User stopped typing |
| `typing:update` | Server → Client | Broadcast typing state |

## Objectives Covered
1. ✅ Socket.IO server with Express
2. ✅ Responsive React chat UI
3. ✅ Real-time messaging + broadcasting
4. ✅ Join/leave user management
5. ✅ Typing indicators
6. ✅ Online users list
