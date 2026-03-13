const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const router = express.Router()


/* REGISTER */

router.post("/register", async (req,res)=>{

    try{

        const {name,email,password} = req.body

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const user = new User({
            name,
            email,
            password
        })

        await user.save()

        res.status(201).json({
            message:"User registered successfully"
        })

    }
    catch(error){
        res.status(500).json({message:"Server error"})
    }

})


/* LOGIN */

router.post("/login", async (req,res)=>{

    try{

        const {email,password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }

        const accessToken = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"15m"}
        )

        const refreshToken = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        res.json({
            message:"Login successful",
            accessToken,
            refreshToken
        })

    }
    catch(error){
        res.status(500).json({message:"Server error"})
    }

})


/* REFRESH TOKEN */

router.post("/refresh-token",(req,res)=>{

    const {refreshToken} = req.body

    if(!refreshToken){
        return res.status(401).json({message:"Refresh token required"})
    }

    try{

        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET)

        const newAccessToken = jwt.sign(
            {id:decoded.id},
            process.env.JWT_SECRET,
            {expiresIn:"15m"}
        )

        res.json({
            accessToken:newAccessToken
        })

    }
    catch(error){
        res.status(403).json({message:"Invalid refresh token"})
    }

})

module.exports = router