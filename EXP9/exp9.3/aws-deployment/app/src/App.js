import {
  Box, Card, CardContent, Typography, Chip, Grid,
  Divider, createTheme, ThemeProvider, Avatar, LinearProgress,
} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import BalanceIcon from '@mui/icons-material/Balance';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#ff9900' } },
});

const INFRA = [
  { label: 'VPC', icon: '🌐', color: '#ff9900', desc: '10.0.0.0/16 CIDR\n2 Public + 2 Private Subnets\nInternet + NAT Gateway' },
  { label: 'ALB', icon: '⚖️', color: '#2196f3', desc: 'Application Load Balancer\nDistributes across 2 AZs\nHealth check: /health' },
  { label: 'ECS', icon: '🐳', color: '#2a9d8f', desc: 'Fargate cluster\n2–4 tasks (auto-scaling)\nPrivate subnets' },
  { label: 'ECR', icon: '📦', color: '#9c27b0', desc: 'Docker image registry\nImage scan on push\nTagged: latest + SHA' },
  { label: 'Auto Scale', icon: '📈', color: '#e63946', desc: 'CPU > 70% → scale up\nMemory > 80% → scale up\nMin: 2, Max: 4 tasks' },
  { label: 'CloudWatch', icon: '📊', color: '#f4a261', desc: 'ECS container logs\n7-day retention\nContainer insights' },
];

const AZS = [
  { az: 'us-east-1a', public: '10.0.0.0/24', private: '10.0.10.0/24', task: 'Task #1 🟢' },
  { az: 'us-east-1b', public: '10.0.1.0/24', private: '10.0.11.0/24', task: 'Task #2 🟢' },
];

