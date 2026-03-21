# EXP10.3 — Social Media App with AWS Deployment

## Tech Stack
- **Backend**: Express + MongoDB + JWT + bcryptjs
- **Frontend**: React 18 + React Router 6 + MUI + Axios
- **AWS**: ECS Fargate + ALB + ECR + Auto Scaling
- **IaC**: Terraform 1.5+

## Features
- ✅ Register/Login with JWT auth
- ✅ Create, edit, delete posts
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ Follow/unfollow users
- ✅ Personal feed (posts from followed users)
- ✅ Explore page (all posts + user search)
- ✅ User profiles with follower/following counts
- ✅ Edit bio

## Project Structure
```
social-app/
├── server/           ← Express API
├── client/           ← React frontend
├── terraform/        ← AWS IaC (VPC, ECS, ALB, Auto Scaling)
└── .github/workflows/deploy.yml  ← CI/CD
```

## Run Locally
```bash
# Terminal 1
cd server && npm install && npm start

# Terminal 2
cd client && npm install && npm start
```

## AWS Deploy
```bash
cd terraform
terraform init
terraform apply -var="mongo_uri=YOUR_URI" -var="jwt_secret=YOUR_SECRET"
```

## API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ | Register |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/posts | ❌ | All posts feed |
| GET | /api/posts/feed | ✅ | Following feed |
| POST | /api/posts | ✅ | Create post |
| PATCH | /api/posts/:id/like | ✅ | Like/unlike |
| POST | /api/posts/:id/comments | ✅ | Add comment |
| GET | /api/users/:id | ❌ | User profile |
| PATCH | /api/users/:id/follow | ✅ | Follow/unfollow |
