const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
       // required: [true, "User is required"]
    },
    acc_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountCreationRequests",
       // required: [true, "Product is required"]
    },
    amount:{
        type:Number
    },
    is_success:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const payment = new mongoose.model("payment",paymentSchema);

module.exports = payment;
