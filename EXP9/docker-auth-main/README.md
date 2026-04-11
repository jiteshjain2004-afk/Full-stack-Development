# Dockerized Full-Stack Authentication Dashboard

Production-ready MERN authentication dashboard with Docker, CI/CD, and AWS deployment assets.

## Stack

- Frontend: React + Tailwind CSS + Axios + React Router
- Backend: Node.js + Express + JWT + bcrypt + Mongoose
- Database: MongoDB (local container for development, Atlas for production)
- DevOps: Docker multi-stage builds, Docker Compose, GitHub Actions, AWS EC2 + ALB design

## Features

- User signup/login with JWT authentication
- Password hashing using bcrypt
- Protected dashboard route
- API health and uptime metrics
- Responsive UI + light/dark theme toggle
- Production Nginx serving frontend with gzip + cache headers

## Project Structure

```text
my-react-docker-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── nginx.conf
│   └── Dockerfile
├── .github/workflows/ci-cd.yml
├── deploy/
│   ├── aws-architecture.md
│   └── ec2/
│       ├── docker-compose.prod.yml
│       └── setup.sh
├── docker-compose.yml
├── .env
└── .env.example
```

## Local Run (Docker)

```bash
docker compose build
docker compose up -d
```

Open:
- Frontend: `http://localhost:8080`
- Backend health: `http://localhost:8080/api/health`

## Environment Variables

Use `.env.example` as reference.

Important backend vars:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_ORIGIN`

## CI/CD (GitHub Actions)

Workflow file: `.github/workflows/ci-cd.yml`

It performs:
1. Backend install + lint
2. Frontend install + build
3. Build and push Docker images to Docker Hub
4. Optional EC2 deploy over SSH (if secrets are set)

Required GitHub Secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `EC2_HOST` (optional for auto-deploy)
- `EC2_USER` (optional for auto-deploy)
- `EC2_SSH_KEY` (optional for auto-deploy)

## AWS Deployment (EC2 + ALB)

See:
- `deploy/aws-architecture.md`
- `deploy/ec2/setup.sh`
- `deploy/ec2/docker-compose.prod.yml`

High-level flow:
1. Launch EC2 instances (recommend ASG with 2 instances).
2. Run `deploy/ec2/setup.sh`.
3. Place and configure `docker-compose.prod.yml`.
4. Attach instances to ALB target groups.
5. Route `/` to frontend and `/api/*` to backend.

## Evidence Checklist for Final Submission

- Public ALB URL
- GitHub repository link
- Application screenshots (login, signup, dashboard)
- Docker container screenshots (`docker compose ps`)
- GitHub Actions success run screenshot
