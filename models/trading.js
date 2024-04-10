const mongoose = require("mongoose");

const tradingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    client_id:{
        type:String
    },
    wallet_id:{
        type:String
    },
    capital:{
        type:Number
    },
    tenure:{
        type:Number
    },
    tenure_type:{
        type:String,
        enum:{
            values:["days","months"],
            message:"{VALUE} is not correct value.Expect days,months"
        }
    },
    risk:{
        type:Number
    },
    agreement_file:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const Trading = new mongoose.model("trading",tradingSchema);

module.exports = Trading;