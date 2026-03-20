# Experiment 9.1 — Dockerize React with Multi-Stage Build

## Tech Stack
- React 18 + MUI
- Docker 20.10+ multi-stage build
- Nginx 1.25-alpine (production server)
- Node 18-alpine (build stage only)

## Project Structure
```
docker-react/
├── Dockerfile           ← Multi-stage build (core of experiment)
├── docker-compose.yml   ← Easy build + run
├── .dockerignore        ← Keep image lean
├── nginx/
│   └── nginx.conf       ← Gzip + caching + React Router support
├── src/
│   ├── App.js           ← Docker info dashboard UI
│   └── index.js
└── public/index.html
```

## 🐳 Docker Commands

### Build the image
```bash
docker build -t docker-react-app .
```

### Run the container
```bash
docker run -p 8080:8080 docker-react-app
```
Open: http://localhost:8080

### With environment variables
```bash
docker build \
  --build-arg REACT_APP_ENV=production \
  --build-arg REACT_APP_VERSION=1.0.0 \
  -t docker-react-app .
```

### Using Docker Compose (easiest)
```bash
docker-compose up --build
```

### Check image size (should be ~25-30MB)
```bash
docker images docker-react-app
```

### View running containers
```bash
docker ps
```

### Stop container
```bash
docker stop docker-react-prod
```

### Remove image
```bash
docker rmi docker-react-app
```

## How Multi-Stage Works

| Stage | Base Image | Size | Purpose |
|-------|-----------|------|---------|
| builder | node:18-alpine | ~350MB | Install deps + build React |
| production | nginx:1.25-alpine | ~25MB | Serve built files only |

The final image is ~25MB because node_modules (~300MB) are left behind in Stage 1!

## Nginx Features
- ✅ Gzip compression for all text assets
- ✅ 1-year cache for JS/CSS (content-hashed)
- ✅ No-cache for index.html (instant deploys)
- ✅ React Router support (try_files fallback)
- ✅ Security headers (XSS, clickjack, MIME-sniff)
- ✅ Health check at /health

## Objectives Covered
1. ✅ Dockerfile with build stage (node:18-alpine)
2. ✅ Production Nginx server (nginx:1.25-alpine)
3. ✅ Optimized image size (~25MB vs 350MB)
4. ✅ Environment variables via --build-arg
5. ✅ Build and run with docker build + docker run
