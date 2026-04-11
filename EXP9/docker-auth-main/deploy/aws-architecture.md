# AWS Deployment Architecture (EC2 + ALB)

## Components

1. Application Load Balancer (ALB)
- Internet-facing
- Listener `80` -> target group `frontend-tg` (EC2 instances on `8080`)
- Listener rule `/api/*` -> target group `backend-tg` (EC2 instances on `5000`) or same instances/containers

2. EC2 Auto Scaling Group (recommended)
- Launch template with Docker installed
- User data bootstraps app and runs `docker-compose.prod.yml`
- Minimum 2 instances across 2 AZs for high availability

3. Security Groups
- ALB SG: allow `80/443` from internet
- EC2 SG: allow `8080` and `5000` from ALB SG only
- SSH (`22`) restricted to admin IPs

4. Database
- MongoDB Atlas (recommended) with IP/network restrictions
- Store connection string in EC2 environment variables or AWS SSM Parameter Store

## ALB Routing

- `http://<ALB_DNS>/` -> frontend container (`:8080`)
- `http://<ALB_DNS>/api/*` -> backend container (`:5000`)

## Health Checks

- Frontend target group health path: `/`
- Backend target group health path: `/api/health`
