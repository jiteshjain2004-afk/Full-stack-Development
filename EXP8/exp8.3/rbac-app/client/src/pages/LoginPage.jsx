import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Avatar, Alert, Collapse, InputAdornment, IconButton,
  CircularProgress, Chip, Divider, Fade,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const DEMO = [
  { username: 'admin',     password: 'admin123',  role: 'admin',     color: '#e63946' },
  { username: 'moderator', password: 'mod123',    role: 'moderator', color: '#f4a261' },
  { username: 'alice',     password: 'alice123',  role: 'user',      color: '#2a9d8f' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]     = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('All fields required'); return; }
    setLoading(true); setError('');
    try {
      await login(form.username, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const fill = (d) => { setForm({ username: d.username, password: d.password }); setError(''); };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 60%, #0a1628 100%)' }}>
      <Fade in timeout={500}>
        <Card elevation={0} sx={{ width: '100%', maxWidth: 440, borderRadius: 4, border: '1px solid rgba(255,255,255,0.09)', bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ mx: 'auto', mb: 2, width: 64, height: 64, bgcolor: '#3a86ff', boxShadow: '0 0 30px rgba(58,134,255,0.4)' }}>
                <SecurityIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={900} color="#fff" letterSpacing={-1}>RBAC App</Typography>
              <Typography color="rgba(255,255,255,0.4)" mt={0.5} fontSize="0.85rem">Experiment 8.3 — Role-Based Access Control</Typography>
            </Box>

            <Collapse in={!!error}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>{error}</Alert>
            </Collapse>

            {location.state?.from && (
              <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, bgcolor: 'rgba(233,196,106,0.1)', color: '#e9c46a', border: '1px solid rgba(233,196,106,0.2)' }}>
                🔒 Login required to access <strong>{location.state.from.pathname}</strong>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <TextField fullWidth label="Username" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment> }}
                sx={fSx} />
              <TextField fullWidth label="Password" type={showPwd ? 'text' : 'password'} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                sx={{ ...fSx, mt: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPwd(p => !p)} size="small" sx={{ color: 'rgba(255,255,255,0.3)' }}>{showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>,
                }} />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ mt: 3.5, borderRadius: 3, fontWeight: 800, py: 1.6, bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }, boxShadow: '0 8px 25px rgba(58,134,255,0.3)' }}>
                {loading ? <><CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)', mr: 1.5 }} />Signing in...</> : 'Sign In →'}
              </Button>
            </form>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Typography fontSize="0.72rem" color="rgba(255,255,255,0.35)" fontWeight={700} textTransform="uppercase" letterSpacing={1} mb={1.5} textAlign="center">Demo Users</Typography>
            <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
              {DEMO.map((d) => (
                <Chip key={d.username} onClick={() => fill(d)}
                  label={<span><strong>{d.username}</strong> · {d.role}</span>}
                  size="small"
                  sx={{ bgcolor: `${d.color}18`, color: d.color, border: `1px solid ${d.color}33`, fontSize: '0.72rem', cursor: 'pointer', '&:hover': { bgcolor: `${d.color}30` } }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

const fSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' }, '&.Mui-focused fieldset': { borderColor: '#3a86ff' } },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3a86ff' },
  '& input': { color: '#fff' },
};

export default LoginPage;
