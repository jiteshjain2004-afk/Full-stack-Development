import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Avatar, Alert, Collapse, InputAdornment, IconButton,
  CircularProgress, Chip, Divider, Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TokenIcon from '@mui/icons-material/Token';

const DEMO = [
  { username: 'admin',  password: 'admin123',  role: 'Administrator' },
  { username: 'user',   password: 'user123',   role: 'Student'       },
  { username: 'jitesh', password: 'jitesh123', role: 'Developer'     },
];

const LoginPage = () => {
  const { login, loading, error, setError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]           = useState({ username: '', password: '' });
  const [showPassword, setShowPwd] = useState(false);
  const [fieldErrors, setFE]      = useState({});

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.password)        errs.password = 'Password is required';
    if (form.password && form.password.length < 6) errs.password = 'Min 6 characters';
    setFE(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    const res = await login(form.username, form.password);
    if (res.success) navigate(from, { replace: true });
  };

  const fillDemo = (d) => {
    setForm({ username: d.username, password: d.password });
    setFE({});
    setError('');
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', px: 2,
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 60%, #0a1628 100%)',
    }}>
      <Fade in timeout={500}>
        <Card elevation={0} sx={{
          width: '100%', maxWidth: 440, borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.09)',
          bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)',
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>

            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Avatar sx={{
                mx: 'auto', mb: 2, width: 64, height: 64, bgcolor: '#3a86ff',
                boxShadow: '0 0 30px rgba(58,134,255,0.4)',
              }}>
                <TokenIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={900} color="#fff" letterSpacing={-1}>
                JWT Auth
              </Typography>
              <Typography color="rgba(255,255,255,0.4)" mt={0.5} fontSize="0.85rem">
                Experiment 8.2 — Protected Routes
              </Typography>
            </Box>

            {/* Error alert */}
            <Collapse in={!!error}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.1)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.2)' }}>
                {error}
              </Alert>
            </Collapse>

            {/* Redirect notice */}
            {location.state?.from && (
              <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, bgcolor: 'rgba(233,196,106,0.1)', color: '#e9c46a', border: '1px solid rgba(233,196,106,0.2)' }}>
                🔒 Please login to access <strong>{location.state.from.pathname}</strong>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth label="Username or Email"
                value={form.username}
                onChange={(e) => { setForm({ ...form, username: e.target.value }); setFE({ ...fieldErrors, username: '' }); }}
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment>,
                }}
                sx={fieldSx(!!fieldErrors.username)}
              />

              <TextField
                fullWidth label="Password" type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setFE({ ...fieldErrors, password: '' }); }}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                sx={{ ...fieldSx(!!fieldErrors.password), mt: 2 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd((p) => !p)} size="small" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{
                  mt: 3.5, borderRadius: 3, fontWeight: 800, py: 1.6, fontSize: '1rem',
                  bgcolor: '#3a86ff', '&:hover': { bgcolor: '#2563eb' },
                  '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' },
                  boxShadow: '0 8px 25px rgba(58,134,255,0.3)',
                }}>
                {loading ? <><CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)', mr: 1.5 }} /> Verifying JWT...</> : 'Sign In →'}
              </Button>
            </form>

            {/* Demo users */}
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Typography fontSize="0.72rem" color="rgba(255,255,255,0.35)" fontWeight={700}
              textTransform="uppercase" letterSpacing={1} mb={1.5} textAlign="center">
              Quick Fill Demo Users
            </Typography>
            <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
              {DEMO.map((d) => (
                <Chip key={d.username} label={`${d.username} (${d.role})`} size="small"
                  onClick={() => fillDemo(d)}
                  sx={{ bgcolor: 'rgba(58,134,255,0.1)', color: '#3a86ff', border: '1px solid rgba(58,134,255,0.2)', fontSize: '0.72rem', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(58,134,255,0.2)' } }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

const fieldSx = (hasError) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff',
    '& fieldset': { borderColor: hasError ? '#ff6b6b' : 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: hasError ? '#ff6b6b' : 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: hasError ? '#ff6b6b' : '#3a86ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: hasError ? '#ff6b6b' : '#3a86ff' },
  '& .MuiFormHelperText-root': { color: '#ff6b6b' },
  '& input': { color: '#fff' },
});

export default LoginPage;
