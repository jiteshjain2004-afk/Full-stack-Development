require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

const accountRoutes = require("./routes/accountRoutes")

const app = express()

/* IMPORTANT: Enables JSON request body */
app.use(express.json())

/* DATABASE CONNECTION */

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch(err=>{
    console.log(err)
})

/* HOME PAGE */

app.get("/", (req,res)=>{
    res.send(`
    <h1>Banking Transaction API</h1>

    <h3>Endpoints</h3>

    <h4>Create Account (POST)</h4>
    <p>/api/account/create</p>

    <h4>Transfer Money (POST)</h4>
    <p>/api/transfer</p>

    <h4>View Data</h4>
    <ul>
        <li><a href="/api/accounts">View Accounts</a></li>
        <li><a href="/api/transactions">Transaction Logs</a></li>
    </ul>
    `)
})

/* ROUTES */

app.use("/api", accountRoutes)

/* SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log("Server running on port", PORT)
})