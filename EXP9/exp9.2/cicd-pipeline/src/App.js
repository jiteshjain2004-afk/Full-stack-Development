import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Grid,
  Stepper, Step, StepLabel, StepContent, Button,
  Divider, createTheme, ThemeProvider, Avatar, Fade,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScienceIcon from '@mui/icons-material/Science';
import BuildIcon from '@mui/icons-material/Build';
import DockerIcon from '@mui/icons-material/Storage';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';

const theme = createTheme({
  typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  palette: { mode: 'dark', primary: { main: '#2196f3' } },
});

const PIPELINE_STEPS = [
  {
    label: '🧪 Test',
    job: 'test',
    color: '#9c27b0',
    icon: <ScienceIcon />,
    trigger: 'On every push & PR',
    steps: [
      'actions/checkout@v4',
      'actions/setup-node@v4 (Node 18)',
      'npm ci',
      'npm run test:coverage',
      'Upload coverage artifact',
    ],
    desc: 'Runs Jest unit tests with coverage report. Blocks build if tests fail.',
  },
  {
    label: '🏗️ Build',
    job: 'build',
    color: '#f4a261',
    icon: <BuildIcon />,
    trigger: 'After tests pass',
    steps: [
      'npm ci',
      'npm run build (production)',
      'Inject REACT_APP_VERSION=$SHA',
      'Upload build artifact',
    ],
    desc: 'Builds optimized React bundle with commit SHA as version.',
  },
  {
    label: '🐳 Docker',
    job: 'docker',
    color: '#2196f3',
    icon: <DockerIcon />,
    trigger: 'After build (main branch only)',
    steps: [
      'Login to GHCR',
      'docker/metadata-action (tags)',
      'docker/setup-buildx-action',
      'Build & push: tag latest',
      'Build & push: tag sha-xxxxxxx',
    ],
    desc: 'Builds multi-stage Docker image and pushes to GitHub Container Registry with 2 tags.',
  },
  {
    label: '🚀 Deploy',
    job: 'deploy',
    color: '#2a9d8f',
    icon: <RocketLaunchIcon />,
    trigger: 'After Docker push',
    steps: [
      'Download build artifact',
      'peaceiris/actions-gh-pages@v3',
      'Push to gh-pages branch',
      'GitHub Pages serves app',
    ],
    desc: 'Deploys built React app to GitHub Pages automatically.',
  },
  {
    label: '📢 Notify',
    job: 'notify',
    color: '#e63946',
    icon: <NotificationsIcon />,
    trigger: 'Always (success or failure)',
    steps: [
      'slackapi/slack-github-action',
      'Send ✅ on success with image tags',
      'Send ❌ on failure with job details',
      'Write GitHub Step Summary',
    ],
    desc: 'Sends Slack notifications with deployment details and image digest.',
  },
];

const SECRETS = [
  { name: 'GITHUB_TOKEN', desc: 'Auto-provided by GitHub — push to GHCR', auto: true },
  { name: 'SLACK_WEBHOOK_URL', desc: 'Incoming Webhook from Slack App settings', auto: false },
];

const TAGS = [
  { tag: 'latest', desc: 'Always points to newest main build', color: '#2a9d8f' },
  { tag: 'sha-a1b2c3d', desc: 'Immutable — specific commit reference', color: '#2196f3' },
  { tag: 'main', desc: 'Branch-based tag', color: '#9c27b0' },
];

