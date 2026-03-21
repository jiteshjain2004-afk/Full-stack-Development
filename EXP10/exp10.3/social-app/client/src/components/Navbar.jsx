import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem, Divider, Button, InputBase } from '@mui/material';
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => { if (e.key === 'Enter' && search.trim()) { navigate(`/explore?search=${search}`); setSearch(''); } };
  const handleLogout = () => { logout(); navigate('/'); setAnchor(null); };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        {/* Brand */}
        <Typography variant="h6" fontWeight={900} color="#fff" sx={{ cursor: 'pointer', letterSpacing: -0.5, flexShrink: 0 }}
          onClick={() => navigate('/')}>
          Social<span style={{ color: '#3a86ff' }}>Hub</span>
        </Typography>

        {/* Search */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3, px: 2, py: 0.6, display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: 320 }}>
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
          <InputBase placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch} sx={{ color: '#fff', fontSize: '0.88rem', width: '100%', '& input::placeholder': { color: 'rgba(255,255,255,0.3)' } }} />
        </Box>

        {/* Nav */}
        <Box display="flex" alignItems="center" gap={0.5}>
          {isAuthenticated ? (
            <>
              {[
                { icon: <HomeIcon />, path: '/', tip: 'Feed' },
                { icon: <GroupIcon />, path: '/explore', tip: 'Explore' },
              ].map(item => (
                <IconButton key={item.path} onClick={() => navigate(item.path)} size="small"
                  sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                  {item.icon}
                </IconButton>
              ))}
              <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small" sx={{ ml: 0.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#3a86ff', fontSize: '0.8rem', fontWeight: 800 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}
                PaperProps={{ sx: { bgcolor: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, minWidth: 180 } }}>
                <Box px={2} py={1}>
                  <Typography fontWeight={700} color="#fff" fontSize="0.88rem">@{user?.username}</Typography>
                  <Typography fontSize="0.72rem" color="rgba(255,255,255,0.4)">{user?.email}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <MenuItem onClick={() => { navigate(`/profile/${user?._id}`); setAnchor(null); }}
                  sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}
                  sx={{ color: '#e63946', fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(230,57,70,0.08)' } }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.85rem' }}>Login</Button>
              <Button onClick={() => navigate('/register')} variant="contained" size="small"
                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' } }}>Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
