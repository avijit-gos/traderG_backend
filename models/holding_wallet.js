const mongoose = require("mongoose");

const holdingWalletSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    holding_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"holdings",
    },
    type:{
        type:String,
        enum:{
            values:["credit","debit"],
            message:'please select between -credit/debit'
        }
    },
    amount:{
        type:Number
    },
    total_amount:{
        type:Number
    },
    date:{
        type:Date
    },
    comment:{
       type:String
    },
    status:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

const HoldingWallet = new mongoose.model("holdingWallets",holdingWalletSchema);

module.exports = HoldingWallet;