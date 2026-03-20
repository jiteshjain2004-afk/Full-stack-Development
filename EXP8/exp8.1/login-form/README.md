# Login Form — React State Management

## Tech Stack
- React 18 + React Hook Form 7.49
- Material UI 5.14
- React hooks: useState, useForm, Controller

## Structure
```
login-form/
├── public/index.html
├── src/
│   ├── auth.js                  ← Mock auth with demo users
│   ├── components/
│   │   ├── LoginForm.jsx        ← Form + validation + loading
│   │   └── Dashboard.jsx        ← Success screen
│   ├── App.js                   ← State: user (null | object)
│   └── index.js
└── package.json
```

## Demo Credentials
| Email | Password |
|-------|----------|
| admin@demo.com | password123 |
| student@demo.com | student123 |
| test@demo.com | test1234 |

## Run
```bash
npm install && npm start
```

## Objectives Covered
1. ✅ Responsive login UI — MUI + dark theme
2. ✅ Form validation — React Hook Form with rules
3. ✅ React hooks — useState, useForm, Controller
4. ✅ Form submission — async mock auth with loading
5. ✅ Auth feedback — success alert, error alert, spinner
