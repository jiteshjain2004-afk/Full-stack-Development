import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Box, Card, CardContent, Typography, Avatar, Button,
  Chip, Alert, CircularProgress, Divider, Grid, Fade,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TokenIcon from '@mui/icons-material/Token';
import ShieldIcon from '@mui/icons-material/Shield';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [apiLoading, setApiLoading]       = useState(true);
  const [apiError, setApiError]           = useState('');

  // Verify JWT by calling protected endpoint
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get('/protected');
        setProtectedData(res.data);
      } catch (err) {
        setApiError(err.response?.data?.error || 'Token verification failed');
      } finally {
        setApiLoading(false);
      }
    };
    verify();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const tokenPreview = token ? `${token.substring(0, 30)}...` : '';

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#0d1117', px: { xs: 2, md: 4 }, py: 4,
    }}>
      <Fade in timeout={400}>
        <Box maxWidth={900} mx="auto">

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 50, height: 50, bgcolor: '#3a86ff', fontWeight: 900, fontSize: '1.2rem' }}>
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={900} color="#fff">
                  Welcome, {user?.username}!
                </Typography>
                <Chip label={user?.role} size="small" sx={{ bgcolor: 'rgba(58,134,255,0.15)', color: '#3a86ff', fontWeight: 700, mt: 0.3 }} />
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}
              sx={{ borderRadius: 2, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: '#e63946', color: '#e63946' } }}>
              Logout
            </Button>
          </Box>

          <Grid container spacing={3}>

            {/* JWT Verification Status */}
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <ShieldIcon sx={{ color: '#3a86ff' }} />
                    <Typography fontWeight={800} color="#fff">JWT Verification — /api/protected</Typography>
                  </Box>
                  {apiLoading ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <CircularProgress size={20} sx={{ color: '#3a86ff' }} />
                      <Typography color="rgba(255,255,255,0.4)" fontSize="0.88rem">Calling protected endpoint...</Typography>
                    </Box>
                  ) : apiError ? (
                    <Alert severity="error" sx={{ borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>
                      {apiError}
                    </Alert>
                  ) : (
                    <Alert severity="success" icon={<VerifiedUserIcon />}
                      sx={{ borderRadius: 2, bgcolor: 'rgba(42,157,143,0.1)', color: '#52d9cc', border: '1px solid rgba(42,157,143,0.2)' }}>
                      <strong>200 OK</strong> — {protectedData?.message} &nbsp;·&nbsp; Token verified by Express middleware ✓
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Token display */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <TokenIcon sx={{ color: '#e9c46a' }} />
                    <Typography fontWeight={800} color="#fff">JWT Token</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 2 }}>
                    <Typography fontFamily="monospace" fontSize="0.72rem" color="#e9c46a" sx={{ wordBreak: 'break-all' }}>
                      {tokenPreview}
                    </Typography>
                  </Box>
                  <Typography fontSize="0.72rem" color="rgba(255,255,255,0.3)" mt={1.5}>
                    Stored in localStorage · Sent via Authorization: Bearer header
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* User info */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <VerifiedUserIcon sx={{ color: '#2a9d8f' }} />
                    <Typography fontWeight={800} color="#fff">Decoded Payload</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 2 }}>
                    <Typography fontFamily="monospace" fontSize="0.78rem" color="#2a9d8f">
                      {`{\n  "id": ${user?.id},\n  "username": "${user?.username}",\n  "role": "${user?.role}"\n}`}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Route info */}
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography fontWeight={800} color="#fff" mb={2}>🛡️ Protected Routes in this App</Typography>
                  <Grid container spacing={2}>
                    {[
                      { route: '/dashboard', access: 'Any logged-in user', status: '✅ You are here' },
                      { route: '/profile',   access: 'Any logged-in user', status: '✅ Accessible'   },
                      { route: '/admin',     access: 'Administrator only', status: user?.role === 'Administrator' ? '✅ Accessible' : '🔒 Restricted' },
                      { route: '/login',     access: 'Public (redirects if logged in)', status: '↩ Redirects to dashboard' },
                    ].map(({ route, access, status }) => (
                      <Grid item xs={12} sm={6} key={route}>
                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, p: 2 }}>
                          <Typography fontFamily="monospace" fontWeight={700} color="#3a86ff" fontSize="0.88rem">{route}</Typography>
                          <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)" mt={0.3}>{access}</Typography>
                          <Typography fontSize="0.75rem" color="rgba(255,255,255,0.6)" mt={0.5} fontWeight={600}>{status}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard;
