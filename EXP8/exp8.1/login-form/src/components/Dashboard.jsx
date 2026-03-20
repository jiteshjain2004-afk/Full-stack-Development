import {
  Box, Card, CardContent, Typography, Avatar, Button,
  Chip, Divider, Fade,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';

const Dashboard = ({ user, onLogout }) => (
  <Fade in timeout={500}>
    <Card
      elevation={0}
      sx={{
        width: '100%', maxWidth: 440,
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)',
        bgcolor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 5 } }}>

        {/* Success header */}
        <Box textAlign="center" mb={4}>
          <Avatar
            sx={{
              mx: 'auto', mb: 2, width: 72, height: 72,
              bgcolor: '#2a9d8f',
              boxShadow: '0 0 30px rgba(42,157,143,0.45)',
              fontSize: '1.8rem', fontWeight: 900,
            }}
          >
            {user.name[0].toUpperCase()}
          </Avatar>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
            <CheckCircleIcon sx={{ color: '#2a9d8f', fontSize: 22 }} />
            <Typography variant="h5" fontWeight={900} color="#fff">
              Login Successful!
            </Typography>
          </Box>
          <Typography color="rgba(255,255,255,0.45)" fontSize="0.88rem">
            Authentication feedback — State managed via React hooks
          </Typography>
        </Box>

        {/* User details card */}
        <Box
          sx={{
            bgcolor: 'rgba(42,157,143,0.08)',
            border: '1px solid rgba(42,157,143,0.2)',
            borderRadius: 3, p: 3, mb: 3,
          }}
        >
          <Typography fontSize="0.72rem" fontWeight={700} color="rgba(255,255,255,0.4)"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            Authenticated User
          </Typography>

          {[
            { icon: <PersonIcon fontSize="small" />, label: 'Name', value: user.name },
            { icon: <EmailIcon fontSize="small" />, label: 'Email', value: user.email },
            { icon: <BadgeIcon fontSize="small" />, label: 'Role', value: user.role },
          ].map(({ icon, label, value }) => (
            <Box key={label} display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <Box sx={{ color: '#2a9d8f' }}>{icon}</Box>
              <Box>
                <Typography fontSize="0.7rem" color="rgba(255,255,255,0.35)" fontWeight={600}>
                  {label}
                </Typography>
                <Typography fontSize="0.9rem" color="#fff" fontWeight={700}>
                  {value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* State details */}
        <Box mb={3}>
          <Typography fontSize="0.72rem" fontWeight={700} color="rgba(255,255,255,0.4)"
            textTransform="uppercase" letterSpacing={1} mb={1.5}>
            React State Used
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {['useState (auth state)', 'useForm (controlled inputs)', 'Controller (validation)', 'Collapse (alerts)'].map((s) => (
              <Chip key={s} label={s} size="small"
                sx={{ bgcolor: 'rgba(58,134,255,0.12)', color: '#3a86ff', fontSize: '0.72rem', border: '1px solid rgba(58,134,255,0.2)' }} />
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />

        <Button
          fullWidth variant="outlined" size="large"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            borderRadius: 3, fontWeight: 700, py: 1.4,
            borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
            '&:hover': { borderColor: '#e63946', color: '#e63946', bgcolor: 'rgba(230,57,70,0.08)' },
          }}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  </Fade>
);

export default Dashboard;
