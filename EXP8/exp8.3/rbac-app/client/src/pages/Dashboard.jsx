import { useAuth } from '../context/AuthContext';
import { Box, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

const ROLE_COLOR = { admin: '#e63946', moderator: '#f4a261', user: '#2a9d8f' };

const ROUTE_CARDS = [
  { label: 'Profile',   path: '/profile',   icon: <PersonIcon />,                  roles: null,                  desc: 'View your account info' },
  { label: 'Moderator', path: '/moderator', icon: <GavelIcon />,                   roles: ['moderator', 'admin'], desc: 'Manage reports and flags' },
  { label: 'Admin',     path: '/admin',     icon: <AdminPanelSettingsIcon />,       roles: ['admin'],             desc: 'Full system control' },
];

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const roleColor = ROLE_COLOR[user?.role] || '#3a86ff';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
      <Box maxWidth={900} mx="auto">
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <DashboardIcon sx={{ color: '#3a86ff', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={900} color="#fff">Dashboard</Typography>
            <Typography color="rgba(255,255,255,0.4)" fontSize="0.85rem">Welcome back, <strong style={{ color: roleColor }}>{user?.username}</strong></Typography>
          </Box>
        </Box>

        {/* Role badge */}
        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: `${roleColor}10`, border: `1px solid ${roleColor}30`, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip label={`Role: ${user?.role?.toUpperCase()}`} sx={{ bgcolor: roleColor, color: '#fff', fontWeight: 800, fontSize: '0.85rem' }} />
              <Typography color="rgba(255,255,255,0.6)" fontSize="0.88rem">
                {user?.role === 'admin' && '🔑 Full access — you can manage users, moderate content, and access all routes'}
                {user?.role === 'moderator' && '🛡️ Elevated access — you can moderate content and view users'}
                {user?.role === 'user' && '👤 Standard access — profile and dashboard only'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Route access cards */}
        <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.75rem" textTransform="uppercase" letterSpacing={1} mb={2}>
          Available Routes
        </Typography>
        <Grid container spacing={2}>
          {ROUTE_CARDS.map((card) => {
            const accessible = !card.roles || hasRole(...card.roles);
            return (
              <Grid item xs={12} sm={4} key={card.path}>
                <Card elevation={0} sx={{
                  borderRadius: 3, height: '100%',
                  bgcolor: accessible ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  border: accessible ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)',
                  opacity: accessible ? 1 : 0.5,
                  transition: 'all 0.2s',
                  '&:hover': accessible ? { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' } : {},
                }}>
                  <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                    <Box sx={{ color: accessible ? '#3a86ff' : 'rgba(255,255,255,0.2)', mb: 1 }}>{accessible ? card.icon : <LockIcon />}</Box>
                    <Typography fontWeight={700} color={accessible ? '#fff' : 'rgba(255,255,255,0.3)'} mb={0.5}>{card.label}</Typography>
                    <Typography fontSize="0.75rem" color="rgba(255,255,255,0.35)" mb={2}>{card.desc}</Typography>
                    {accessible
                      ? <Button size="small" variant="outlined" onClick={() => navigate(card.path)}
                          sx={{ borderRadius: 2, borderColor: 'rgba(58,134,255,0.4)', color: '#3a86ff', fontSize: '0.75rem', '&:hover': { borderColor: '#3a86ff' } }}>
                          Go →
                        </Button>
                      : <Chip label="No Access" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }} />
                    }
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
