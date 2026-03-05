require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const logger = require("./middleware/logger")
const auth = require("./middleware/auth")
const errorHandler = require("./middleware/errorHandler")


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(logger)

mongoose.connect(process.env.MONGO_URI)

.then(() => {
    console.log("MongoDB Connected")
})

.catch((err) => {
    console.log("Database Error:", err)
})

app.get("/", (req,res)=>{
    res.send(`
        <h1>EXP6 Middleware API</h1>
        <h3>Available Endpoints</h3>
        <ul>
            <li><a href="/protected">/protected</a></li>
            <li><a href="/error">/error</a></li>
        </ul>
        <p>Protected route requires header:</p>
        <pre>Authorization: mysecrettoken</pre>
    `)
})
app.get("/protected", auth, (req,res)=>{
    res.send("Protected route accessed")
})
app.get("/error", (req,res,next)=>{

    const err = new Error("Something went wrong")

    next(err)

})
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})