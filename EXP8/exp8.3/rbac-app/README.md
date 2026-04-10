# Experiment 8.3 — Role-Based Access Control (RBAC)

## Tech Stack
- **Backend**: Express 4 + Mongoose 7.6 + jsonwebtoken + bcryptjs
- **Frontend**: React 18 + React Router 6 + MUI + Axios

## Role Hierarchy
```
admin > moderator > user
```

## Project Structure
```
rbac-app/
├── server/
│   ├── models/User.js          ← Mongoose schema with role field
│   ├── middleware/auth.js      ← authenticate + authorize middleware
│   ├── routes/
│   │   ├── auth.js             ← /api/auth/login, /register
│   │   ├── users.js            ← /api/users (admin/mod only)
│   │   └── content.js          ← role-gated content routes
│   ├── seed.js                 ← seed demo users
│   └── server.js
└── client/
    ├── src/
    │   ├── context/AuthContext.js   ← hasRole, hasMinRole helpers
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   ← role-based route guard
    │   │   └── Navbar.jsx           ← role-based menu
    │   └── pages/
    │       ├── LoginPage.jsx
    │       ├── Dashboard.jsx        ← shows accessible routes per role
    │       └── Pages.jsx            ← Admin, Moderator, Profile, AccessDenied
    └── package.json
```

## Demo Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| moderator | mod123 | moderator |
| alice | alice123 | user |
| bob | bob123 | user |
| jitesh | jitesh123 | user |

## API Endpoints
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/login | Public |
| POST | /api/auth/register | Public |
| GET | /api/users | admin, moderator |
| PUT | /api/users/:id/role | admin only |
| PUT | /api/users/:id/status | admin only |
| DELETE | /api/users/:id | admin only |
| GET | /api/content/public | Public |
| GET | /api/content/user | Any auth user |
| GET | /api/content/moderator | moderator, admin |
| GET | /api/content/admin | admin only |

## Run Locally
```bash
# Terminal 1
cd server
cp .env.example .env
# fill in MONGO_URI and JWT_SECRET in server/.env
npm install
node seed.js
npm start

# Terminal 2
cd client && npm install && npm start
```

## Security Note
- Do not commit real secrets to `server/.env` or deployment manifests.
- Use `server/.env.example` as the template for local setup.
- If the leaked MongoDB password or JWT secret are still active, rotate them in your MongoDB provider and deployment settings.

## Objectives Covered
1. ✅ Role hierarchy — admin > moderator > user
2. ✅ Permissions assigned per role
3. ✅ API-level restrictions — authorize() middleware
4. ✅ Frontend route guards — ProtectedRoute with roles prop
5. ✅ Role-based UI — navbar, dashboard cards, admin panel
