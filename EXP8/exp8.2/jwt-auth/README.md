# Experiment 8.2 — JWT Protected Routes

## Tech Stack
- **Backend**: Express 4 + jsonwebtoken 9 + bcryptjs
- **Frontend**: React 18 + React Router 6 + Axios + MUI

## Structure
```
jwt-auth/
├── server/
│   ├── server.js            ← Express + JWT routes
│   ├── middleware/auth.js   ← verifyToken middleware
│   └── package.json
└── client/
    ├── src/
    │   ├── api.js                    ← Axios + JWT interceptor
    │   ├── context/AuthContext.js    ← Global auth state
    │   ├── components/
    │   │   └── ProtectedRoute.jsx    ← Route guard
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── Dashboard.jsx         ← Protected page
    │   │   └── Unauthorized.jsx
    │   └── App.js                    ← React Router setup
    └── package.json
```

## Demo Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| user | user123 | Student |
| jitesh | jitesh123 | Developer |

## API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/login | ❌ | Login, returns JWT |
| GET | /api/protected | ✅ JWT | Verify token |
| GET | /api/profile | ✅ JWT | User profile |
| GET | /api/admin | ✅ Admin only | Admin data |

## Run Locally
```bash
# Terminal 1
cd server && npm install && npm start   # localhost:3001

# Terminal 2
cd client && npm install && npm start   # localhost:3000
```

## Objectives Covered
1. ✅ JWT auth setup — sign + verify with jsonwebtoken
2. ✅ Protected route logic — ProtectedRoute component
3. ✅ Token verification — verifyToken middleware
4. ✅ Route guards — React Router + role-based access
5. ✅ Middleware setup — Express auth middleware
