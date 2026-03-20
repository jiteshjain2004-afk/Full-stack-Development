# Experiment 9.2 — CI/CD Pipeline with GitHub Actions

## Pipeline Overview
```
Code Push → Test → Build → Docker Push (GHCR) → Deploy → Slack Notify
```

## Workflow Files
```
.github/workflows/
├── ci-cd.yml       ← Main pipeline (5 jobs)
└── pr-checks.yml   ← PR-only test + comment
```

## Jobs
| Job | Trigger | Does |
|-----|---------|------|
| test | Every push/PR | Jest tests + coverage |
| build | After test passes | React production build |
| docker | After build (main only) | Build + push to GHCR |
| deploy | After docker | GitHub Pages deploy |
| notify | Always | Slack success/failure message |

## Docker Image Tags
- `ghcr.io/USERNAME/cicd-pipeline-app:latest` — latest main build
- `ghcr.io/USERNAME/cicd-pipeline-app:sha-xxxxxxx` — specific commit

## GitHub Secrets Needed
| Secret | How to get |
|--------|-----------|
| `GITHUB_TOKEN` | Auto-provided by GitHub |
| `SLACK_WEBHOOK_URL` | Slack App → Incoming Webhooks |

## Setup Steps
1. Push this folder to your GitHub repo
2. Go to repo → Actions tab — pipeline runs automatically!
3. For Slack: create app at api.slack.com → add `SLACK_WEBHOOK_URL` secret
4. For GHCR: `GITHUB_TOKEN` is automatic — no setup needed

## Objectives Covered
1. ✅ GitHub Actions workflow — `.github/workflows/ci-cd.yml`
2. ✅ Testing stage — Jest with coverage report artifact
3. ✅ Docker build and push — GHCR with Buildx cache
4. ✅ Deploy to GitHub Packages/Pages
5. ✅ Slack notifications — success and failure alerts
