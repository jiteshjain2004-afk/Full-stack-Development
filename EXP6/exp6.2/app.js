require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

const authRoutes = require("./routes/authRoutes")
const bankRoutes = require("./routes/bankRoutes")

const app = express()

app.use(express.json())

/* DATABASE CONNECTION */

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch(err=>{
    console.log("Database Error:", err)
})

/* ROOT */

app.get("/",(req,res)=>{
    res.send(`
    <h1>JWT Banking API</h1>

    <h3>Endpoints</h3>

    <ul>
        <li><a href="/api/register">POST /api/register</a></li>
        <li><a href="/api/login">POST /api/login</a></li>
        <li><a href="/api/refresh-token">POST /api/refresh-token</a></li>
        <li><a href="/api/bank/account">GET /api/bank/account</a></li>
        <li><a href="/api/bank/balance">GET /api/bank/balance</a></li>
    </ul>

    <p><b>Note:</b></p>
    <p>POST routes must be tested using Postman.</p>
    <p>Protected routes require header:</p>

    <pre>Authorization: Bearer YOUR_TOKEN</pre>
    `)
})

/* ROUTES */

app.use("/api", authRoutes)
app.use("/api/bank", bankRoutes)

/* SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})