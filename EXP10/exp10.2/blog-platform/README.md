# EXP10.2 — Blog Platform with Comments & User Profiles

## Tech Stack
- **Backend**: Express + MongoDB (Mongoose) + JWT + bcryptjs
- **Frontend**: React 18 + React Router 6 + MUI + Axios

## Features
- ✅ User signup/login with JWT auth
- ✅ Create, edit, delete blog posts
- ✅ Add/delete comments on posts
- ✅ Like/unlike posts
- ✅ User profiles with post history
- ✅ Search posts by title/content
- ✅ Filter posts by tag
- ✅ Protected routes

## Project Structure
```
blog-platform/
├── server/
│   ├── models/
│   │   ├── User.js      ← username, email, password, bio
│   │   ├── Post.js      ← title, content, tags, author, likes
│   │   └── Comment.js   ← content, author, post
│   ├── routes/
│   │   ├── auth.js      ← register, login, profile
│   │   ├── posts.js     ← CRUD + like
│   │   ├── comments.js  ← create, delete
│   │   └── users.js     ← public profile
│   ├── middleware/auth.js
│   └── server.js
└── client/
    ├── src/
    │   ├── context/AuthContext.js
    │   ├── components/Navbar.jsx, PostCard.jsx
    │   └── pages/Pages.jsx  ← All pages
    └── package.json
```

## API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ | Register |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/posts | ❌ | Get all posts |
| POST | /api/posts | ✅ | Create post |
| PUT | /api/posts/:id | ✅ | Update post |
| DELETE | /api/posts/:id | ✅ | Delete post |
| PATCH | /api/posts/:id/like | ✅ | Like/unlike |
| POST | /api/comments | ✅ | Add comment |
| DELETE | /api/comments/:id | ✅ | Delete comment |
| GET | /api/users/:id | ❌ | Public profile |

## Run Locally
```bash
# Terminal 1
cd server && npm install && npm start

# Terminal 2
cd client && npm install && npm start
```

## Deploy
- Backend → Render (Root: server/)
- Frontend → Surge/Vercel
  - Env: REACT_APP_API_URL = https://your-render-url.onrender.com/api
