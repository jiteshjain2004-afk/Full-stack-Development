const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User")

const router = express.Router()


/* ACCOUNT INFO */

router.get("/account",authMiddleware, async (req,res)=>{

    const user = await User.findById(req.user.id).select("-password")

    res.json(user)

})


/* BALANCE */

router.get("/balance",authMiddleware, async (req,res)=>{

    const user = await User.findById(req.user.id)

    res.json({
        balance:user.balance
    })

})


module.exports = router