import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, Chip, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [anchor, setAnchor] = useState(null);

  const handleLogout = () => { logout(); navigate('/'); setAnchor(null); };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ArticleIcon sx={{ color: '#3a86ff' }} />
          <Typography variant="h6" fontWeight={900} color="#fff" letterSpacing={-0.5}>
            Blog<span style={{ color: '#3a86ff' }}>Hub</span>
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isAuthenticated ? (
            <>
              <Button startIcon={<EditIcon />} variant="contained" size="small"
                onClick={() => navigate('/posts/new')}
                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' } }}>
                Write
              </Button>
              <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#3a86ff', fontWeight: 800, fontSize: '0.85rem' }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}
                PaperProps={{ sx: { bgcolor: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, minWidth: 180 } }}>
                <Box px={2} py={1}>
                  <Typography fontWeight={700} color="#fff" fontSize="0.88rem">{user?.username}</Typography>
                  <Typography fontSize="0.72rem" color="rgba(255,255,255,0.4)">{user?.email}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <MenuItem onClick={() => { navigate(`/profile/${user?._id}`); setAnchor(null); }}
                  sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}
                  sx={{ color: '#e63946', fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(230,57,70,0.08)' } }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Login</Button>
              <Button onClick={() => navigate('/register')} variant="contained" size="small"
                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' } }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
