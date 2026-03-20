import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

// Single socket instance shared across the app
const socket = io(SERVER_URL, {
  autoConnect: false,        // connect manually after username set
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
