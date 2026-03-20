# Experiment 2.3.1 — MERN Full Stack Integration
## React-Express Integration with Axios

---

## 📁 Project Structure

```
mern-products/
├── server/                  ← Express + MongoDB backend
│   ├── models/
│   │   └── Product.js       ← Mongoose schema
│   ├── routes/
│   │   └── products.js      ← RESTful API routes
│   ├── index.js             ← Server entry point
│   ├── seed.js              ← DB seeder script
│   ├── .env                 ← MongoDB URI (already filled)
│   └── package.json
│
└── client/                  ← React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Loader.jsx           ← Spinner component
    │   │   ├── ErrorAlert.jsx       ← Error display
    │   │   ├── ProductCard.jsx      ← Product grid card
    │   │   └── AddProductModal.jsx  ← Create product modal
    │   ├── api.js           ← Axios instance + API helpers
    │   ├── App.js           ← Root React component
    │   ├── App.css          ← Custom styles
    │   └── index.js         ← ReactDOM entry
    └── package.json
```

---

## ⚙️ Setup & Run

### Step 1 — Install & seed backend

```bash
cd server
npm install
node seed.js          # Populate sample products into MongoDB
npm start             # Starts on http://localhost:5000
```

### Step 2 — Install & run frontend

```bash
cd client
npm install
npm start             # Opens http://localhost:3000
```

---

## 🔌 REST API Endpoints

| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| GET    | /api/products       | Get all products      |
| GET    | /api/products/:id   | Get single product    |
| POST   | /api/products       | Create a product      |
| PUT    | /api/products/:id   | Update a product      |
| DELETE | /api/products/:id   | Delete a product      |
| GET    | /api/health         | Server health check   |

---

## 🧪 Test with Postman

**Create product:**
```
POST http://localhost:5000/api/products
Content-Type: application/json

{ "name": "Gaming Mouse", "price": 1599 }
```

**Get all products:**
```
GET http://localhost:5000/api/products
```

---

## 🎯 Course Outcomes Addressed

| CO   | Coverage                                              |
|------|-------------------------------------------------------|
| CO3  | RESTful API in Express, MongoDB via Mongoose          |
| CO4  | Error handling, loading states, retry logic           |
| CO5  | Full-stack app with frontend, backend, DB integration |