const PIPELINE = [
  { step: '1', label: 'git push', desc: 'Trigger pipeline', color: '#ff9900' },
  { step: '2', label: 'Test', desc: 'npm test', color: '#2196f3' },
  { step: '3', label: 'Docker Build', desc: 'Build & push to ECR', color: '#9c27b0' },
  { step: '4', label: 'ECS Deploy', desc: 'Zero-downtime rolling', color: '#2a9d8f' },
  { step: '5', label: 'ALB Routes', desc: 'Traffic distributed', color: '#e63946' },
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
        <Box maxWidth={960} mx="auto">

          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
              <CloudIcon sx={{ fontSize: 44, color: '#ff9900' }} />
              <Typography variant="h3" fontWeight={900} color="#fff" letterSpacing={-1}>
                AWS <span style={{ color: '#ff9900' }}>Deployment</span>
              </Typography>
            </Box>
            <Typography color="rgba(255,255,255,0.45)" mb={2}>
              Experiment 9.3 — ECS + ALB + Auto Scaling + Terraform IaC
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              {['VPC', 'ECS Fargate', 'ALB', 'Auto Scaling', 'ECR', 'Terraform'].map(l => (
                <Chip key={l} label={l} size="small"
                  sx={{ bgcolor: 'rgba(255,153,0,0.12)', color: '#ff9900', fontWeight: 700, border: '1px solid rgba(255,153,0,0.2)' }} />
              ))}
            </Box>
          </Box>

          {/* High Availability Banner */}
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,153,0,0.08)', border: '1px solid rgba(255,153,0,0.2)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <NetworkCheckIcon sx={{ color: '#ff9900', fontSize: 28 }} />
                <Box flex={1}>
                  <Typography fontWeight={800} color="#fff">High Availability Architecture</Typography>
                  <Typography color="rgba(255,255,255,0.5)" fontSize="0.85rem">
                    2 Availability Zones · 2–4 ECS Tasks · Zero-downtime deployments · Auto-scaling on CPU/Memory
                  </Typography>
                </Box>
                <Chip label="✅ Production Ready" sx={{ bgcolor: 'rgba(42,157,143,0.2)', color: '#2a9d8f', fontWeight: 700 }} />
              </Box>
            </CardContent>
          </Card>

          {/* AZ Layout */}
          <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            Infrastructure — 2 Availability Zones
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              {/* ALB spans both AZs */}
              <Box sx={{ bgcolor: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.25)', borderRadius: 2, p: 2, mb: 2, textAlign: 'center' }}>
                <Typography fontWeight={800} color="#2196f3">⚖️ Application Load Balancer</Typography>
                <Typography fontSize="0.78rem" color="rgba(255,255,255,0.4)">Spans both AZs · Port 80/443 · Health check /health</Typography>
              </Box>
              <Grid container spacing={2}>
                {AZS.map((az) => (
                  <Grid item xs={12} sm={6} key={az.az}>
                    <Box sx={{ bgcolor: 'rgba(255,153,0,0.06)', border: '1px solid rgba(255,153,0,0.15)', borderRadius: 2, p: 2 }}>
                      <Chip label={az.az} size="small" sx={{ bgcolor: 'rgba(255,153,0,0.2)', color: '#ff9900', fontWeight: 700, mb: 1.5 }} />
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 1.5, p: 1.5, mb: 1 }}>
                        <Typography fontSize="0.72rem" color="rgba(255,255,255,0.4)">PUBLIC SUBNET</Typography>
                        <Typography fontFamily="monospace" fontSize="0.78rem" color="#fff">{az.public}</Typography>
                        <Typography fontSize="0.72rem" color="rgba(255,255,255,0.4)" mt={0.5}>NAT Gateway</Typography>
                      </Box>
                      <Box sx={{ bgcolor: 'rgba(42,157,143,0.08)', border: '1px solid rgba(42,157,143,0.2)', borderRadius: 1.5, p: 1.5 }}>
                        <Typography fontSize="0.72rem" color="rgba(255,255,255,0.4)">PRIVATE SUBNET</Typography>
                        <Typography fontFamily="monospace" fontSize="0.78rem" color="#fff">{az.private}</Typography>
                        <Chip label={az.task} size="small" sx={{ mt: 0.5, bgcolor: 'rgba(42,157,143,0.2)', color: '#2a9d8f', fontSize: '0.7rem' }} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Auto Scaling */}
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                <SpeedIcon sx={{ color: '#e63946' }} />
                <Typography fontWeight={800} color="#fff">Auto Scaling Policy</Typography>
                <Chip label="2–4 Tasks" size="small" sx={{ bgcolor: 'rgba(230,57,70,0.15)', color: '#e63946', fontWeight: 700 }} />
              </Box>
              {[
                { metric: 'CPU Utilization',    threshold: 70, current: 45, color: '#2196f3' },
                { metric: 'Memory Utilization', threshold: 80, current: 60, color: '#9c27b0' },
              ].map(m => (
                <Box key={m.metric} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography fontSize="0.82rem" color="rgba(255,255,255,0.6)">{m.metric}</Typography>
                    <Box display="flex" gap={1}>
                      <Chip label={`Current: ${m.current}%`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.65rem' }} />
                      <Chip label={`Scale at: ${m.threshold}%`} size="small" sx={{ bgcolor: `${m.color}20`, color: m.color, fontSize: '0.65rem' }} />
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={m.current}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: m.color } }} />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Infra components */}
          <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            AWS Resources (Terraform IaC)
          </Typography>
          <Grid container spacing={2} mb={3}>
            {INFRA.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.label}>
                <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                      <Typography fontSize="1.8rem">{item.icon}</Typography>
                      <Chip label={item.label} size="small" sx={{ bgcolor: `${item.color}18`, color: item.color, fontWeight: 700 }} />
                    </Box>
                    {item.desc.split('\n').map((line, i) => (
                      <Box key={i} display="flex" alignItems="center" gap={1} mb={0.4}>
                        <CheckCircleIcon sx={{ fontSize: 12, color: item.color }} />
                        <Typography fontSize="0.75rem" color="rgba(255,255,255,0.5)">{line}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Deployment pipeline */}
          <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            Deployment Workflow
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                {PIPELINE.map((p, i) => (
                  <Box key={p.step} display="flex" alignItems="center" gap={1}>
                    <Box textAlign="center">
                      <Avatar sx={{ width: 36, height: 36, bgcolor: `${p.color}22`, border: `2px solid ${p.color}`, color: p.color, fontWeight: 900, fontSize: '0.8rem', mx: 'auto', mb: 0.5 }}>
                        {p.step}
                      </Avatar>
                      <Typography fontWeight={700} color="#fff" fontSize="0.78rem">{p.label}</Typography>
                      <Typography fontSize="0.68rem" color="rgba(255,255,255,0.35)">{p.desc}</Typography>
                    </Box>
                    {i < PIPELINE.length - 1 && (
                      <Typography color="rgba(255,255,255,0.2)" fontSize="1.5rem" mb={2}>→</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 3 }} />
          <Typography textAlign="center" color="rgba(255,255,255,0.2)" fontSize="0.78rem">
            Experiment 9.3 — AWS ECS + ALB + Auto Scaling + Terraform IaC · Production Grade
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
