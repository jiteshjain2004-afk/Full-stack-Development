import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Grid,
  Divider, LinearProgress, Tooltip, createTheme, ThemeProvider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import LayersIcon from '@mui/icons-material/Layers';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#2196f3' } },
});

const BUILD_STAGES = [
  {
    stage: 'Stage 1',
    label: 'Builder',
    image: 'node:18-alpine',
    size: '~350MB',
    color: '#f4a261',
    icon: '📦',
    steps: ['COPY package.json', 'RUN npm ci', 'COPY src/', 'RUN npm run build'],
    kept: false,
    desc: 'Installs deps + builds React — discarded after build',
  },
  {
    stage: 'Stage 2',
    label: 'Production',
    image: 'nginx:1.25-alpine',
    size: '~25MB',
    color: '#2a9d8f',
    icon: '🚀',
    steps: ['COPY nginx.conf', 'COPY --from=builder /app/build', 'EXPOSE 8080', 'CMD nginx'],
    kept: true,
    desc: 'Only the build output + Nginx — this is the final image',
  },
];

const FEATURES = [
  { icon: <SpeedIcon />,    label: 'Gzip Compression',   desc: 'All text assets compressed',        color: '#2196f3' },
  { icon: <StorageIcon />,  label: 'Asset Caching',      desc: 'JS/CSS cached for 1 year',          color: '#9c27b0' },
  { icon: <SecurityIcon />, label: 'Security Headers',   desc: 'XSS, CSRF, Clickjack protection',   color: '#e63946' },
  { icon: <CloudIcon />,    label: 'Health Check',       desc: 'GET /health returns 200',           color: '#2a9d8f' },
];

const ENV = process.env.REACT_APP_ENV || 'development';
const VER = process.env.REACT_APP_VERSION || '1.0.0';

