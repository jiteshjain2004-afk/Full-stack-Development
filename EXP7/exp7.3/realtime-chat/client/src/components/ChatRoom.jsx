import { useState, useEffect, useRef, useCallback } from 'react';
import socket from '../socket';
import {
  Box, Typography, TextField, IconButton, Avatar,
  Chip, Tooltip, Fade,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import MessageBubble from './MessageBubble';
import OnlineUsers from './OnlineUsers';

const ChatRoom = ({ username, onLeave }) => {
  const [messages, setMessages]       = useState([]);
  const [inputText, setInputText]     = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected]     = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, typingUsers, scrollToBottom]);

  // ── Socket setup ──────────────────────────────────────────
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('user:join', username);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('user:joined', () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'join',
          text: `You joined the chat as ${username}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on('message:receive', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('message:system', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('users:update', (users) => {
      setOnlineUsers(users);
    });

    socket.on('typing:update', ({ username: typingUser, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? prev.includes(typingUser) ? prev : [...prev, typingUser]
          : prev.filter((u) => u !== typingUser)
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user:joined');
      socket.off('message:receive');
      socket.off('message:system');
      socket.off('users:update');
      socket.off('typing:update');
      socket.disconnect();
    };
  }, [username]);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    socket.emit('message:send', text);
    socket.emit('typing:stop');
    setInputText('');
    clearTimeout(typingTimerRef.current);
  };

  // ── Typing indicator ──────────────────────────────────────
  const handleInput = (e) => {
    setInputText(e.target.value);
    socket.emit('typing:start');
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => socket.emit('typing:stop'), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  // ── Typing text ───────────────────────────────────────────
  const typingText = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : typingUsers.length > 1
    ? `${typingUsers.join(', ')} are typing...`
    : '';

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0d1117' }}>

      {/* ── Header ── */}
      <Box
        sx={{
          px: 3, py: 1.5,
          bgcolor: '#161b22',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#e63946', fontWeight: 800, fontSize: '0.9rem' }}>
            {username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={800} color="#fff" fontSize="0.95rem">{username}</Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              {connected
                ? <WifiIcon sx={{ fontSize: 11, color: '#2a9d8f' }} />
                : <WifiOffIcon sx={{ fontSize: 11, color: '#e63946' }} />}
              <Typography fontSize="0.7rem" color={connected ? '#2a9d8f' : '#e63946'}>
                {connected ? 'Connected' : 'Reconnecting...'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1.5}>
          <Chip
            label={`${onlineUsers.length} online`}
            size="small"
            sx={{ bgcolor: 'rgba(42,157,143,0.15)', color: '#2a9d8f', fontWeight: 700, border: '1px solid rgba(42,157,143,0.25)' }}
          />
          <Tooltip title="Leave chat">
            <IconButton onClick={handleLeave} size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#e63946' } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Messages */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box
            sx={{
              flex: 1, overflowY: 'auto', px: 3, py: 2,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
            }}
          >
            {messages.length === 0 && (
              <Box textAlign="center" mt={6} color="rgba(255,255,255,0.2)">
                <Typography fontSize="2rem">💬</Typography>
                <Typography fontSize="0.85rem" mt={1}>No messages yet. Say hello!</Typography>
              </Box>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.username === username} />
            ))}

            {/* Typing indicator */}
            {typingText && (
              <Fade in>
                <Typography
                  fontSize="0.82rem"
                  color="rgba(255,255,255,0.4)"
                  fontStyle="italic"
                  mb={1}
                  ml={1}
                >
                  ✏️ {typingText}
                </Typography>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* ── Input ── */}
          <Box
            sx={{
              px: 3, py: 2,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              bgcolor: '#161b22',
              display: 'flex', gap: 1.5, alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type a message... (Enter to send)"
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={!connected}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '0.92rem',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#e63946' },
                },
                '& textarea::placeholder': { color: 'rgba(255,255,255,0.25)' },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!inputText.trim() || !connected}
              sx={{
                bgcolor: '#e63946',
                color: '#fff',
                width: 48, height: 48,
                borderRadius: 2.5,
                flexShrink: 0,
                '&:hover': { bgcolor: '#c1121f', transform: 'scale(1.05)' },
                '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' },
                transition: 'all 0.2s',
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Online users sidebar */}
        <OnlineUsers users={onlineUsers} currentUser={username} />
      </Box>
    </Box>
  );
};

export default ChatRoom;