export default function App() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117', p: { xs: 2, md: 4 } }}>
        <Box maxWidth={960} mx="auto">

          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
              <GitHubIcon sx={{ fontSize: 40, color: '#fff' }} />
              <Typography variant="h3" fontWeight={900} color="#fff" letterSpacing={-1}>
                CI/<span style={{ color: '#2196f3' }}>CD</span> Pipeline
              </Typography>
            </Box>
            <Typography color="rgba(255,255,255,0.45)" mb={2}>
              Experiment 9.2 — GitHub Actions · Docker · GHCR · Slack Notifications
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              {['GitHub Actions', 'Docker GHCR', 'Slack Notify', 'Auto Deploy', 'Node 18'].map(l => (
                <Chip key={l} label={l} size="small"
                  sx={{ bgcolor: 'rgba(33,150,243,0.12)', color: '#2196f3', fontWeight: 700, border: '1px solid rgba(33,150,243,0.2)' }} />
              ))}
            </Box>
          </Box>

          {/* Trigger info */}
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={800} color="#fff" mb={2} display="flex" alignItems="center" gap={1}>
                <CodeIcon sx={{ color: '#2196f3' }} /> Workflow Triggers
              </Typography>
              <Grid container spacing={2}>
                {[
                  { event: 'push to main', effect: 'Full pipeline: Test → Build → Docker → Deploy → Notify', color: '#2a9d8f' },
                  { event: 'push to develop', effect: 'Test + Build only (no Docker push)', color: '#f4a261' },
                  { event: 'pull_request to main', effect: 'PR checks: Test only + PR comment', color: '#9c27b0' },
                ].map(t => (
                  <Grid item xs={12} sm={4} key={t.event}>
                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 2 }}>
                      <Chip label={t.event} size="small" sx={{ bgcolor: `${t.color}20`, color: t.color, fontWeight: 700, mb: 1, fontSize: '0.7rem' }} />
                      <Typography fontSize="0.78rem" color="rgba(255,255,255,0.5)">{t.effect}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Pipeline stepper */}
          <Typography fontWeight={700} color="rgba(255,255,255,0.5)" fontSize="0.72rem"
            textTransform="uppercase" letterSpacing={1} mb={2}>
            Pipeline Jobs
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {PIPELINE_STEPS.map((step, i) => (
                  <Step key={step.job} expanded>
                    <StepLabel
                      onClick={() => setActiveStep(i)}
                      sx={{ cursor: 'pointer' }}
                      StepIconComponent={() => (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: activeStep >= i ? step.color : 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
                          {activeStep > i ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : step.icon}
                        </Avatar>
                      )}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Typography fontWeight={800} color="#fff">{step.label}</Typography>
                        <Chip label={step.trigger} size="small"
                          sx={{ bgcolor: `${step.color}18`, color: step.color, fontSize: '0.65rem', fontWeight: 600 }} />
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="0.8rem" color="rgba(255,255,255,0.45)" mb={1.5}>{step.desc}</Typography>
                      <Box display="flex" flexDirection="column" gap={0.6} mb={2}>
                        {step.steps.map(s => (
                          <Box key={s} display="flex" alignItems="center" gap={1}>
                            <CheckCircleIcon sx={{ fontSize: 13, color: step.color }} />
                            <Typography fontFamily="monospace" fontSize="0.75rem" color="rgba(255,255,255,0.6)">{s}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button size="small" variant="outlined"
                        onClick={() => setActiveStep(Math.min(i + 1, PIPELINE_STEPS.length - 1))}
                        sx={{ borderRadius: 2, borderColor: step.color, color: step.color, fontSize: '0.75rem', '&:hover': { borderColor: step.color, bgcolor: `${step.color}12` } }}>
                        Next Stage →
                      </Button>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          <Grid container spacing={3} mb={3}>
            {/* Docker image tags */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography fontWeight={800} color="#fff" mb={2}>🐳 Docker Image Tags</Typography>
                  <Typography fontFamily="monospace" fontSize="0.72rem" color="rgba(255,255,255,0.3)" mb={2}>
                    ghcr.io/username/cicd-pipeline-app:
                  </Typography>
                  {TAGS.map(t => (
                    <Box key={t.tag} mb={1.5} sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 1.5 }}>
                      <Chip label={t.tag} size="small" sx={{ bgcolor: `${t.color}20`, color: t.color, fontWeight: 700, fontFamily: 'monospace', mb: 0.5 }} />
                      <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)">{t.desc}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* GitHub Secrets */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography fontWeight={800} color="#fff" mb={2}>🔐 GitHub Secrets Required</Typography>
                  {SECRETS.map(s => (
                    <Box key={s.name} mb={2} sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, p: 1.5 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography fontFamily="monospace" fontWeight={700} color="#e9c46a" fontSize="0.82rem">{s.name}</Typography>
                        {s.auto && <Chip label="Auto" size="small" sx={{ bgcolor: 'rgba(42,157,143,0.2)', color: '#2a9d8f', fontSize: '0.6rem', height: 16 }} />}
                      </Box>
                      <Typography fontSize="0.75rem" color="rgba(255,255,255,0.4)">{s.desc}</Typography>
                    </Box>
                  ))}
                  <Typography fontSize="0.72rem" color="rgba(255,255,255,0.25)" mt={1}>
                    Add secrets: GitHub repo → Settings → Secrets and variables → Actions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 3 }} />
          <Typography textAlign="center" color="rgba(255,255,255,0.2)" fontSize="0.78rem">
            Experiment 9.2 — CI/CD Pipeline with GitHub Actions · Docker GHCR · Slack Notifications
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