export default function App() {
  const [activeStage, setActiveStage] = useState(1);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
        <Box maxWidth={900} mx="auto">

          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Typography variant="h3" fontWeight={900} color="#fff" letterSpacing={-1} mb={1}>
              🐳 Docker<span style={{ color: '#2196f3' }}>ized</span> React
            </Typography>
            <Typography color="rgba(255,255,255,0.45)" mb={2}>
              Experiment 9.1 — Multi-Stage Build · Production Nginx · Port 8080
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              <Chip label={`ENV: ${ENV}`} size="small" sx={{ bgcolor: 'rgba(33,150,243,0.15)', color: '#2196f3', fontWeight: 700 }} />
              <Chip label={`v${VER}`} size="small" sx={{ bgcolor: 'rgba(42,157,143,0.15)', color: '#2a9d8f', fontWeight: 700 }} />
              <Chip label="Nginx 1.25" size="small" sx={{ bgcolor: 'rgba(244,162,97,0.15)', color: '#f4a261', fontWeight: 700 }} />
              <Chip label="Port 8080" size="small" sx={{ bgcolor: 'rgba(230,57,70,0.15)', color: '#e63946', fontWeight: 700 }} />
            </Box>
          </Box>

          {/* Multi-stage build diagram */}
          <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            Multi-Stage Build Pipeline
          </Typography>
          <Grid container spacing={2} mb={4} alignItems="stretch">
            {BUILD_STAGES.map((s, i) => (
              <Grid item xs={12} sm={6} key={s.stage}>
                <Card
                  elevation={0}
                  onClick={() => setActiveStage(i)}
                  sx={{
                    borderRadius: 3, cursor: 'pointer', height: '100%',
                    bgcolor: activeStage === i ? `${s.color}12` : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${activeStage === i ? s.color : 'rgba(255,255,255,0.07)'}`,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: s.color, transform: 'translateY(-2px)' },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography fontSize="1.8rem">{s.icon}</Typography>
                        <Chip label={s.stage} size="small" sx={{ bgcolor: `${s.color}22`, color: s.color, fontWeight: 700, mt: 0.5 }} />
                      </Box>
                      <Box textAlign="right">
                        <Typography fontWeight={800} color="#fff" fontSize="1.1rem">{s.size}</Typography>
                        {s.kept
                          ? <Chip label="✓ Final Image" size="small" sx={{ bgcolor: 'rgba(42,157,143,0.2)', color: '#2a9d8f', fontSize: '0.65rem', fontWeight: 700 }} />
                          : <Chip label="✗ Discarded" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }} />
                        }
                      </Box>
                    </Box>
                    <Typography fontWeight={800} color="#fff" mb={0.3}>{s.label}</Typography>
                    <Typography fontFamily="monospace" fontSize="0.75rem" color={s.color} mb={1.5}>{s.image}</Typography>
                    <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)" mb={2}>{s.desc}</Typography>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      {s.steps.map((step) => (
                        <Box key={step} display="flex" alignItems="center" gap={1}>
                          <CheckCircleIcon sx={{ fontSize: 13, color: s.color }} />
                          <Typography fontFamily="monospace" fontSize="0.75rem" color="rgba(255,255,255,0.6)">{step}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Size comparison bar */}
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                <LayersIcon sx={{ color: '#2196f3' }} />
                <Typography fontWeight={800} color="#fff">Image Size Optimization</Typography>
                <Chip label="92% smaller!" size="small" sx={{ bgcolor: 'rgba(42,157,143,0.2)', color: '#2a9d8f', fontWeight: 700, ml: 'auto' }} />
              </Box>
              {[
                { label: 'node:18 (no multi-stage)', size: 350, max: 350, color: '#e63946' },
                { label: 'node:18-alpine (builder)',  size: 120, max: 350, color: '#f4a261' },
                { label: 'nginx:alpine (final image)', size: 25,  max: 350, color: '#2a9d8f' },
              ].map((row) => (
                <Box key={row.label} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography fontSize="0.8rem" color="rgba(255,255,255,0.6)">{row.label}</Typography>
                    <Typography fontSize="0.8rem" fontWeight={700} color={row.color}>~{row.size}MB</Typography>
                  </Box>
                  <Tooltip title={`~${row.size}MB`}>
                    <LinearProgress variant="determinate" value={(row.size / row.max) * 100}
                      sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: row.color, borderRadius: 5 } }} />
                  </Tooltip>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Nginx features */}
          <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            Nginx Production Features
          </Typography>
          <Grid container spacing={2} mb={4}>
            {FEATURES.map((f) => (
              <Grid item xs={12} sm={6} key={f.label}>
                <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: f.color, display: 'flex' }}>{f.icon}</Box>
                    <Box>
                      <Typography fontWeight={700} color="#fff" fontSize="0.9rem">{f.label}</Typography>
                      <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)">{f.desc}</Typography>
                    </Box>
                    <CheckCircleIcon sx={{ color: '#2a9d8f', ml: 'auto', flexShrink: 0 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Docker commands */}
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={800} color="#fff" mb={2}>🖥️ Docker Commands</Typography>
              {[
                { label: 'Build image', cmd: 'docker build -t docker-react-app .' },
                { label: 'Run container', cmd: 'docker run -p 8080:8080 docker-react-app' },
                { label: 'Docker Compose', cmd: 'docker-compose up --build' },
                { label: 'Check image size', cmd: 'docker images docker-react-app' },
                { label: 'View logs', cmd: 'docker logs docker-react-prod' },
              ].map((c) => (
                <Box key={c.label} mb={1.5}>
                  <Typography fontSize="0.7rem" color="rgba(255,255,255,0.35)" mb={0.3}>{c.label}</Typography>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 1.5, px: 2, py: 1 }}>
                    <Typography fontFamily="monospace" fontSize="0.82rem" color="#2196f3">$ {c.cmd}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 4 }} />
          <Typography textAlign="center" color="rgba(255,255,255,0.2)" fontSize="0.78rem">
            Experiment 9.1 — Docker Multi-Stage Build · React + Nginx · Production Optimized
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
