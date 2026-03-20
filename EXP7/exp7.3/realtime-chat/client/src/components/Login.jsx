import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Avatar, Fade,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const Login = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) { setError('Please enter a username'); return; }
    if (trimmed.length < 2) { setError('Username must be at least 2 characters'); return; }
    if (trimmed.length > 20) { setError('Username must be under 20 characters'); return; }
    onJoin(trimmed);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Fade in timeout={600}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 4,
            overflow: 'visible',
            border: '1px solid rgba(255,255,255,0.08)',
            bgcolor: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            {/* Logo */}
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 72, height: 72, mx: 'auto', mb: 2,
                  bgcolor: '#e63946',
                  boxShadow: '0 0 30px rgba(230,57,70,0.4)',
                }}
              >
                <ChatIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={900} color="#fff" letterSpacing={-1}>
                LiveChat
              </Typography>
              <Typography color="rgba(255,255,255,0.5)" mt={0.5} fontSize="0.9rem">
                Experiment 2.3.3 — Socket.IO
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                error={!!error}
                helperText={error}
                autoFocus
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.07)',
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#e63946' },
                  },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                  '& .MuiFormHelperText-root': { color: '#ff6b6b' },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '1rem',
                  py: 1.5,
                  bgcolor: '#e63946',
                  '&:hover': { bgcolor: '#c1121f', transform: 'translateY(-1px)' },
                  transition: 'all 0.2s',
                  boxShadow: '0 8px 25px rgba(230,57,70,0.35)',
                }}
              >
                Enter Chat →
              </Button>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Login;
