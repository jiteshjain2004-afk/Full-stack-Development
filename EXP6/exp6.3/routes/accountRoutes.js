const express = require("express")

const Account = require("../models/Account")
const Transaction = require("../models/Transaction")
const transferMoney = require("../services/transferService")

const router = express.Router()


/* CREATE ACCOUNT */

router.post("/account/create", async (req,res)=>{

    try{

        const {name,email,balance} = req.body

        if(!name || !email){
            return res.status(400).json({
                message:"Name and email required"
            })
        }

        const account = new Account({
            name,
            email,
            balance: balance || 0
        })

        await account.save()

        res.json({
            message:"Account created",
            account
        })

    }
    catch(error){

        res.status(500).json({
            message:error.message
        })

    }

})


/* MONEY TRANSFER */

router.post("/transfer", async (req,res)=>{

    try{

        const {fromId,toId,amount} = req.body

        const result = await transferMoney(fromId,toId,amount)

        res.json(result)

    }
    catch(error){

        res.status(400).json({
            message:error.message
        })

    }

})


/* VIEW ACCOUNTS */

router.get("/accounts", async (req,res)=>{

    const accounts = await Account.find()

    res.json(accounts)

})


/* VIEW TRANSACTION LOGS */

router.get("/transactions", async (req,res)=>{

    const transactions = await Transaction.find()
    .populate("fromAccount","name email")
    .populate("toAccount","name email")

    res.json(transactions)

})

module.exports = router