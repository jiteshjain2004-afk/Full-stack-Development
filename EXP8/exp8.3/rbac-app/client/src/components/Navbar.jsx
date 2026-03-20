import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Avatar,
  Box, Chip, Tooltip, IconButton, Menu, MenuItem, Divider,
} from '@mui/material';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';

const ROLE_COLOR = { admin: '#e63946', moderator: '#f4a261', user: '#2a9d8f' };

const NAV_ITEMS = [
  { label: 'Dashboard',  path: '/dashboard',  icon: <DashboardIcon fontSize="small" />,            roles: null },
  { label: 'Profile',    path: '/profile',    icon: <PersonIcon fontSize="small" />,               roles: null },
  { label: 'Moderator',  path: '/moderator',  icon: <GavelIcon fontSize="small" />,                roles: ['moderator', 'admin'] },
  { label: 'Admin',      path: '/admin',      icon: <AdminPanelSettingsIcon fontSize="small" />,   roles: ['admin'] },
];

const Navbar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [anchor, setAnchor] = useState(null);

  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || hasRole(...item.roles)
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <SecurityIcon sx={{ color: '#3a86ff' }} />
          <Typography variant="h6" fontWeight={900} color="#fff" letterSpacing={-0.5}>
            RBAC<span style={{ color: '#3a86ff' }}>App</span>
          </Typography>
          <Chip label="Exp 8.3" size="small" sx={{ bgcolor: 'rgba(58,134,255,0.15)', color: '#3a86ff', fontSize: '0.65rem' }} />
        </Box>

        {/* Nav links */}
        <Box display="flex" gap={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {visibleItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, fontWeight: 600, fontSize: '0.82rem',
                color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.5)',
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.08)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#fff' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User avatar + menu */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Chip
            label={user?.role}
            size="small"
            sx={{ bgcolor: `${ROLE_COLOR[user?.role]}22`, color: ROLE_COLOR[user?.role], fontWeight: 700, border: `1px solid ${ROLE_COLOR[user?.role]}44`, textTransform: 'capitalize' }}
          />
          <Tooltip title={user?.username}>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
              <Avatar sx={{ width: 34, height: 34, bgcolor: ROLE_COLOR[user?.role], fontSize: '0.85rem', fontWeight: 800 }}>
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}
            PaperProps={{ sx: { bgcolor: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, minWidth: 180 } }}>
            <Box px={2} py={1}>
              <Typography fontWeight={700} color="#fff" fontSize="0.88rem">{user?.username}</Typography>
              <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)">{user?.email}</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <MenuItem onClick={() => { navigate('/profile'); setAnchor(null); }} sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#e63946', fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(230,57,70,0.08)' } }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
