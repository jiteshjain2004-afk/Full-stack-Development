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
        <li>POST /api/register</li>
        <li>POST /api/login</li>
        <li>POST /api/refresh-token</li>
        <li>GET /api/bank/account</li>
        <li>GET /api/bank/balance</li>
    </ul>
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