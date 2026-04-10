import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAuth } from '../context/AuthContext';

const DEMO = [
  { username: 'admin', password: 'admin123', role: 'admin', color: '#e63946' },
  { username: 'moderator', password: 'mod123', role: 'moderator', color: '#f4a261' },
  { username: 'alice', password: 'alice123', role: 'user', color: '#2a9d8f' },
];

const EMPTY_FORM = {
  login: { username: '', password: '' },
  register: { username: '', email: '', password: '', confirmPassword: '' },
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    bgcolor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#3a86ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3a86ff' },
  '& input': { color: '#fff' },
};

const PasswordField = ({ label, value, onChange, visible, onToggle }) => (
  <TextField
    fullWidth
    label={label}
    type={visible ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    sx={fieldSx}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onToggle} size="small" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const initialMode = location.pathname === '/register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPwd, setShowPwd] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeForm = useMemo(() => form[mode], [form, mode]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [mode]: { ...current[mode], [field]: value },
    }));
    setError('');
  };

  const switchMode = (_, nextMode) => {
    if (!nextMode) return;
    setMode(nextMode);
    setError('');
    setShowPwd({ password: false, confirmPassword: false });
    navigate(nextMode === 'register' ? '/register' : '/login', {
      replace: true,
      state: location.state,
    });
  };

  const fillDemo = (demoUser) => {
    setMode('login');
    setForm((current) => ({
      ...current,
      login: { username: demoUser.username, password: demoUser.password },
    }));
    setError('');
    navigate('/login', { replace: true, state: location.state });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        if (!activeForm.username || !activeForm.password) {
          throw new Error('Username and password are required');
        }
        await login(activeForm.username, activeForm.password);
      } else {
        if (!activeForm.username || !activeForm.email || !activeForm.password || !activeForm.confirmPassword) {
          throw new Error('All fields are required');
        }
        if (activeForm.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (activeForm.password !== activeForm.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register({
          username: activeForm.username,
          email: activeForm.email,
          password: activeForm.password,
        });
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 3,
        background:
          'radial-gradient(circle at top, rgba(58,134,255,0.18), transparent 28%), linear-gradient(135deg, #050816 0%, #0d1b2a 55%, #08111f 100%)',
      }}
    >
      <Fade in timeout={500}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.09)',
            bgcolor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  mx: 'auto',
                  mb: 2,
                  width: 64,
                  height: 64,
                  bgcolor: '#3a86ff',
                  boxShadow: '0 0 30px rgba(58,134,255,0.4)',
                }}
              >
                <SecurityIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={900} color="#fff" letterSpacing={-1}>
                RBAC App
              </Typography>
              <Typography color="rgba(255,255,255,0.4)" mt={0.5} fontSize="0.85rem">
                Experiment 8.3 - Role-Based Access Control
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={mode}
              exclusive
              fullWidth
              onChange={switchMode}
              sx={{
                mb: 3,
                p: 0.5,
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 3,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 0,
                  borderRadius: '10px !important',
                  color: 'rgba(255,255,255,0.55)',
                  fontWeight: 700,
                  textTransform: 'none',
                },
                '& .Mui-selected': {
                  bgcolor: '#3a86ff !important',
                  color: '#fff !important',
                  boxShadow: '0 8px 18px rgba(58,134,255,0.28)',
                },
              }}
            >
              <ToggleButton value="login">Sign in</ToggleButton>
              <ToggleButton value="register">Register</ToggleButton>
            </ToggleButtonGroup>

            <Collapse in={!!error}>
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(230,57,70,0.1)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(230,57,70,0.2)',
                }}
              >
                {error}
              </Alert>
            </Collapse>

            {location.state?.from && mode === 'login' && (
              <Alert
                severity="warning"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(233,196,106,0.1)',
                  color: '#e9c46a',
                  border: '1px solid rgba(233,196,106,0.2)',
                }}
              >
                Sign in required to access <strong>{location.state.from.pathname}</strong>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Username"
                  value={activeForm.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx}
                />

                {mode === 'register' && (
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={activeForm.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldSx}
                  />
                )}

                <PasswordField
                  label="Password"
                  value={activeForm.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  visible={showPwd.password}
                  onToggle={() => setShowPwd((current) => ({ ...current, password: !current.password }))}
                />

                {mode === 'register' && (
                  <PasswordField
                    label="Confirm password"
                    value={activeForm.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    visible={showPwd.confirmPassword}
                    onToggle={() =>
                      setShowPwd((current) => ({
                        ...current,
                        confirmPassword: !current.confirmPassword,
                      }))
                    }
                  />
                )}
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  py: 1.6,
                  bgcolor: '#3a86ff',
                  '&:hover': { bgcolor: '#2563eb' },
                  '&:disabled': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.2)',
                  },
                  boxShadow: '0 8px 25px rgba(58,134,255,0.3)',
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)', mr: 1.5 }} />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : mode === 'login' ? (
                  'Sign In ->'
                ) : (
                  'Create Account ->'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

            {mode === 'login' ? (
              <>
                <Typography
                  fontSize="0.72rem"
                  color="rgba(255,255,255,0.35)"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing={1}
                  mb={1.5}
                  textAlign="center"
                >
                  Demo Users
                </Typography>
                <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                  {DEMO.map((demoUser) => (
                    <Chip
                      key={demoUser.username}
                      onClick={() => fillDemo(demoUser)}
                      label={`${demoUser.username} · ${demoUser.role}`}
                      size="small"
                      sx={{
                        bgcolor: `${demoUser.color}18`,
                        color: demoUser.color,
                        border: `1px solid ${demoUser.color}33`,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: `${demoUser.color}30` },
                      }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  bgcolor: 'rgba(58,134,255,0.1)',
                  color: '#90caf9',
                  border: '1px solid rgba(58,134,255,0.2)',
                }}
              >
                New accounts are created with the <strong>user</strong> role. Elevated roles still need to be assigned by an admin.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default AuthPage;
