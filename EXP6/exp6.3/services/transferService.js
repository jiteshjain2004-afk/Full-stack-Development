const mongoose = require("mongoose")

const Account = require("../models/Account")
const Transaction = require("../models/Transaction")

const transferMoney = async (fromId, toId, amount) => {

    const session = await mongoose.startSession()

    session.startTransaction()

    try{

        const fromAccount = await Account.findById(fromId).session(session)
        const toAccount = await Account.findById(toId).session(session)

        if(!fromAccount || !toAccount){
            throw new Error("Account not found")
        }

        if(fromAccount.balance < amount){
            throw new Error("Insufficient balance")
        }

        /* Update balances */

        fromAccount.balance -= amount
        toAccount.balance += amount

        await fromAccount.save({session})
        await toAccount.save({session})

        /* Log successful transaction */

        await Transaction.create([{
            fromAccount:fromId,
            toAccount:toId,
            amount,
            status:"SUCCESS"
        }],{session})

        await session.commitTransaction()
        session.endSession()

        return {message:"Transfer successful"}

    }
    catch(error){

        await session.abortTransaction()
        session.endSession()

        /* Log failed transaction */

        await Transaction.create({
            fromAccount:fromId,
            toAccount:toId,
            amount,
            status:"FAILED"
        })

        throw error
    }

}

module.exports = transferMoney