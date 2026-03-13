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

app.get("/", (req,res)=>{
res.send(`
<h1>JWT Banking API</h1>

<h2>POST Endpoints (Use Postman)</h2>
<ul>
<li>/api/register</li>
<li>/api/login</li>
<li>/api/refresh-token</li>
</ul>

<h2>GET Endpoints (Clickable)</h2>
<ul>
<li><a href="/api/bank/account">Account Info</a></li>
<li><a href="/api/bank/balance">Account Balance</a></li>
</ul>

<p><b>Authorization Header Required:</b></p>
<pre>Authorization: Bearer YOUR_ACCESS_TOKEN</pre>
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