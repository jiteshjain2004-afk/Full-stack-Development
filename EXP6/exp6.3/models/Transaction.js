const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({

    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    },

    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    },

    amount:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        enum:["SUCCESS","FAILED"],
        default:"SUCCESS"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

})

/* Prevent model overwrite error */

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema)

module.exports = Transaction