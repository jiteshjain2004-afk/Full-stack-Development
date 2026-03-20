import { Box, Typography, Avatar, Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const getAvatarColor = (name) => {
  const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#8338ec','#3a86ff'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const OnlineUsers = ({ users, currentUser }) => (
  <Box
    sx={{
      width: 220,
      flexShrink: 0,
      bgcolor: 'rgba(255,255,255,0.03)',
      borderLeft: '1px solid rgba(255,255,255,0.07)',
      p: 2.5,
      display: { xs: 'none', md: 'block' },
    }}
  >
    <Box display="flex" alignItems="center" gap={1} mb={2.5}>
      <FiberManualRecordIcon sx={{ color: '#2a9d8f', fontSize: 12 }} />
      <Typography fontWeight={700} color="rgba(255,255,255,0.7)" fontSize="0.85rem" textTransform="uppercase" letterSpacing={1}>
        Online
      </Typography>
      <Chip
        label={users.length}
        size="small"
        sx={{ bgcolor: '#e63946', color: '#fff', fontWeight: 800, height: 20, fontSize: '0.7rem' }}
      />
    </Box>

    <Box display="flex" flexDirection="column" gap={1.5}>
      {users.map((user) => (
        <Box key={user} display="flex" alignItems="center" gap={1.5}>
          <Box position="relative">
            <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(user), fontSize: '0.8rem', fontWeight: 800 }}>
              {user[0].toUpperCase()}
            </Avatar>
            <FiberManualRecordIcon
              sx={{
                position: 'absolute', bottom: -1, right: -1,
                color: '#2a9d8f', fontSize: 12,
                filter: 'drop-shadow(0 0 3px #2a9d8f)',
              }}
            />
          </Box>
          <Box>
            <Typography fontSize="0.85rem" fontWeight={600} color="#fff">
              {user}
              {user === currentUser && (
                <Typography component="span" fontSize="0.7rem" color="rgba(255,255,255,0.4)" ml={0.5}>(you)</Typography>
              )}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default OnlineUsers;
