import { Box, Avatar, Typography } from '@mui/material';

// Consistent color per username
const getAvatarColor = (name) => {
  const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#8338ec','#3a86ff'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const MessageBubble = ({ message, isOwn }) => {
  // System message (join/leave)
  if (message.type === 'join' || message.type === 'leave') {
    return (
      <Box display="flex" justifyContent="center" my={1}>
        <Box
          sx={{
            px: 2.5, py: 0.6,
            bgcolor: message.type === 'join' ? 'rgba(42,157,143,0.12)' : 'rgba(230,57,70,0.1)',
            border: `1px solid ${message.type === 'join' ? 'rgba(42,157,143,0.25)' : 'rgba(230,57,70,0.2)'}`,
            borderRadius: 10,
          }}
        >
          <Typography fontSize="0.78rem" color={message.type === 'join' ? '#2a9d8f' : '#e63946'} fontWeight={600}>
            {message.type === 'join' ? '🟢' : '🔴'} {message.text}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Regular message
  return (
    <Box
      display="flex"
      flexDirection={isOwn ? 'row-reverse' : 'row'}
      alignItems="flex-end"
      gap={1.5}
      mb={2}
    >
      <Avatar
        sx={{
          width: 36, height: 36, flexShrink: 0,
          bgcolor: getAvatarColor(message.username),
          fontSize: '0.85rem', fontWeight: 800,
        }}
      >
        {message.username[0].toUpperCase()}
      </Avatar>

      <Box maxWidth="70%" minWidth={80}>
        {!isOwn && (
          <Typography fontSize="0.72rem" color="rgba(255,255,255,0.45)" mb={0.4} ml={0.5} fontWeight={600}>
            {message.username}
          </Typography>
        )}
        <Box
          sx={{
            px: 2, py: 1.2,
            bgcolor: isOwn ? '#e63946' : 'rgba(255,255,255,0.07)',
            borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            border: isOwn ? 'none' : '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          <Typography fontSize="0.92rem" color="#fff" lineHeight={1.5}>
            {message.text}
          </Typography>
        </Box>
        <Typography
          fontSize="0.68rem"
          color="rgba(255,255,255,0.3)"
          mt={0.4}
          textAlign={isOwn ? 'right' : 'left'}
          mr={isOwn ? 0.5 : 0}
          ml={isOwn ? 0 : 0.5}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
