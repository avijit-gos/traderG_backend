const mongoose = require("mongoose");

const preShareSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
    client_id:{
        type:String
    },
    wallet_id:{
        type:String
    },
    tenure:{
        type:Number
    },
    tenure_type:{
        type:String,
        enum:{
            values:["days","months"],
            message:"{VALUE} is not a correct value.Expect days,months"
        }
    },
    start_date:{
        type:Date
    },
    maturity_date:{
        type:Date
    },
    capital:{
        type:Number
    },
    share:{
        type:Number
    },
    monthly_dividend_date:{
        type:Date
    },
    monthly_return_rate:{
        type:Number
    },
    monthly_return_amount:{
        type:Number
    },
    fixed_dividend_amount:{
        type:Number
    },
    monthly_dividend_amount:{
        type:Number
    },
    maturity_amount:{
        type:Number
    },
    agreement_file:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    }


},{timestamps:true})

const PreShare = new mongoose.model("preShare",preShareSchema);

module.exports = PreShare;