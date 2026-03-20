import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { loginUser } from '../auth';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Avatar, Alert, Collapse, InputAdornment, IconButton,
  CircularProgress, Divider, Chip, Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const LoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [authError, setAuthError]       = useState('');
  const [authSuccess, setAuthSuccess]   = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm({
    mode: 'onChange',   // validate on every keystroke — controlled inputs
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await loginUser(data.email, data.password);
      setAuthSuccess(`Welcome back, ${res.user.name}! (${res.user.role})`);
      setTimeout(() => onSuccess(res.user), 1200);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={500}>
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>

          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                mx: 'auto', mb: 2,
                width: 64, height: 64,
                bgcolor: '#3a86ff',
                boxShadow: '0 0 30px rgba(58,134,255,0.45)',
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={900} color="#fff" letterSpacing={-1}>
              Sign In
            </Typography>
            <Typography color="rgba(255,255,255,0.45)" mt={0.5} fontSize="0.88rem">
              Experiment — React State Management
            </Typography>
          </Box>

          {/* Demo credentials hint */}
          <Box
            sx={{
              bgcolor: 'rgba(58,134,255,0.1)',
              border: '1px solid rgba(58,134,255,0.2)',
              borderRadius: 2, p: 1.5, mb: 3,
            }}
          >
            <Typography fontSize="0.75rem" color="rgba(255,255,255,0.5)" fontWeight={600} mb={0.5}>
              DEMO CREDENTIALS
            </Typography>
            <Typography fontSize="0.8rem" color="rgba(255,255,255,0.7)" fontFamily="monospace">
              admin@demo.com &nbsp;/&nbsp; password123
            </Typography>
          </Box>

          {/* Alerts */}
          <Collapse in={!!authError}>
            <Alert
              severity="error"
              icon={<ErrorIcon />}
              sx={{ mb: 2.5, borderRadius: 2, bgcolor: 'rgba(230,57,70,0.12)', color: '#ff6b6b', border: '1px solid rgba(230,57,70,0.25)' }}
            >
              {authError}
            </Alert>
          </Collapse>
          <Collapse in={!!authSuccess}>
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ mb: 2.5, borderRadius: 2, bgcolor: 'rgba(42,157,143,0.12)', color: '#52d9cc', border: '1px solid rgba(42,157,143,0.25)' }}
            >
              {authSuccess}
            </Alert>
          </Collapse>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message || (touchedFields.email && !errors.email ? '✓ Looks good!' : '')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: errors.email ? '#ff6b6b' : 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx(!!errors.email, touchedFields.email && !errors.email)}
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message || (touchedFields.password && !errors.password ? '✓ Looks good!' : '')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: errors.password ? '#ff6b6b' : 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small"
                          sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#fff' } }}>
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...fieldSx(!!errors.password, touchedFields.password && !errors.password), mt: 2 }}
                />
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isValid}
              sx={{
                mt: 3.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', py: 1.6,
                bgcolor: '#3a86ff',
                '&:hover': { bgcolor: '#2563eb', transform: 'translateY(-1px)' },
                '&:disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' },
                transition: 'all 0.2s',
                boxShadow: isValid ? '0 8px 25px rgba(58,134,255,0.35)' : 'none',
              }}
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CircularProgress size={20} thickness={5} sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  Authenticating...
                </Box>
              ) : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            {['admin@demo.com', 'student@demo.com', 'test@demo.com'].map((email) => (
              <Chip
                key={email}
                label={email}
                size="small"
                onClick={() => reset({ email, password: '' })}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.7rem', cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(58,134,255,0.15)', color: '#3a86ff' },
                }}
              />
            ))}
          </Box>
          <Typography textAlign="center" fontSize="0.72rem" color="rgba(255,255,255,0.25)" mt={1}>
            Click a demo email to auto-fill
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Reusable MUI dark field styles
const fieldSx = (hasError, isValid) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    bgcolor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    '& fieldset': {
      borderColor: hasError ? '#ff6b6b' : isValid ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
    },
    '&:hover fieldset': { borderColor: hasError ? '#ff6b6b' : 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: hasError ? '#ff6b6b' : '#3a86ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: hasError ? '#ff6b6b' : '#3a86ff' },
  '& .MuiFormHelperText-root': { color: hasError ? '#ff6b6b' : '#2a9d8f' },
  '& input': { color: '#fff' },
});

export default LoginForm;
