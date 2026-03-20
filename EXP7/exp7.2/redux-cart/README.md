# Experiment 2.3.2 — Redux Shopping Cart

## Aim
Implement Redux for state management in shopping carts.

## Tech Stack
- React 18
- Redux Toolkit 2.0
- React-Redux 9
- redux-persist (localStorage)
- Material UI 5.14

## Project Structure
```
redux-cart/
├── public/index.html
├── src/
│   ├── store/
│   │   ├── store.js        ← Redux store + redux-persist config
│   │   ├── cartSlice.js    ← Cart reducers (add/remove/update/clear)
│   │   └── products.js     ← Product data
│   ├── components/
│   │   ├── Navbar.jsx      ← Navbar with cart badge + total
│   │   ├── ProductGrid.jsx ← Shop page
│   │   └── Cart.jsx        ← Cart table (matches expected output)
│   ├── App.js
│   └── index.js            ← Provider + PersistGate + ThemeProvider
└── package.json
```

## Run Locally
```bash
npm install
npm start
```

## Objectives Covered
1. ✅ Redux store configured with Toolkit
2. ✅ Cart slice with add/remove/update/clear reducers
3. ✅ Cart operations fully implemented
4. ✅ Components connected to Redux store via useSelector/useDispatch
5. ✅ Cart persisted to localStorage via redux-persist
